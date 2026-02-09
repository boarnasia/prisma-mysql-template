import { prisma } from "../lib/prisma";

/**
 * ソフトデリートのデモを実行
 */
export default async function runSoftDeleteDemo() {
    console.log("\n-- SQL-like: INSERT sample user for soft-delete");
    const u = await prisma.user.create({ data: { email: `soft+${Date.now()}@example.com`, name: "Soft" } });
    console.log("Created for soft-delete:");
    console.table([u]);

    console.log("\n-- SQL-like: SOFT DELETE: UPDATE User SET deletedAt = NOW() WHERE id = ?");
    const soft = await prisma.user.update({ where: { id: u.id }, data: { deletedAt: new Date() } });
    console.log("Soft-deleted:");
    console.table([soft]);

    console.log("\n-- SQL-like: SELECT * FROM User WHERE deletedAt IS NULL (find active users)");
    const active = await prisma.user.findMany({ where: { deletedAt: null } });
    console.log("Active users (deletedAt IS NULL):");
    console.table(active);
}
