'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'

export default function NewBankPage() {
  const router = useRouter()
  const [jd, setJd] = useState('')
  const [resume, setResume] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleGenerate() {
    if (jd.length < 50) {
      setError('Please paste a full job description (min 50 characters)')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/api/banks/generate', { jd, resume })
      router.push(`/banks/${res.data.data.bank.id}`)
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } }
      setError(e.response?.data?.error || 'Failed to generate. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-5">
            <button onClick={() => router.back()} className="text-slate-400 hover:text-slate-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-slate-400 text-sm">Back</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Generate Q&A Bank</h1>
          <p className="text-slate-500 text-sm">
            Paste your job description and resume — Claude builds a personalised question bank in ~15 seconds.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Job Description <span className="text-violet-600">*</span>
              </label>
              <span className="text-xs text-slate-400">{jd.length} chars</span>
            </div>
            <textarea
              value={jd}
              onChange={e => setJd(e.target.value)}
              rows={10}
              className="w-full rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none resize-none border border-slate-200 bg-slate-50 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 focus:bg-white transition-all"
              placeholder="Paste the full job description here…"
            />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Your Resume
              </label>
              <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">optional but recommended</span>
            </div>
            <textarea
              value={resume}
              onChange={e => setResume(e.target.value)}
              rows={8}
              className="w-full rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none resize-none border border-slate-200 bg-slate-50 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 focus:bg-white transition-all"
              placeholder="Paste your resume text here…"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-4 rounded-2xl text-white font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 shadow-lg hover:shadow-xl"
            style={{ background: loading ? '#7c3aed' : 'linear-gradient(135deg, #7c3aed, #9333ea)' }}
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating questions… (~15 seconds)
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Generate Q&A Bank
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
