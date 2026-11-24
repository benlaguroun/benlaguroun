import { addPayment } from "@/app/[locale]/admin/actions";

type Props = {
  locale: string;
  returnTo: string;
  clients: { id: string; name: string }[];
  /** When set, the payment is for this client and the picker is hidden. */
  clientId?: string;
};

export function PaymentForm({ locale, returnTo, clients, clientId }: Props) {
  return (
    <form action={addPayment} className="glass space-y-5 p-6">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="returnTo" value={returnTo} />

      <div className="grid gap-5 sm:grid-cols-2">
        {clientId ? (
          <input type="hidden" name="clientId" value={clientId} />
        ) : (
          <div>
            <label htmlFor="clientId" className="label">Client *</label>
            <select id="clientId" name="clientId" required defaultValue="" className="field">
              <option value="" disabled>Choose a client</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label htmlFor="description" className="label">What is it for? *</label>
          <input id="description" name="description" required placeholder="Deposit for Launch Site" className="field" />
        </div>

        <div>
          <label htmlFor="amount" className="label">Amount *</label>
          <input id="amount" name="amount" inputMode="decimal" required placeholder="1500.00" dir="ltr" className="field" />
        </div>
        <div>
          <label htmlFor="currency" className="label">Currency</label>
          <select id="currency" name="currency" defaultValue="usd" className="field">
            <option value="usd">USD</option>
            <option value="eur">EUR</option>
            <option value="mad">MAD</option>
            <option value="gbp">GBP</option>
          </select>
        </div>

        <div>
          <label htmlFor="method" className="label">Method</label>
          <select id="method" name="method" defaultValue="BANK_TRANSFER" className="field">
            <option value="BANK_TRANSFER">Bank transfer</option>
            <option value="CASH">Cash</option>
            <option value="CARD">Card</option>
            <option value="ONLINE">Online</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="status" className="label">Status</label>
          <select id="status" name="status" defaultValue="PENDING" className="field">
            <option value="PENDING">Pending (not received yet)</option>
            <option value="PAID">Paid (received)</option>
          </select>
        </div>

        <div>
          <label htmlFor="reference" className="label">Reference</label>
          <input id="reference" name="reference" placeholder="Invoice or transfer number" dir="ltr" className="field" />
        </div>
        <div>
          <label htmlFor="dueDate" className="label">Due date</label>
          <input id="dueDate" name="dueDate" type="date" dir="ltr" className="field" />
        </div>
      </div>

      <button type="submit" className="btn btn-primary">Record payment</button>
    </form>
  );
}
