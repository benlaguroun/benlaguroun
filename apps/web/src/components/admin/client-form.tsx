import type { Client } from "@brand/db";
import { createClient, updateClient } from "@/app/[locale]/admin/actions";

export function ClientForm({ locale, client }: { locale: string; client?: Client }) {
  return (
    <form action={client ? updateClient : createClient} className="glass space-y-5 p-6">
      <input type="hidden" name="locale" value={locale} />
      {client && <input type="hidden" name="id" value={client.id} />}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="label">Name *</label>
          <input id="name" name="name" required defaultValue={client?.name} className="field" />
        </div>
        <div>
          <label htmlFor="company" className="label">Company</label>
          <input id="company" name="company" defaultValue={client?.company ?? ""} className="field" />
        </div>
        <div>
          <label htmlFor="email" className="label">Email</label>
          <input id="email" name="email" type="email" dir="ltr" defaultValue={client?.email ?? ""} className="field" />
        </div>
        <div>
          <label htmlFor="phone" className="label">Phone / WhatsApp</label>
          <input id="phone" name="phone" dir="ltr" defaultValue={client?.phone ?? ""} className="field" />
        </div>
        <div>
          <label htmlFor="status" className="label">Status</label>
          <select id="status" name="status" defaultValue={client?.status ?? "PROSPECT"} className="field">
            <option value="PROSPECT">Prospect</option>
            <option value="ACTIVE">Active client</option>
            <option value="PAST">Past client</option>
          </select>
        </div>
        <div>
          <label htmlFor="source" className="label">Source</label>
          <input id="source" name="source" placeholder="Contact form, referral, LinkedIn..." defaultValue={client?.source ?? ""} className="field" />
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="label">Private notes</label>
        <textarea id="notes" name="notes" rows={5} defaultValue={client?.notes ?? ""} className="field" />
      </div>

      <button type="submit" className="btn btn-primary">{client ? "Save changes" : "Create client"}</button>
    </form>
  );
}
