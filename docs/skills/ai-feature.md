# Skill: How to Add a New Claude-Powered Feature

## Step 1 — Write the prompt
Location: `docs/prompts/v1/{feature-name}.md`
Include: purpose, system prompt, user template with {{vars}}, output schema (Zod)

## Step 2 — Add the service method
Location: `apps/api/src/services/{feature}.service.ts`

```typescript
import { claude } from '../lib/claude'
import { z } from 'zod'

const OutputSchema = z.object({ ... })

export async function generateFeature(userId: string, input: FeatureInput) {
  const result = await claude.complete({
    promptKey: 'feature-name',
    version: 'v1',
    vars: { input }
  })
  return OutputSchema.parse(result)
}
```

## Step 3 — Decide: sync or async?
- Fast (<5s, user waits): call service directly in route, return result
- Slow (>5s, scoring/generation): queue a BullMQ job, return jobId, client polls status

## Step 4 — For async jobs
Create worker: `apps/api/src/workers/{feature}.worker.ts`
Queue name: `{feature}-queue`
Poll endpoint: `GET /api/{resource}/:id/status`

## Step 5 — Add cost logging
Every Claude call must log: user_id, prompt_key, input_tokens, output_tokens, created_at
Table: `ai_usage_logs`

## Rules
- Read docs/rules/ai-calls.md before implementing
- Never call Anthropic SDK directly — use lib/claude.ts
- Always validate Claude output with Zod
- Always handle Claude API errors gracefully (503 to client)
