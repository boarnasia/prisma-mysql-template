import { prisma } from "../lib/prisma";
import { Prisma } from "../generated/prisma/client";
import { faker } from "@faker-js/faker";
import type { User } from "../generated/prisma/client";

type SeedUser = Pick<User, "email" | "name" | "status">;

export default async function runRawSql() {
    console.log("Seeding users (clearing existing users first)...");

    await prisma.user.deleteMany({});
    console.log("Cleared existing users.");

    const seedUsers: SeedUser[] = [
        ...Array.from({ length: 100 }).map(() => ({
            email: faker.internet.exampleEmail().toLowerCase(),
            name: `${faker.person.firstName()} ${faker.person.lastName()}`,
            status: faker.helpers.arrayElement(["ACTIVE", "INACTIVE"] as const),
        })),
    ];

    await prisma.user.createMany({ data: seedUsers, skipDuplicates: true });
    console.log(`Inserted ${seedUsers.length} users (including deterministic Alice).`);

    // サンプルに使う値を取得
    const sampleEmail = seedUsers[0]?.email;

    // Select 文のサンプル1
    console.log("\n-- Raw SQL: SELECT * FROM `User` LIMIT 5");
    const all = (await prisma.$queryRaw<User[]>(Prisma.sql`SELECT * FROM \`User\` LIMIT 5`));
    console.log(`rows: ${Array.isArray(all) ? all.length : 0}`);
    console.table(Array.isArray(all) ? all : []);

    // Select 文のサンプル2
    console.log("\n-- Raw SQL: add WHERE email = ? (LIMIT 5)");
    if (sampleEmail) {
        const byEmail = await prisma.$queryRaw<User[]>(
            Prisma.sql`SELECT * FROM \`User\` WHERE email = ${sampleEmail} LIMIT 5`
        );
        console.log(`rows: ${Array.isArray(byEmail) ? byEmail.length : 0}`);
        console.table(Array.isArray(byEmail) ? byEmail : []);
    } else {
        console.log("No sampleEmail available, skipping by-email query.");
    }

    //UPDATE の例
    console.log("\n-- Raw SQL: UPDATE `User` SET name = 'Updated Name', updatedAt = NOW() WHERE email = ?");
    const sampleName = "Updated Name";
    const updatedCount = await prisma.$executeRaw(
        Prisma.sql`UPDATE \`User\` SET name = ${sampleName}, updatedAt = NOW() WHERE email = ${sampleEmail}`
    );
    console.log("updated rows:", updatedCount);

    const updatedUser = await prisma.user.findUnique({ where: { email: sampleEmail! } });
    console.log("updated user:", updatedUser);
}
