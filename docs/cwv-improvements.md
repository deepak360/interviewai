# Core Web Vitals Improvements

Changes made on 2026-05-13 to improve LCP, CLS, INP, and TTFB across the InterviewAI frontend.

---

## 1. `apps/web/next.config.ts`

**What changed:** Added `compress`, `poweredByHeader`, `reactStrictMode`, and a `headers()` function with three rules.

| Header rule | Value | Pros |
|---|---|---|
| `/_next/static/(.*)` | `Cache-Control: public, max-age=31536000, immutable` | Hashed static chunks are served from browser/CDN cache on repeat visits. Zero bytes over the wire. |
| `/*.{ico,png,svg,woff2,...}` | `Cache-Control: public, max-age=86400, stale-while-revalidate=604800` | Public assets cached for 24 h; stale-while-revalidate serves stale copy while fetching fresh. |
| All routes | `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` | Security headers; `nosniff` prevents MIME-sniffing that can delay parse. |
| `compress: true` | Gzip on all responses | Smaller HTML/JS payload → faster parse → better FCP and LCP. |
| `poweredByHeader: false` | Removes `X-Powered-By` | Tiny byte saving on every response. |
| `reactStrictMode: true` | Double-invokes effects in dev | Catches side-effect bugs early; no prod cost. |

**CWV improved:** TTFB (compression), FCP (smaller payload), repeat-visit LCP (cache hit).

---

## 2. `apps/web/src/app/layout.tsx`

**What changed:** Three additions.

### a) `display: "swap"` on both Geist fonts
```ts
Geist({ variable: "...", subsets: ["latin"], display: "swap" })
```
**Why:** `font-display: swap` tells the browser to use a fallback font immediately and swap once Geist downloads. Without it the browser may hold a blank text slot (FOIT), which pushes LCP down.  
**CWV improved:** LCP, FCP.

### b) Separate `viewport` export
```ts
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#7c3aed",
}
```
**Why:** Next.js 14 requires `viewport` exported separately, not inside `metadata`. If left inside `metadata` it generates a console warning and the viewport meta tag may not be emitted correctly on some routes. Correct viewport prevents mobile browsers from rendering at desktop width and then scaling — a common cause of CLS on mobile.  
**CWV improved:** CLS (mobile), FCP (mobile).

### c) Preconnect + dns-prefetch for API origin
```html
<link rel="preconnect" href="{NEXT_PUBLIC_API_URL}" />
<link rel="dns-prefetch" href="{NEXT_PUBLIC_API_URL}" />
```
**Why:** The first API call (banks list, debrief fetch, etc.) must complete DNS resolution + TCP + TLS before any data arrives. `preconnect` starts all three eagerly during the HTML parse, before JS even runs. `dns-prefetch` is the fallback for browsers that don't support preconnect.  
**CWV improved:** TTFB of first data fetch → LCP on data-driven pages, INP (perceived).

---

## 3. `apps/web/src/app/globals.css`

**What changed:** `.delay-700` and `.delay-800` reduced.

| Class | Before | After |
|---|---|---|
| `.delay-600` | `0.6s` | `0.5s` |
| `.delay-700` | `0.7s` | `0.4s` |
| `.delay-800` | `0.8s` | `0.5s` |

**Why:** `.delay-700` and `.delay-800` were used on the floating score badge and "AI Feedback ready" badge in the homepage hero `MockCard`. These are above-the-fold elements. An 800 ms delay means the browser paints the card late, which can make it the LCP candidate and push LCP score over the 2.5 s threshold. Capping at 500 ms keeps decorative entrance animations but doesn't sacrifice paint time.  
**CWV improved:** LCP (homepage hero).

---

## 4. `apps/web/src/components/Skeleton.tsx` *(new file)*

**What changed:** Created a shared `<Skeleton>` utility.

```tsx
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`bg-slate-200 rounded-lg animate-pulse ${className}`} />
}
```

**Why:** Gives a single import for all shimmer placeholders. `animate-pulse` is a Tailwind keyframe that opacity-pulses the block, matching the page's real layout geometry so the browser doesn't need to reflow when data arrives.  
**CWV improved:** CLS (eliminates layout shift on data load), perceived performance.

---

## 5. `apps/web/src/app/(app)/banks/page.tsx`

**What changed:** Replaced centered spinner with a structured skeleton that mirrors the real page layout: header row, 3 bank card skeletons with correct column proportions.

**Why:** A centered spinner occupies full viewport height with no structure. When data loads the browser must paint the real layout from scratch — the jump from "centered dot" to "full card list" is a large CLS event. A skeleton that matches card dimensions and positions means the painted area shifts by ≈ 0 px when real content arrives.  
**CWV improved:** CLS.

---

## 6. `apps/web/src/app/(app)/debrief/[id]/page.tsx`

**What changed:** Replaced centered spinner with a full-page skeleton: title, overall score card with circular ring placeholder, 4-column score breakdown grid, 5 answer row stubs.

**Why:** Same reasoning as banks page. The debrief is the largest page (score ring, bars, accordion list). Without a skeleton, all that content pops in at once causing a significant layout shift. The skeleton locks in approximate heights so the browser reserves space correctly.  
**CWV improved:** CLS, perceived LCP (content feels instant).

---

## 7. `apps/web/src/app/(app)/study/[id]/page.tsx`

**What changed:** Two updates.

### a) `useTransition` on card navigation
```ts
const [, startTransition] = useTransition()

function rate(confidence) {
  setRatings(...)   // urgent — update immediately
  setFlipped(false) // urgent — flip card back immediately
  startTransition(() => {
    setCurrent(...)  // non-urgent — browser can yield before advancing
    // or setDone(true)
  })
}
```
**Why:** When a user taps a rating button, `setRatings` and `setFlipped` must respond instantly (they provide direct button feedback). But advancing to the next card involves re-rendering the full card with new question data — that's heavier. Wrapping it in `startTransition` tells React 19 it can yield the main thread for higher-priority input events before committing the card change. This keeps the button press snappy regardless of card complexity.  
**CWV improved:** INP (Interaction to Next Paint).

### b) Skeleton loading state
Replaced spinner with a skeleton matching the card layout: progress bar row, `h-80` card block, 3 rating button stubs.  
**CWV improved:** CLS.

---

## Summary table

| File | Change | CWV metric |
|---|---|---|
| `next.config.ts` | Gzip compression | FCP, LCP |
| `next.config.ts` | Immutable cache on `/_next/static` | LCP (repeat visit) |
| `next.config.ts` | Static asset cache headers | TTFB (repeat visit) |
| `layout.tsx` | `font-display: swap` | LCP, FCP |
| `layout.tsx` | Separate `viewport` export | CLS (mobile) |
| `layout.tsx` | Preconnect + dns-prefetch to API | TTFB → LCP |
| `globals.css` | Cap animation delays at 500 ms | LCP |
| `components/Skeleton.tsx` | Reusable shimmer primitive | CLS |
| `banks/page.tsx` | Skeleton replaces spinner | CLS |
| `debrief/[id]/page.tsx` | Skeleton replaces spinner | CLS |
| `study/[id]/page.tsx` | `useTransition` on card advance | INP |
| `study/[id]/page.tsx` | Skeleton replaces spinner | CLS |
