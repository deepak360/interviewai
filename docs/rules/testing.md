# Rule: Testing

## What to Test
- All service layer functions (unit tests)
- All API endpoints (integration tests)
- Auth flows end-to-end
- Claude output parsing and validation logic

## What NOT to Test
- Prisma internals
- Third-party library internals
- Pure UI rendering (leave for E2E later)

## File Naming
- Unit: `{filename}.test.ts` next to the file being tested
- Integration: `apps/api/src/__tests__/{feature}.integration.test.ts`

## Mocking
- Mock Prisma using `jest-mock-extended`
- Mock Claude API calls — never hit real API in tests
- Mock BullMQ workers — test job logic separately from queue

## Coverage
- Services: aim for 80%+ coverage
- Routes: cover happy path + main error cases
- Auth: cover all token scenarios (expired, revoked, missing)

## Running Tests
```bash
pnpm --filter api test           # unit tests
pnpm --filter api test:int       # integration tests
pnpm test                        # all tests
```
