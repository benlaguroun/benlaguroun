import { describe, expect, it, vi } from "vitest";
import { isPrivateName, safeDownloadName, signedDownloadUrl, sniffPrivate, verifyDownloadToken } from "@/lib/downloads";

const tokenOf = (url: string) => new URL(url).searchParams.get("t")!;

describe("signed download links", () => {
  it("accepts a fresh link for the same product and returns the buyer", () => {
    const url = signedDownloadUrl("prod-1", "user-1");
    expect(verifyDownloadToken("prod-1", tokenOf(url))).toBe("user-1");
  });

  it("rejects the link when used for a different product", () => {
    const url = signedDownloadUrl("prod-1", "user-1");
    expect(verifyDownloadToken("prod-2", tokenOf(url))).toBeNull();
  });

  it("rejects a link whose user part was swapped", () => {
    const [, sig] = tokenOf(signedDownloadUrl("prod-1", "user-1")).split(".");
    const forgedBody = Buffer.from(`user-2.${Date.now() + 86_400_000}`).toString("base64url");
    expect(verifyDownloadToken("prod-1", `${forgedBody}.${sig}`)).toBeNull();
  });

  it("rejects an expired link", () => {
    const url = signedDownloadUrl("prod-1", "user-1", -1);
    expect(verifyDownloadToken("prod-1", tokenOf(url))).toBeNull();
  });

  it("rejects garbage without throwing", () => {
    expect(verifyDownloadToken("prod-1", "nonsense")).toBeNull();
    expect(verifyDownloadToken("prod-1", "a.b")).toBeNull();
    expect(verifyDownloadToken("prod-1", "")).toBeNull();
  });

  it("expires after the number of days given", () => {
    vi.useFakeTimers();
    try {
      const url = signedDownloadUrl("prod-1", "user-1", 7);
      vi.setSystemTime(Date.now() + 6 * 86_400_000);
      expect(verifyDownloadToken("prod-1", tokenOf(url))).toBe("user-1");
      vi.setSystemTime(Date.now() + 2 * 86_400_000);
      expect(verifyDownloadToken("prod-1", tokenOf(url))).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("private files", () => {
  it("only accepts file names this site generated", () => {
    expect(isPrivateName("0b8e2f7a-1c3d-4e5f-8a9b-0c1d2e3f4a5b.zip")).toBe(true);
    expect(isPrivateName("0b8e2f7a-1c3d-4e5f-8a9b-0c1d2e3f4a5b.pdf")).toBe(true);
    expect(isPrivateName("../../etc/passwd")).toBe(false);
    expect(isPrivateName("0b8e2f7a-1c3d-4e5f-8a9b-0c1d2e3f4a5b.exe")).toBe(false);
    expect(isPrivateName("report.pdf")).toBe(false);
  });

  it("judges the type by the first bytes", () => {
    expect(sniffPrivate(new Uint8Array([0x50, 0x4b, 0x03, 0x04, 0]))).toBe("zip");
    expect(sniffPrivate(new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d]))).toBe("pdf");
    expect(sniffPrivate(new Uint8Array([0x4d, 0x5a, 0x90, 0x00]))).toBeNull(); // a Windows program
    expect(sniffPrivate(new Uint8Array([]))).toBeNull();
  });

  it("makes a safe download file name", () => {
    expect(safeDownloadName('evil"\r\nname.zip', "x.zip")).toBe("evilname.zip");
    expect(safeDownloadName("../../secret.zip", "x.zip")).toBe("....secret.zip");
    expect(safeDownloadName("", "fallback.zip")).toBe("fallback.zip");
    expect(safeDownloadName(null, "fallback.zip")).toBe("fallback.zip");
    expect(safeDownloadName("Modèle école.zip", "x.zip")).toBe("Modèle école.zip");
  });
});
