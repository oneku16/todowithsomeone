import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function upsertUser(
  username: string,
  password: string,
  displayName: string,
) {
  const normalizedUsername = username.toLowerCase();
  const passwordHash = await bcrypt.hash(password, 10);
  return prisma.user.upsert({
    where: { username: normalizedUsername },
    update: { displayName, passwordHash },
    create: { username: normalizedUsername, displayName, passwordHash },
  });
}

async function main() {
  const user1Username = process.env.USER1_USERNAME ?? "alex";
  const user1Password = process.env.USER1_PASSWORD ?? "changeme";
  const user1DisplayName = process.env.USER1_DISPLAY_NAME ?? "Alex";

  const user2Username = process.env.USER2_USERNAME ?? "sam";
  const user2Password = process.env.USER2_PASSWORD ?? "changeme";
  const user2DisplayName = process.env.USER2_DISPLAY_NAME ?? "Sam";

  const [user1, user2] = await Promise.all([
    upsertUser(user1Username, user1Password, user1DisplayName),
    upsertUser(user2Username, user2Password, user2DisplayName),
  ]);

  console.log("Seeded users:");
  console.log(`  - ${user1.displayName} (@${user1.username})`);
  console.log(`  - ${user2.displayName} (@${user2.username})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
