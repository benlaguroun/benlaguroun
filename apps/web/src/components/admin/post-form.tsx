import type { Post } from "@brand/db";
import { savePost } from "@/app/[locale]/admin/post-actions";
import { TranslationFields } from "./translation-fields";

export function PostForm({ locale, post }: { locale: string; post?: Post }) {
  return (
    <form action={savePost} className="glass space-y-6 p-6">
      <input type="hidden" name="locale" value={locale} />
      {post && <input type="hidden" name="id" value={post.id} />}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="title" className="label">Title *</label>
          <input id="title" name="title" required defaultValue={post?.title} className="field" />
        </div>
        <div>
          <label htmlFor="slug" className="label">Web address (slug)</label>
          <input id="slug" name="slug" dir="ltr" defaultValue={post?.slug} placeholder="made from the title if left empty" className="field" />
          <p className="mt-1 text-xs text-mute">Changing it later breaks links people already shared.</p>
        </div>
      </div>

      <div>
        <label htmlFor="excerpt" className="label">Summary * <span className="text-mute">(up to 300 characters, shown on the blog page and in Google)</span></label>
        <textarea id="excerpt" name="excerpt" required rows={3} maxLength={300} defaultValue={post?.excerpt} className="field" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="tags" className="label">Tags <span className="text-mute">(comma separated, up to 6)</span></label>
          <input id="tags" name="tags" dir="ltr" defaultValue={post?.tags.join(", ")} placeholder="AI, Next.js, Business" className="field" />
        </div>
        <div>
          <label htmlFor="coverUrl" className="label">Cover image <span className="text-mute">(optional)</span></label>
          <input id="coverUrl" name="coverUrl" dir="ltr" defaultValue={post?.coverUrl ?? ""} placeholder="https://… or /images/cover.png" className="field" />
        </div>
      </div>

      <div>
        <label htmlFor="body" className="label">Article *</label>
        <textarea id="body" name="body" required rows={26} defaultValue={post?.body} className="field font-mono text-sm" />
        <details className="mt-2 text-xs text-mute">
          <summary className="cursor-pointer text-aqua">Formatting help</summary>
          <pre className="mt-2 overflow-x-auto rounded-lg bg-white/5 p-3 leading-relaxed" dir="ltr">{`## Big heading
### Smaller heading

A normal paragraph with **bold**, *italic*, \`code\` and a [link](https://example.com).
A blank line starts a new paragraph.

- Bullet point
- Another one

1. Numbered step
2. Next step

> A quote

![Describe the image](https://example.com/photo.jpg)

\`\`\`
code block
\`\`\``}</pre>
        </details>
      </div>

      <label className="flex items-center gap-2.5 text-sm">
        <input type="checkbox" name="published" defaultChecked={post?.published ?? false} className="h-4 w-4 accent-[var(--color-aqua)]" />
        Published (visible on the blog)
      </label>

      <TranslationFields
        translations={post?.translations}
        fields={[
          { key: "title", label: "Title" },
          { key: "excerpt", label: "Summary", rows: 3 },
          { key: "body", label: "Article", rows: 16 },
        ]}
      />

      <button type="submit" className="btn btn-primary">{post ? "Save changes" : "Create article"}</button>
    </form>
  );
}
