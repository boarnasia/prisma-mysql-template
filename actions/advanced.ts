import { prisma } from "../lib/prisma";

export default async function runAdvancedQueries() {
    console.log(
      "\n-- SQL-like: SELECT * FROM User WHERE name LIKE '%Alice%' OR email LIKE '%example.com%'"
    );
    const orRes = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: "Alice" } },
          { email: { contains: "example.com" } }
        ]
      }
    });
    console.log("OR search results:");
    console.table(orRes);

    console.log("\n-- SQL-like: Relation filter: Find users who have SOME published posts");
    const usersWithPublished = await prisma.user.findMany({
      where: { posts: { some: { published: true } } },
      include: { posts: true }
    });
    console.log("Users with at least one published post:");
    console.table(usersWithPublished.map(u => ({ id: u.id, email: u.email, posts: (u.posts || []).length })));
}
