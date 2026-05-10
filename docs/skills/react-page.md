# Skill: How to Create a New Next.js Page

## Step 1 — Create the page file
Location: `apps/web/app/{route}/page.tsx`

```typescript
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'

export default async function {PageName}Page() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  return (
    <div>
      {/* page content */}
    </div>
  )
}
```

## Step 2 — Add loading state
Location: `apps/web/app/{route}/loading.tsx`
```typescript
export default function Loading() {
  return <div>Loading...</div>  // replace with skeleton
}
```

## Step 3 — Client components
If page needs interactivity, create a client component:
Location: `apps/web/components/{feature}/{ComponentName}.tsx`
```typescript
'use client'
import { useState } from 'react'
// ...
```

## Step 4 — Data fetching
- Server components: fetch directly with credentials
- Client components: use React Query hooks from `hooks/use{Feature}.ts`

## Rules
- Pages are server components by default — only add 'use client' when needed
- Auth check at the top of every protected page
- Loading states required for all async pages
- Use shadcn/ui components — never raw HTML for UI elements
