import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

// Usage: npm run db:admin -- you@example.com
// Sign up on the website first, then run this to turn that account into an admin.
const email = process.argv[2]?.trim().toLowerCase();

if (!email) {
  console.error("Usage: npm run db:admin -- you@example.com");
  process.exit(1);
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error(`No account found for ${email}. Sign up on the website first, then run this again.`);
    process.exit(1);
  }
  await prisma.user.update({ where: { id: user.id }, data: { role: "ADMIN" } });
  console.log(`${email} is now an admin. Log out and back in if you are already signed in.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
