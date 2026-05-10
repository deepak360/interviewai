# Spec: Admin Panel

## What it does
Admins can view and manage all users, sessions, Q&A banks, prompts, and feature flags.
All admin actions are logged in the audit trail.

## Roles
- USER: own data only
- ADMIN: read all data, suspend users, update prompts + flags
- SUPER_ADMIN: all ADMIN permissions + manage other admins

## Key Pages
- /admin — dashboard: user count, mocks taken, avg score, API cost
- /admin/users — paginated user table with search + suspend
- /admin/users/[id] — user detail: activity, sessions, banks
- /admin/sessions — all mock sessions with filters
- /admin/sessions/[id] — full transcript + per-answer scores + recording
- /admin/prompts — prompt registry: view, edit, version history
- /admin/flags — feature flag toggles with rollout %
- /admin/audit — full audit log with filters

## Security Rules
- All /admin/ routes require requireAdmin middleware
- Every admin action writes to audit_logs
- Suspended users cannot log in
- Prompt updates create a new version — never overwrite

## Acceptance Criteria
- [ ] Non-admin user hitting /admin gets 403
- [ ] Admin can suspend/unsuspend a user
- [ ] Admin can view any session transcript
- [ ] Admin can update a prompt and see version history
- [ ] Every admin action appears in audit log within 1 second
