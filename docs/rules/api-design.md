# Rule: API Design

## Response Shape
All endpoints return exactly:
```typescript
{ data: T | null, error: string | null }
```
Never return a raw object. Never return just an array.

## HTTP Status Codes
- 200: success (GET, PUT)
- 201: created (POST)
- 400: validation error
- 401: not authenticated
- 403: not authorised
- 404: not found
- 429: rate limited
- 500: server error (never expose internals)

## Pagination
All list endpoints: `?page=1&limit=20`
Return: `{ data: { items, total, page, totalPages }, error }`

## Error Handling
Throw `AppError(message, statusCode)` in services.
Global error handler catches and formats.
Never return stack traces in production.

## Route Naming
- Plural nouns: /users, /banks, /sessions
- Nested for ownership: /users/:id/banks
- Verbs only for non-CRUD actions: /sessions/:id/score
- Admin routes always under /admin/

## Validation
Zod for all request body, params, query params.
Validate at route level before calling service.
Return 400 with field-level errors on failure.
