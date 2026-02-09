# Prisma + MySQL サンプル

## 前提

- Docker / Docker Compose
- Bun

### ファイル

- `prisma/schema.prisma`: Prisma スキーマ
- `lib/prisma.ts`: Prisma クライアント初期化
- `main.ts`: サンプル CLI（`--op` / `--all`）

### .env

- `prisma/schema.prisma` の datasource は `DATABASE_URL` を参照します。`.env` を用意してください。

``` 
# for prisma migration
DATABASE_URL="mysql://user:password@127.0.0.1:3306/mainapp"

# for prisma client
DATABASE_USER="user"
DATABASE_PASSWORD="password"
DATABASE_NAME="mainapp"
DATABASE_HOST="127.0.0.1"
DATABASE_PORT=3306
```

## 使い方

### 1. Docker Compose で DB を起動

```bash
docker compose up -d
```

### 2. マイグレーションの実行

```bash
# db のマイグレーション
bun run migrate

# prisma のコネクタ作成
bun run generate

# テーブルのリセット
bun run migrate:refresh
```

### 3. スクリプト実行

```bash
# 単一 CRUD の実装例
bun main.ts single

# Bulk CRUD の実装例
bun main.ts bulk

# soft delete の実装例
bun main.ts soft

# or 検索とかの実装例
bun main.ts advanced

# raw sql の実装例
bun main.ts rawsql

# transaction と trancate の実装例
bun main.ts truncateAll
```