# Skill: How to Create a Prisma Migration

## Adding a new table or column

1. Edit `apps/api/prisma/schema.prisma`
2. Run: `pnpm --filter api prisma migrate dev --name describe_your_change`
   Example: `--name add_question_banks_table`
3. Verify migration file created in `apps/api/prisma/migrations/`
4. Run: `pnpm --filter api prisma generate` to update the client

## Migration naming convention
- snake_case, descriptive, present tense
- Good: `add_sessions_table`, `add_role_to_users`, `create_question_banks`
- Bad: `migration1`, `fix`, `update`

## NEVER
- Never edit an existing migration file
- Never delete a migration file
- Never run `prisma migrate reset` in production

## Rollback (dev only)
`pnpm --filter api prisma migrate reset` — resets dev DB and reruns all migrations

## Production deployment
Migrations run automatically in CI/CD before app deploy:
`pnpm --filter api prisma migrate deploy`
