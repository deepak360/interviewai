# Skill: How to Add a New API Route

## Step 1 — Create the route file
Location: `apps/api/src/routes/{feature}.routes.ts`

```typescript
import { Router } from 'express'
import { authenticate } from '../middleware/authenticate'
import { {Feature}Service } from '../services/{feature}.service'
import { z } from 'zod'

const router = Router()

const CreateSchema = z.object({ ... })

router.post('/', authenticate, async (req, res, next) => {
  try {
    const body = CreateSchema.parse(req.body)
    const data = await {Feature}Service.create(req.user.id, body)
    res.status(201).json({ data, error: null })
  } catch (err) {
    next(err)
  }
})

export default router
```

## Step 2 — Create the service file
Location: `apps/api/src/services/{feature}.service.ts`

```typescript
import { db } from '../lib/db'
import { AppError } from '../lib/errors'

export const {Feature}Service = {
  async create(userId: string, data: CreateInput) {
    // business logic here
    return db.{model}.create({ data: { userId, ...data } })
  }
}
```

## Step 3 — Register the route
In `apps/api/src/app.ts`:
```typescript
import {feature}Routes from './routes/{feature}.routes'
app.use('/api/{feature}', {feature}Routes)
```

## Step 4 — Write a test
Location: `apps/api/src/__tests__/{feature}.integration.test.ts`
Test: happy path POST, validation error 400, auth error 401

## Rules to Follow
- Read docs/rules/api-design.md before implementing
- Read docs/rules/auth.md if route needs authentication
- All inputs validated with Zod
- Service handles all DB calls — no Prisma in routes
