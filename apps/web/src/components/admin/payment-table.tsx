import Link from "next/link";
import { deletePayment, setPaymentStatus } from "@/app/[locale]/admin/actions";
import { refundStoreOrder, resendOrderReceipt } from "@/app/[locale]/admin/order-actions";
import { ConfirmButton } from "./confirm-button";
import { fmtDate, money } from "@/lib/admin-format";
import type { PaymentRow } from "@/lib/admin-data";
import { Pill, paymentTone } from "./ui";

function ActionButton({
  action,
  id,
  status,
  returnTo,
  locale,
  children,
  danger,
}: {
  action: (fd: FormData) => Promise<void>;
  id: string;
  status?: string;
  returnTo: string;
  locale: string;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      {status && <input type="hidden" name="status" value={status} />}
      <input type="hidden" name="returnTo" value={returnTo} />
      <input type="hidden" name="locale" value={locale} />
      <button className={`text-xs font-medium hover:underline ${danger ? "text-rose" : "text-aqua"}`}>{children}</button>
    </form>
  );
}

/** Store sales and recorded payments in one table. */
export function PaymentTable({ rows, locale, returnTo }: { rows: PaymentRow[]; locale: string; returnTo: string }) {
  return (
    <div className="glass overflow-x-auto">
      <table className="w-full min-w-[40rem] text-start text-sm">
        <thead>
          <tr className="border-b border-line font-mono text-[0.68rem] uppercase tracking-wider text-mute">
            <th className="px-5 py-3 text-start font-medium">Date</th>
            <th className="px-5 py-3 text-start font-medium">From</th>
            <th className="px-5 py-3 text-start font-medium">For</th>
            <th className="px-5 py-3 text-start font-medium">Method</th>
            <th className="px-5 py-3 text-start font-medium">Amount</th>
            <th className="px-5 py-3 text-start font-medium">Status</th>
            <th className="px-5 py-3 text-start font-medium" />
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((r) => (
            <tr key={`${r.kind}-${r.id}`} className="align-top">
              <td className="whitespace-nowrap px-5 py-3.5 text-mute">{fmtDate(r.date)}</td>
              <td className="px-5 py-3.5">
                {r.whoHref ? (
                  <Link href={r.whoHref} className="font-medium hover:text-aqua">{r.who}</Link>
                ) : (
                  <span className="font-medium">{r.who}</span>
                )}
                {r.kind === "store" && <span className="ms-2"><Pill tone="info">store</Pill></span>}
              </td>
              <td className="px-5 py-3.5 text-mute">{r.description}</td>
              <td className="whitespace-nowrap px-5 py-3.5 text-mute">{r.method}</td>
              <td className="whitespace-nowrap px-5 py-3.5 font-semibold">{money(r.amountCents, r.currency)}</td>
              <td className="px-5 py-3.5">
                <Pill tone={paymentTone[r.status]}>{r.status.toLowerCase()}</Pill>
              </td>
              <td className="px-5 py-3.5">
                {r.kind === "store" && (r.canRefund || r.canResend) && (
                  <div className="flex flex-wrap justify-end gap-x-4 gap-y-1">
                    {r.canResend && (
                      <ActionButton action={resendOrderReceipt} id={r.id} returnTo={returnTo} locale={locale}>
                        Resend receipt
                      </ActionButton>
                    )}
                    {r.canRefund && (
                      <form action={refundStoreOrder}>
                        <input type="hidden" name="id" value={r.id} />
                        <input type="hidden" name="returnTo" value={returnTo} />
                        <input type="hidden" name="locale" value={locale} />
                        <ConfirmButton
                          className="text-xs font-medium text-rose hover:underline"
                          message={`Refund ${money(r.amountCents, r.currency)} to ${r.who}? The money goes back through the payment provider and their access is removed. This cannot be undone.`}
                        >
                          Refund
                        </ConfirmButton>
                      </form>
                    )}
                  </div>
                )}
                {r.editable && (
                  <div className="flex flex-wrap justify-end gap-x-4 gap-y-1">
                    {r.status !== "PAID" && (
                      <ActionButton action={setPaymentStatus} id={r.id} status="PAID" returnTo={returnTo} locale={locale}>
                        Mark paid
                      </ActionButton>
                    )}
                    {r.status === "PAID" && (
                      <ActionButton action={setPaymentStatus} id={r.id} status="REFUNDED" returnTo={returnTo} locale={locale}>
                        Refund
                      </ActionButton>
                    )}
                    {r.status === "PENDING" && (
                      <ActionButton action={deletePayment} id={r.id} returnTo={returnTo} locale={locale} danger>
                        Delete
                      </ActionButton>
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
