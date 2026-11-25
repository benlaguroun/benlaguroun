"use server";

import { redirect } from "next/navigation";
import { assertAdmin } from "@/lib/admin";
import { fail, localeOf, refresh, returnTo, str } from "@/lib/admin-form";
import { refundOrderWithProvider } from "@/lib/orders";
import { sendReceiptEmails } from "@/lib/receipt";
import { reportError } from "@/lib/errors";
import { lp } from "@/i18n/config";

function back(fd: FormData, notice?: string): never {
  const target = returnTo(fd, lp(localeOf(fd), "/admin/payments"));
  redirect(notice ? `${target}${target.includes("?") ? "&" : "?"}notice=${encodeURIComponent(notice)}` : target);
}

export async function refundStoreOrder(fd: FormData) {
  await assertAdmin();
  const id = str(fd, "id");
  const target = returnTo(fd, lp(localeOf(fd), "/admin/payments"));
  let result;
  try {
    result = await refundOrderWithProvider(id);
  } catch (err) {
    await reportError("payment", err, `Admin refund, order ${id}`);
    fail(target, "The provider could not refund this order. Nothing was changed. Details are on the Errors page.");
  }
  if (!result.ok) fail(target, result.reason);
  refresh();
  back(
    fd,
    result.moneyReturned
      ? "Refunded: the money was sent back and the buyer's access was removed."
      : "Access removed. This provider has no refund call here, so return the money from its dashboard.",
  );
}

export async function resendOrderReceipt(fd: FormData) {
  await assertAdmin();
  const target = returnTo(fd, lp(localeOf(fd), "/admin/payments"));
  const outcome = await sendReceiptEmails(str(fd, "id"), { resend: true });
  if (outcome === "sent") back(fd, "Receipt sent again.");
  fail(target, outcome === "failed" ? "The email could not be sent. Details are on the Errors page." : "Email is not set up yet, or the order is not paid.");
}
