import { PrismaClient } from "./generated/prisma/client.js";

const db = new PrismaClient();

(async () => {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        passwordHash: true,
      },
    });
    console.log("=== Users in database ===");
    users.forEach((user) => {
      console.log(`ID: ${user.id}`);
      console.log(`Name: ${user.name}`);
      console.log(`Email: ${user.email}`);
      console.log(`Role: ${user.role}`);
      console.log(`Has Password Hash: ${!!user.passwordHash}`);
      console.log("---");
    });
  } catch (e) {
    console.error("Error:", e.message);
  } finally {
    await db.$disconnect();
  }
})();
