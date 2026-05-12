import "dotenv/config";

import bcrypt from "bcrypt";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL!;

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const existingAdmin = await prisma.adminUser.findUnique({
    where: {
      email: "admin@gmail.com",
    },
  });

  if (!existingAdmin) {
    await prisma.adminUser.create({
      data: {
        name: "Admin",
        email: "admin@gmail.com",
        passwordHash: hashedPassword,
      },
    });
  }

  const existingSetting = await prisma.siteSetting.findFirst();

  if (!existingSetting) {
    await prisma.siteSetting.create({
      data: {
        heroTitle: "Welcome To My Portfolio",
        heroSubtitle: "Professional Photography",
        heroImage: "",
      },
    });
  }

  console.log("Seed completed");
}

main()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });