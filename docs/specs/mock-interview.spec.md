# Spec: Mock Interview

## What it does
User takes a timed mock interview with camera + mic.
Questions are read aloud. Answers are transcribed live.
Full session is recorded and saved.

## Flow
1. Setup screen: camera preview, mic test, persona selection, timer config
2. Intro: interviewer persona introduces themselves (TTS)
3. For each question:
   a. Question displayed + read aloud via TTS
   b. Timer starts
   c. User answers — live transcription shown
   d. Timer ends or user clicks "Next"
   e. AI generates a follow-up question based on answer (optional)
4. Session ends: recording uploaded, scoring job queued

## Endpoints

### POST /api/interviews
Request: { bankId, persona, timerSeconds }
Response 201: { data: { interviewId, questions }, error: null }

### POST /api/interviews/:id/answer
Request: { questionId, transcript }
Response 200: { data: { followUp, nextQuestionId }, error: null }

### POST /api/interviews/:id/complete
Request: { recordingUrl }
Queues scoring job
Response 200: { data: { interviewId, status: 'scoring' }, error: null }

### GET /api/interviews/:id/status
Response: { data: { status: 'scoring' | 'complete' | 'failed' }, error: null }

## Acceptance Criteria
- [ ] Camera and mic permissions handled gracefully (denied state shown)
- [ ] TTS reads each question before timer starts
- [ ] Live transcript updates as user speaks
- [ ] Recording saved to GCS on session complete
- [ ] Scoring job queued immediately after complete
- [ ] User redirected to debrief once scoring is done
