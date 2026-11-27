import { describe, expect, it } from "vitest";
import { toEmbedUrl } from "@/lib/video";

describe("toEmbedUrl", () => {
  it("turns YouTube links into embed links", () => {
    expect(toEmbedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");
    expect(toEmbedUrl("https://youtu.be/dQw4w9WgXcQ")).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");
    expect(toEmbedUrl("youtube.com/shorts/dQw4w9WgXcQ")).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");
  });

  it("turns Vimeo links into player links", () => {
    expect(toEmbedUrl("https://vimeo.com/123456789")).toBe("https://player.vimeo.com/video/123456789");
  });

  it("refuses links that are not https or not valid", () => {
    expect(toEmbedUrl("http://example.com/video")).toBeNull();
    expect(toEmbedUrl("javascript:alert(1)")).toBeNull();
    expect(toEmbedUrl("https://youtube.com/watch?v=short")).toBeNull();
    expect(toEmbedUrl("not a url at all")).toBeNull();
  });

  it("passes other https hosts through unchanged", () => {
    expect(toEmbedUrl("https://videos.example.com/player/abc")).toBe("https://videos.example.com/player/abc");
  });
});
