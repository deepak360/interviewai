'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

function ProductPanel() {
  const questions = [
    'Walk me through your biggest product launch.',
    'How do you handle conflicting stakeholder priorities?',
    'Describe a time you used data to change a decision.',
    'Tell me about a failed project and what you learned.',
  ]

  return (
    <div className="relative hidden lg:flex flex-col h-full overflow-hidden p-12"
      style={{ background: 'linear-gradient(135deg, #4c1d95, #6d28d9, #7e22ce)' }}>
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-15 blur-3xl"
        style={{ background: 'radial-gradient(circle, #a78bfa, transparent)' }} />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #c026d3, transparent)' }} />

      <div className="relative z-10">
        <div className="mb-8" />

        <h2 className="text-4xl font-black text-white leading-tight tracking-tighter mb-3">
          Your question bank
          <br />
          <span className="text-violet-200">is generating.</span>
        </h2>
        <p className="text-violet-200 text-base mb-10 leading-relaxed max-w-sm">
          Paste a JD and resume — Claude builds your personalised bank in seconds. Study it, then take a live mock interview.
        </p>

        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs text-violet-300 mb-0.5">Generating for</div>
              <div className="text-white font-bold text-sm">Senior PM · Stripe</div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-white/10 text-violet-200 border border-white/20">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-300 animate-pulse" />
              Generating…
            </div>
          </div>
          <div className="space-y-2">
            {questions.map((q, i) => (
              <div key={q}
                className={`flex items-start gap-3 rounded-xl px-3 py-2.5 ${i < 2 ? 'bg-white/10 border border-white/15' : 'bg-white/5 border border-white/8'}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold ${i < 2 ? 'bg-white/30 text-white' : 'bg-white/10 text-violet-400'}`}>
                  {i < 2 ? '✓' : i + 1}
                </div>
                <p className={`text-xs leading-relaxed ${i < 2 ? 'text-white' : 'text-violet-400'}`}>{q}</p>
              </div>
            ))}
            <div className="flex items-center gap-2 px-3 py-2">
              <div className="flex gap-1">
                {[0, 150, 300].map(delay => (
                  <div key={delay} className="w-1.5 h-1.5 rounded-full bg-violet-300 animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                ))}
              </div>
              <span className="text-violet-400 text-xs">+32 more questions being crafted…</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '🧠', label: 'AI-tailored', sub: 'to your JD' },
            { icon: '🃏', label: 'Flashcard', sub: 'drill mode' },
            { icon: '📊', label: 'Scored', sub: 'debrief' },
          ].map(f => (
            <div key={f.label} className="bg-white/10 border border-white/15 rounded-xl p-3 text-center">
              <div className="text-xl mb-1">{f.icon}</div>
              <div className="text-white text-xs font-semibold">{f.label}</div>
              <div className="text-violet-300 text-xs">{f.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 mt-auto">
        <div className="border-t border-white/10 pt-8">
          <p className="text-violet-200 text-xs leading-relaxed italic mb-3">
            &ldquo;I signed up Sunday night before a Monday morning interview. The question bank was spot on. I got the offer.&rdquo;
          </p>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">MK</div>
            <div>
              <div className="text-white text-xs font-semibold">Marcus K.</div>
              <div className="text-violet-300 text-xs">Hired at Shopify</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const json = await res.json()
      if (!res.ok || json.error) {
        setError(json.error || 'Registration failed')
      } else {
        router.push('/login')
      }
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const strength = password.length >= 12 ? 4 : password.length >= 10 ? 3 : password.length >= 8 ? 2 : password.length > 0 ? 1 : 0
  const strengthColors = ['bg-red-400', 'bg-orange-400', 'bg-amber-400', 'bg-emerald-500']

  return (
    <div className="min-h-[calc(100vh-64px)] grid lg:grid-cols-2 bg-white">
      <ProductPanel />

      <div className="flex flex-col items-center justify-center px-6 py-12 bg-slate-50">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Create account</h1>
            <p className="text-slate-500 text-sm">Start preparing. It&apos;s free.</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Full name</label>
              <input
                type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="Deepak Pandey" required
                className="w-full px-4 py-3 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 border border-slate-300 bg-white outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" required
                className="w-full px-4 py-3 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 border border-slate-300 bg-white outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="min 8 characters" required minLength={8}
                  className="w-full px-4 py-3 pr-11 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 border border-slate-300 bg-white outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                />
                <button type="button" onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPassword
                    ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  }
                </button>
              </div>
              {password.length > 0 && (
                <div className="flex gap-1 mt-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className={`flex-1 h-1 rounded-full transition-all ${i < strength ? strengthColors[strength - 1] : 'bg-slate-200'}`} />
                  ))}
                </div>
              )}
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all disabled:opacity-50 shadow-lg hover:shadow-xl mt-2"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }}>
              {loading
                ? <span className="flex items-center justify-center gap-2"><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Creating account…</span>
                : 'Create free account'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-4 leading-relaxed">
            By creating an account you agree to our{' '}
            <a href="#" className="text-slate-500 hover:text-slate-700 transition-colors underline">Terms</a>
            {' '}and{' '}
            <a href="#" className="text-slate-500 hover:text-slate-700 transition-colors underline">Privacy Policy</a>.
          </p>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-violet-600 hover:text-violet-700 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
