import { providerLabel } from "@/lib/payments/labels";
import { prisma } from "@brand/db";

export type PaymentRow = {
  id: string;
  kind: "store" | "manual";
  who: string;
  whoHref?: string;
  description: string;
  amountCents: number;
  currency: string;
  status: "PENDING" | "PAID" | "REFUNDED";
  method: string;
  date: Date;
  /** Only manual payments can be edited. */
  editable: boolean;
};

const METHOD_LABEL: Record<string, string> = {
  BANK_TRANSFER: "Bank transfer",
  CASH: "Cash",
  CARD: "Card",
  ONLINE: "Online",
  OTHER: "Other",
};
export const methodLabel = (m: string) => METHOD_LABEL[m] ?? m;

/**
 * One list for everything money-related: store sales (Order) and payments you
 * recorded yourself (Payment), newest first.
 */
export async function getPaymentRows(opts: {
  view?: "all" | "store" | "manual";
  status?: "PENDING" | "PAID" | "REFUNDED";
  limit?: number;
  locale: string;
}): Promise<PaymentRow[]> {
  const { view = "all", status, limit = 100, locale } = opts;
  const rows: PaymentRow[] = [];

  if (view !== "manual") {
    const orders = await prisma.order.findMany({
      // Unfinished checkouts (PENDING) are noise, so only show real outcomes.
      where: { status: status ?? { not: "PENDING" } },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: { user: { select: { name: true, email: true } }, product: { select: { name: true } } },
    });
    for (const o of orders) {
      rows.push({
        id: o.id,
        kind: "store",
        who: o.user.name || o.user.email,
        description: o.product.name,
        amountCents: o.amountCents,
        currency: o.currency,
        status: o.status,
        method: providerLabel(o.provider),
        date: o.paidAt ?? o.createdAt,
        editable: false,
      });
    }
  }

  if (view !== "store") {
    const payments = await prisma.payment.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: "desc" },
      take: limit,
      include: { client: { select: { id: true, name: true } } },
    });
    for (const p of payments) {
      rows.push({
        id: p.id,
        kind: "manual",
        who: p.client.name,
        whoHref: `/${locale}/admin/clients/${p.client.id}`,
        description: p.description,
        amountCents: p.amountCents,
        currency: p.currency,
        status: p.status,
        method: methodLabel(p.method),
        date: p.paidAt ?? p.createdAt,
        editable: true,
      });
    }
  }

  return rows.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, limit);
}
