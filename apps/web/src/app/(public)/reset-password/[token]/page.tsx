'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>()
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const strength = password.length >= 12 ? 4 : password.length >= 10 ? 3 : password.length >= 8 ? 2 : password.length > 0 ? 1 : 0
  const strengthColors = ['bg-red-400', 'bg-orange-400', 'bg-amber-400', 'bg-emerald-500']
  const mismatch = confirm.length > 0 && password !== confirm

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || 'Reset failed')
      } else {
        setDone(true)
        setTimeout(() => router.push('/login'), 2500)
      }
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">

        <Link href="/" className="flex items-center gap-2 mb-10 justify-center">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-slate-900 font-black text-lg tracking-tight">InterviewAI</span>
        </Link>

        {done ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center animate-scaleIn">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-2xl mx-auto mb-5">
              ✅
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight mb-2">Password updated!</h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              Redirecting you to sign in…
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 animate-fadeInUp">
            <div className="mb-7">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Set new password</h1>
              <p className="text-slate-500 text-sm">Must be at least 8 characters.</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">New password</label>
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
                    {[...Array(4)].map((_, idx) => (
                      <div key={idx} className={`flex-1 h-1 rounded-full transition-all ${idx < strength ? strengthColors[strength - 1] : 'bg-slate-200'}`} />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Confirm password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirm} onChange={e => setConfirm(e.target.value)}
                  placeholder="same password again" required
                  className={`w-full px-4 py-3 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 border bg-white outline-none focus:ring-2 transition-all ${
                    mismatch
                      ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                      : 'border-slate-300 focus:border-violet-400 focus:ring-violet-100'
                  }`}
                />
                {mismatch && (
                  <p className="text-xs text-red-500 mt-1.5">Passwords don&apos;t match</p>
                )}
              </div>

              <button type="submit" disabled={loading || mismatch}
                className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all disabled:opacity-50 shadow-lg hover:shadow-xl hover:-translate-y-0.5 mt-2"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }}>
                {loading
                  ? <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Updating…
                    </span>
                  : 'Update password'}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              <Link href="/login" className="font-semibold text-violet-600 hover:text-violet-700 transition-colors">
                ← Back to sign in
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
