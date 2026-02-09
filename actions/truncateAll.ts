import { prisma } from "../lib/prisma";

async function printMessage(model: string, count: number): Promise<void> {
    console.log(`Deleting ${count} ${model}.`);
}

/**
 * Truncate all tables in the database.
 */
export default async function truncateAll() {
    printMessage("posts", await prisma.post.count());
    printMessage("categories", await prisma.category.count());
    printMessage("users", await prisma.user.count());

    await prisma.$transaction(async (tx) => {
        await tx.$executeRawUnsafe("SET FOREIGN_KEY_CHECKS = 0;");
        await tx.$executeRawUnsafe("TRUNCATE TABLE `User`;");
        await tx.$executeRawUnsafe("TRUNCATE TABLE `Post`;");
        await tx.$executeRawUnsafe("TRUNCATE TABLE `Category`;");
        await tx.$executeRawUnsafe("SET FOREIGN_KEY_CHECKS = 1;");
    });

    console.log("All tables truncated.");
}
