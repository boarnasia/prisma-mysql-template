import { prisma } from "../lib/prisma";

export default async function runBulkOperations() {
    console.log("\n-- SQL-like: INSERT INTO User (many) ...");
    await prisma.user.createMany({ data: [ { email: `bob+${Date.now()}@example.com`, name: "Bob" }, { email: `carol+${Date.now()}@example.com`, name: "Carol" } ], skipDuplicates: true });

    console.log("\n-- SQL-like: SELECT * FROM User (findMany)");
    const many = await prisma.user.findMany({ take: 10, orderBy: { createdAt: "desc" } });
    console.log("Users:");
    console.table(many);

    console.log("\n-- SQL-like: UPDATE User SET status='INACTIVE' WHERE name = 'Bob' (updateMany)");
    const upm = await prisma.user.updateMany({ where: { name: "Bob" }, data: { status: "INACTIVE" } });
    console.log("UpdateMany result:");
    console.table([upm]);

    console.log("\n-- SQL-like: DELETE FROM User WHERE status='INACTIVE' (deleteMany)");
    const dm = await prisma.user.deleteMany({ where: { status: "INACTIVE" } });
    console.log("DeleteMany result:");
    console.table([dm]);
}
