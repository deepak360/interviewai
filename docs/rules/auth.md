# Rule: Authentication & Authorisation

## Token Strategy
- Access token: JWT, signed with ACCESS_TOKEN_SECRET, 15min TTL
- Refresh token: opaque UUID, 7 days, httpOnly + Secure cookie
- Rotation: old refresh token deleted on every use
- Theft detection: if revoked token reused → invalidate ALL user sessions

## Middleware
- `authenticate`: validates access token, attaches req.user = { id, email, role }
- `requireAdmin`: checks req.user.role === 'ADMIN', returns 403 if not
- Apply `authenticate` to all protected routes
- Apply `requireAdmin` to all /admin/ routes

## Passwords
- bcrypt with saltRounds = 12
- Never store or log plain text passwords
- Password reset: 10-minute signed token, single use

## Session Storage
- Refresh tokens stored in `sessions` table
- Fields: token_hash, user_id, expires_at, revoked_at
- On logout: set revoked_at = now()
- Cleanup job: delete expired sessions daily

## NEVER
- Never trust role from client request
- Never put sensitive data in JWT payload beyond id, email, role
- Never return refresh token in response body — cookie only
