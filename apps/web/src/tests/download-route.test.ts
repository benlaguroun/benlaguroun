import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  findEntitlement: vi.fn(),
  getSession: vi.fn(),
  rateLimited: vi.fn(() => false),
}));

vi.mock("@brand/db", () => ({ prisma: { entitlement: { findUnique: mocks.findEntitlement } } }));
vi.mock("@/lib/session", () => ({ getSession: mocks.getSession }));
vi.mock("@/lib/rate-limit", () => ({ rateLimited: mocks.rateLimited }));
vi.mock("@/lib/errors", () => ({ reportError: vi.fn(async () => {}) }));

import { GET } from "@/app/api/download/[productId]/route";
import { signedDownloadUrl } from "@/lib/downloads";

const get = (url: string) => GET(new Request(url), { params: Promise.resolve({ productId: "p1" }) });

beforeEach(() => {
  vi.clearAllMocks();
  mocks.rateLimited.mockReturnValue(false);
});

describe("download route", () => {
  it("sends a signed-out visitor to the login page", async () => {
    mocks.getSession.mockResolvedValue(null);
    const res = await get("https://example.test/api/download/p1");
    expect(res.status).toBeGreaterThanOrEqual(300);
    expect(res.status).toBeLessThan(400);
    expect(res.headers.get("location")).toContain("/login");
    expect(mocks.findEntitlement).not.toHaveBeenCalled();
  });

  it("rejects a forged link with 410 and never touches the database", async () => {
    const res = await get("https://example.test/api/download/p1?t=forged.token");
    expect(res.status).toBe(410);
    expect(mocks.findEntitlement).not.toHaveBeenCalled();
  });

  it("refuses a signed-in user who did not buy the product", async () => {
    mocks.getSession.mockResolvedValue({ user: { id: "u1" } });
    mocks.findEntitlement.mockResolvedValue(null);
    expect((await get("https://example.test/api/download/p1")).status).toBe(403);
  });

  it("stops a refunded buyer's old email link: the link is valid but the entitlement is gone", async () => {
    mocks.findEntitlement.mockResolvedValue(null);
    const res = await get(signedDownloadUrl("p1", "u1"));
    expect(res.status).toBe(403);
    expect(mocks.findEntitlement).toHaveBeenCalledWith(expect.objectContaining({ where: { userId_productId: { userId: "u1", productId: "p1" } } }));
  });

  it("only reveals the external link after the ownership check passes", async () => {
    mocks.getSession.mockResolvedValue({ user: { id: "u1" } });
    mocks.findEntitlement.mockResolvedValue({ product: { slug: "s", deliveryUrl: "https://files.example.com/x.zip", deliveryFile: null, deliveryName: null } });
    const res = await get("https://example.test/api/download/p1");
    expect(res.headers.get("location")).toBe("https://files.example.com/x.zip");
  });

  it("limits repeated downloads", async () => {
    mocks.getSession.mockResolvedValue({ user: { id: "u1" } });
    mocks.rateLimited.mockReturnValue(true);
    expect((await get("https://example.test/api/download/p1")).status).toBe(429);
    expect(mocks.findEntitlement).not.toHaveBeenCalled();
  });

  it("says so when there is nothing to download", async () => {
    mocks.getSession.mockResolvedValue({ user: { id: "u1" } });
    mocks.findEntitlement.mockResolvedValue({ product: { slug: "s", deliveryUrl: null, deliveryFile: null, deliveryName: null } });
    expect((await get("https://example.test/api/download/p1")).status).toBe(404);
  });
});
