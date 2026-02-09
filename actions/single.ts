import { prisma } from "../lib/prisma";
import { faker } from "@faker-js/faker";

/**
 * 単一操作のサンプルを実行 (create/read/update/delete)
 */
export default async function runSingleOperations() {
    const email = faker.internet.exampleEmail().toLowerCase();
    const name = `${faker.person.firstName()} ${faker.person.lastName()}`;

    console.log("\n-- SQL-like: INSERT INTO User ... RETURNING *");
    const user = await prisma.user.create({ data: { email, name } });
    console.log("Created user:");
    console.table([user]);

    console.log("\n-- SQL-like: UPDATE User SET name = ? WHERE id = ?");
    const updated = await prisma.user.update({
        where: { id: user.id },
        data: { name: `${name} Updated` }
    });
    console.log("Updated user:");
    console.table([updated]);

    console.log("\n-- SQL-like: UPSERT User ...");
    const upserted = await prisma.user.upsert({
        where: { email: user.email },
        update: { name: `${name} Updated` },
        create: { email: user.email, name: `${name} Updated` }
    });
    console.log("Upserted user:");
    console.table([upserted]);

    console.log("\n-- SQL-like: SELECT * FROM User WHERE id = ? (findUnique)");
    const found = await prisma.user.findUnique({ where: { id: user.id } });
    console.log("Find unique:");
    console.table(found ? [found] : []);

    console.log("\n-- SQL-like: DELETE FROM User WHERE id = ?");
    const deleted = await prisma.user.delete({ where: { id: user.id } });
    console.log("Deleted user (hard):");
    console.table([deleted]);
}
