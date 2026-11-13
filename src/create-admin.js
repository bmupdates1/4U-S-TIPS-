import "dotenv/config";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "./db.js";

const schema = z.object({
  ADMIN_USERNAME: z.string().min(3).max(50),
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z.string().min(12).max(200)
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error("Set ADMIN_USERNAME, ADMIN_EMAIL and ADMIN_PASSWORD (12+ chars) in your local environment.");
  process.exit(1);
}

const { ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD } = parsed.data;
const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

try {
  const existingAdmin = await prisma.user.findFirst({ where: { role: "SUPER_ADMIN" } });
  if (existingAdmin) throw new Error("A Super Admin already exists. No new admin was created.");

  await prisma.user.create({
    data: {
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      passwordHash,
      role: "SUPER_ADMIN"
    }
  });
  console.log(`Super Admin ${ADMIN_USERNAME} created. Keep credentials private.`);
} finally {
  await prisma.$disconnect();
}
