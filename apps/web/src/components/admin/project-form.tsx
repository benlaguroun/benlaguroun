import type { Project } from "@brand/db";
import { saveProject } from "@/app/[locale]/admin/project-actions";
import { GalleryField, ImageField } from "./image-fields";
import { TranslationFields } from "./translation-fields";

export function ProjectForm({ locale, project }: { locale: string; project?: Project }) {
  return (
    <form action={saveProject} className="glass space-y-6 p-6">
      <input type="hidden" name="locale" value={locale} />
      {project && <input type="hidden" name="id" value={project.id} />}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="title" className="label">Title *</label>
          <input id="title" name="title" required defaultValue={project?.title} className="field" />
        </div>
        <div>
          <label htmlFor="slug" className="label">Web address (slug)</label>
          <input id="slug" name="slug" dir="ltr" defaultValue={project?.slug} placeholder="made from the title if left empty" className="field" />
        </div>
      </div>

      <div>
        <label htmlFor="client" className="label">Client or type of client <span className="text-mute">(shown publicly, leave empty if confidential)</span></label>
        <input id="client" name="client" defaultValue={project?.client ?? ""} placeholder="e.g. Private school, Hotel group" className="field" />
      </div>

      <div>
        <label htmlFor="summary" className="label">Summary * <span className="text-mute">(one or two sentences, shown on cards)</span></label>
        <textarea id="summary" name="summary" required rows={3} defaultValue={project?.summary} className="field" />
      </div>

      <div>
        <label htmlFor="body" className="label">Description * <span className="text-mute">(the problem, what you built, the result. Blank line = new paragraph)</span></label>
        <textarea id="body" name="body" required rows={12} defaultValue={project?.body} className="field" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="tags" className="label">Technologies and tags <span className="text-mute">(comma separated)</span></label>
          <input id="tags" name="tags" dir="ltr" defaultValue={project?.tags.join(", ")} placeholder="Next.js, Prisma, AI agents" className="field" />
        </div>
        <div>
          <label htmlFor="liveUrl" className="label">Live demo link <span className="text-mute">(empty = “Request a demo” button)</span></label>
          <input id="liveUrl" name="liveUrl" dir="ltr" defaultValue={project?.liveUrl ?? ""} placeholder="https://demo.example.com" className="field" />
        </div>
      </div>

      <ImageField name="imageUrl" label="Cover image" defaultValue={project?.imageUrl} hint="Shown on the portfolio page and at the top of the project. A 16:9 screenshot works best." />
      <GalleryField name="images" label="More screenshots" defaultValue={project?.images} />

      <div className="grid gap-5 sm:grid-cols-[1fr_9rem] sm:items-end">
        <label className="flex items-center gap-2.5 text-sm">
          <input type="checkbox" name="featured" defaultChecked={project?.featured ?? false} className="h-4 w-4 accent-[var(--color-aqua)]" />
          Featured on the home page
        </label>
        <div>
          <label htmlFor="position" className="label">Order</label>
          <input id="position" name="position" type="number" dir="ltr" defaultValue={project?.position} placeholder="last" className="field" />
        </div>
      </div>

      <TranslationFields
        translations={project?.translations}
        fields={[
          { key: "title", label: "Title" },
          { key: "summary", label: "Summary", rows: 3 },
          { key: "body", label: "Description", rows: 10 },
        ]}
      />

      <button type="submit" className="btn btn-primary">{project ? "Save changes" : "Create project"}</button>
    </form>
  );
}
