import { prisma } from "@brand/db";

/** Does this user own the product (or are they an admin)? */
export async function userOwns(
  user: { id: string; role?: string | null } | null | undefined,
  productId: string,
) {
  if (!user) return false;
  if (user.role === "ADMIN") return true;
  const row = await prisma.entitlement.findUnique({
    where: { userId_productId: { userId: user.id, productId } },
    select: { id: true },
  });
  return !!row;
}
