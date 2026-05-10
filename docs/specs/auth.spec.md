# Spec: Authentication

## What it does
Users can register, log in, refresh their session, and log out.
Admins are identified by role and get access to /admin/ routes.

## Endpoints

### POST /api/auth/register
Request: { email, password, name }
Response 201: { data: { user: { id, email, name, role } }, error: null }
Response 400: validation error (email format, password min 8 chars)
Response 409: email already exists

### POST /api/auth/login
Request: { email, password }
Response 200: { data: { user, accessToken }, error: null }
Sets httpOnly cookie: refreshToken
Response 401: invalid credentials

### POST /api/auth/refresh
Reads refreshToken from cookie
Response 200: { data: { accessToken }, error: null }
Sets new refreshToken cookie, invalidates old one
Response 401: missing, expired, or revoked token

### POST /api/auth/logout
Reads refreshToken from cookie, revokes it
Clears cookie
Response 200: { data: { message: 'Logged out' }, error: null }

### GET /api/auth/me
Requires: authenticate middleware
Response 200: { data: { user: { id, email, name, role } }, error: null }

## Data Model Changes
- users table: id, email, password_hash, name, role (USER|ADMIN), created_at, suspended_at
- sessions table: id, user_id, token_hash, expires_at, revoked_at, created_at

## Acceptance Criteria
- [ ] User can register with email + password
- [ ] User can log in and receive access token + refresh cookie
- [ ] Access token expires after 15 minutes
- [ ] Refresh token rotates on every use
- [ ] Reusing a revoked refresh token invalidates all user sessions
- [ ] Logged out user cannot refresh or access protected routes
- [ ] Admin role blocks access to USER-only routes (403)

## Edge Cases
- Register with existing email → 409
- Login with wrong password → 401 (same message as wrong email, no enumeration)
- Refresh with expired token → 401
- Refresh with revoked token → 401 + revoke all user sessions
- Suspended user tries to login → 403

## Do NOT Change
- Do not add social login here — that comes in a separate task
- Do not add password reset here — separate spec
