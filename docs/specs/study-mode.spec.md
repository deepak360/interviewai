# Spec: Study Mode

## What it does
Users study their generated Q&A bank using flashcards with spaced repetition.
Cards surface based on confidence ratings using the SM-2 algorithm.

## Key Features
- Flashcard flip: question front, answer back
- Confidence rating per card: Got it / Shaky / Need review
- SM-2 spaced repetition: weak cards surface more often
- Topic cluster progress rings
- "Ready to test" signal when all cards seen and < 3 marked weak
- AI hint: show partial answer without revealing full answer

## Endpoints

### GET /api/banks/:id/study
Returns next card due for review based on SM-2 schedule
Response: { data: { question, questionId, dueCount, totalCount }, error: null }

### POST /api/banks/:id/study/:questionId/rate
Request: { confidence: 'got_it' | 'shaky' | 'need_review' }
Updates SM-2 next_due_at for this card
Response: { data: { nextDue, nextCard }, error: null }

### GET /api/banks/:id/progress
Response: { data: { topics: [{ name, total, seen, confident }], readyToTest: bool } }

## Acceptance Criteria
- [ ] Cards with 'need_review' surface again within same session
- [ ] Cards with 'got_it' are not shown again for 24+ hours
- [ ] Topic progress updates in real time as cards are rated
- [ ] "Ready to test" only shows when genuinely ready
