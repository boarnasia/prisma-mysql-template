import "dotenv/config";
import { Command } from "commander";
import runSingleOperations from "./actions/single";
import runBulkOperations from "./actions/bulk";
import runSoftDeleteDemo from "./actions/soft";
import runAdvancedQueries from "./actions/advanced";
import runRawSql from "./actions/rawSql";
import truncateAll from "./actions/truncateAll";
import { prisma } from "./lib/prisma";

const program = new Command();

program
    .name("prisma-sample")
    .description("Prisma + MySQL サンプル CLI");

// サブコマンド定義
program
    .command("single")
    .description("単一操作のサンプルを実行 (create/read/update/delete)")
    .action(() => runAndExit(runSingleOperations));

program
    .command("bulk")
    .description("バルク操作のサンプルを実行")
    .action(() => runAndExit(runBulkOperations));

program
    .command("soft")
    .description("ソフトデリートのデモを実行")
    .action(() => runAndExit(runSoftDeleteDemo));

program
    .command("advanced")
    .description("高度なクエリのサンプルを実行")
    .action(() => runAndExit(runAdvancedQueries));

program
    .command("rawsql")
    .description("生 SQL を使ったサンプルを実行")
    .action(() => runAndExit(runRawSql));

program
    .command("truncateAll")
    .description("全テーブルをトランケート（開発用）")
    .action(() => runAndExit(truncateAll));

// Prisma の切断を保証するユーティリティ
async function runAndExit(fn: () => Promise<void>) {
    try {
        await fn();
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

async function main() {
    if (process.argv.length <= 2) {
        program.help({ error: false });
    }
    await program.parseAsync(process.argv);
}

main();
