# Rule: Database

## Access Pattern
All DB queries go through `apps/api/src/lib/db.ts`.
Never import PrismaClient directly in routes or services.
Never write raw SQL — always use Prisma query methods.

## Migrations
- Never edit existing migration files
- Every schema change = new migration: `pnpm --filter api prisma migrate dev --name describe_change`
- Migration names: snake_case, descriptive (add_sessions_table, add_role_to_users)
- Always run migrations before deploying

## JSONB Usage
Use JSONB columns for: AI-generated outputs, flexible config, arrays of objects.
Always define a TypeScript type for JSONB contents.
Always validate JSONB contents with Zod when reading from DB.

## Indexes
Add indexes for: foreign keys, columns used in WHERE clauses, columns used in ORDER BY.
Document why each index exists in a comment above it in schema.prisma.

## Soft Deletes
Use `deleted_at` timestamp for user-facing data (banks, sessions).
Hard delete only for: sessions (auth tokens), audit logs (append-only).

## Naming
- Tables: snake_case plural (users, question_banks, mock_interviews)
- Columns: snake_case (created_at, user_id, token_hash)
- Foreign keys: {table_singular}_id (user_id, bank_id, session_id)
