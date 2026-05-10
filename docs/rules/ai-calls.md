# Rule: AI / Claude API Calls

## How to Call Claude
Always use `apps/api/src/lib/claude.ts`.
Never import Anthropic SDK directly in routes or services.

```typescript
import { claude } from '../lib/claude'
const result = await claude.complete({
  promptKey: 'generate-question-bank',
  version: 'v1',
  vars: { jd, resume }
})
```

## Prompt Loading
- All prompts live in /docs/prompts/{version}/{key}.md
- Loaded at startup and cached in memory
- Use promptKey + version — never hardcode prompt text in TypeScript
- To update: create new version folder, update version reference in config

## Cost Controls
- Log every Claude call: prompt_key, model, input_tokens, output_tokens, user_id
- Soft limit: 50 Claude calls per user per day (via feature flag)
- Hard limit: reject at 100 calls/day with 429
- Always set appropriate max_tokens — don't use 4096 for a 200-token task

## Async Scoring
- Never run Claude scoring synchronously in the interview endpoint
- All scoring jobs go into BullMQ queue: `scoring-queue`
- Worker: apps/api/src/workers/scoring.worker.ts
- Frontend polls /api/sessions/:id/status for completion

## Error Handling
- Wrap all Claude calls in try/catch
- On API error: log full error, return 503 to client
- On timeout (>30s): cancel, return 504
- Never expose raw Claude error messages to clients

## Output Validation
- All Claude JSON outputs validated with Zod before use
- If validation fails: log raw output, retry once with stricter prompt
- If retry fails: return 422 with "AI output could not be parsed"
