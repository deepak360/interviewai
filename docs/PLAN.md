# InterviewAI — Product & Engineering Plan

## Vision
Full-cycle AI interview prep platform.
JD + Resume → Q&A Bank → Study Mode → Mock Interview → Scored Debrief → Coaching

## Build Phases

### Phase 0 — Scaffold (Week 1) ← CURRENT
- [ ] pnpm monorepo + docker-compose
- [ ] CLAUDE.md + all docs/ files
- [ ] Database schema: users, sessions
- [ ] Auth: register, login, refresh, logout
- [ ] NextAuth.js frontend + protected routes
- [ ] GitHub Actions CI
- [ ] Deploy skeleton

### Phase 1 — Core Product (Weeks 2–3)
- [ ] JD + Resume input UI
- [ ] Claude API: generate Q&A bank
- [ ] Study mode: flashcards + spaced repetition
- [ ] User dashboard

### Phase 2 — Mock Interview (Weeks 4–5)
- [ ] Camera + mic + recording
- [ ] Live speech-to-text transcription
- [ ] TTS question read-aloud
- [ ] Interviewer personas + follow-up generation

### Phase 3 — Scoring & Debrief (Week 6)
- [ ] BullMQ async scoring jobs
- [ ] Per-answer Claude scoring
- [ ] Filler word + length analysis
- [ ] PDF debrief export

### Phase 4 — Admin Panel (Week 7)
- [ ] RBAC middleware
- [ ] User management
- [ ] Session logs + transcript viewer
- [ ] Prompt management UI
- [ ] Feature flags
- [ ] Audit log

### Phase 5+ — Intelligence, Monetisation, Scale
- [ ] Spaced repetition improvements
- [ ] Company-specific mode
- [ ] Stripe integration
- [ ] Team/hiring mode

## Last Updated
Phase 0 planning complete. Starting scaffold next.
