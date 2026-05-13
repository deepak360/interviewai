'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

function ProductPanel() {
  return (
    <div className="relative hidden lg:flex flex-col h-full overflow-hidden p-12"
      style={{ background: 'linear-gradient(135deg, #4c1d95, #6d28d9, #7e22ce)' }}>
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #c026d3, transparent)' }} />
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-15 blur-3xl"
        style={{ background: 'radial-gradient(circle, #a78bfa, transparent)' }} />

      <div className="relative z-10">
        <div className="mb-8" />

        <h2 className="text-4xl font-black text-white leading-tight tracking-tighter mb-3">
          Your debrief
          <br />
          <span className="text-violet-200">is ready.</span>
        </h2>
        <p className="text-violet-200 text-base mb-10 leading-relaxed max-w-sm">
          Pick up where you left off. Question banks, practice sessions, and AI scores — all waiting for you.
        </p>

        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs text-violet-300 mb-0.5">Latest session</div>
              <div className="text-white font-bold text-sm">Senior PM · Stripe</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-white">87</div>
              <div className="text-xs text-violet-300">overall</div>
            </div>
          </div>
          <div className="space-y-2.5">
            {[
              { label: 'Clarity & structure', score: 91 },
              { label: 'Depth of answer', score: 84 },
              { label: 'Communication pace', score: 78 },
            ].map((m) => (
              <div key={m.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-violet-200">{m.label}</span>
                  <span className="text-white font-medium">{m.score}</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-white/70 rounded-full" style={{ width: `${m.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-amber-400/20 border border-amber-400/30 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="text-xl mt-0.5">💡</div>
            <div>
              <div className="text-xs text-amber-300 font-semibold mb-1">Top coaching note</div>
              <p className="text-amber-100 text-xs leading-relaxed">
                Use STAR method more consistently — your situation setup is strong but action steps need more specificity.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-auto">
        <div className="border-t border-white/10 pt-8">
          <p className="text-violet-200 text-xs leading-relaxed italic mb-3">
            &ldquo;InterviewAI spotted weaknesses my human coach missed. I walked into Google feeling genuinely prepared.&rdquo;
          </p>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">SR</div>
            <div>
              <div className="text-white text-xs font-semibold">Sofia R.</div>
              <div className="text-violet-300 text-xs">Hired at Google</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)
    if (res?.error) {
      setError('Invalid email or password')
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] grid lg:grid-cols-2 bg-white">
      <ProductPanel />

      <div className="flex flex-col items-center justify-center px-6 py-12 bg-slate-50">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Welcome back</h1>
            <p className="text-slate-500 text-sm">Sign in to continue your prep.</p>
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
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" required
                className="w-full px-4 py-3 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 border border-slate-300 bg-white outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Password</label>
                <Link href="/forgot-password" className="text-xs text-violet-600 hover:text-violet-700 transition-colors">Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required
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
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all disabled:opacity-50 shadow-lg hover:shadow-xl mt-2"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }}>
              {loading
                ? <span className="flex items-center justify-center gap-2"><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Signing in…</span>
                : 'Sign in'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 text-xs text-slate-400 bg-slate-50">or continue with</span>
            </div>
          </div>

          <button onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-sm text-slate-500 mt-6">
            No account?{' '}
            <Link href="/register" className="font-semibold text-violet-600 hover:text-violet-700 transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
