'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || 'Something went wrong')
      } else {
        setSent(true)
      }
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">

        {sent ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center animate-scaleIn">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-2xl mx-auto mb-5">
              ✉️
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight mb-2">Check your inbox</h1>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              If <span className="font-medium text-slate-700">{email}</span> has an account, you&apos;ll receive a reset link within a minute.
            </p>
            <Link
              href="/login"
              className="block w-full py-3 rounded-xl text-white font-bold text-sm text-center shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }}
            >
              Back to sign in
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 animate-fadeInUp">
            <div className="mb-7">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Forgot password?</h1>
              <p className="text-slate-500 text-sm leading-relaxed">
                Enter your email and we&apos;ll send a reset link.
              </p>
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
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Email</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" required
                  className="w-full px-4 py-3 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 border border-slate-300 bg-white outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all disabled:opacity-50 shadow-lg hover:shadow-xl hover:-translate-y-0.5 mt-2"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }}>
                {loading
                  ? <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending…
                    </span>
                  : 'Send reset link'}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Remember it?{' '}
              <Link href="/login" className="font-semibold text-violet-600 hover:text-violet-700 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
