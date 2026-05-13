'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import api from '@/lib/api'
import ScoreRing from '@/components/ScoreRing'
import { Skeleton } from '@/components/Skeleton'

interface Answer {
  id: string
  question: string
  transcript: string
  score: number
  feedback: {
    scores: { accuracy: number; completeness: number; clarity: number; examples: number }
    total: number
    feedback: string
    improvement: string
    skipped?: boolean
  }
}

interface Debrief {
  interview: { id: string; persona: string; status: string; createdAt: string }
  answers: Answer[]
  overallScore: number
}

function scoreStyle(score: number) {
  if (score >= 75) return { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', bar: '#059669', ring: '#059669' }
  if (score >= 50) return { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', bar: '#d97706', ring: '#d97706' }
  return { text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', bar: '#dc2626', ring: '#dc2626' }
}

export default function DebriefPage() {
  const { id } = useParams()
  const router = useRouter()
  const [debrief, setDebrief] = useState<Debrief | null>(null)
  const [loading, setLoading] = useState(true)
  const [polling, setPolling] = useState(false)
  const [pollCount, setPollCount] = useState(0)
  const [openId, setOpenId] = useState<string | null>(null)
  const [barReady, setBarReady] = useState(false)

  useEffect(() => { fetchDebrief() }, [id])

  async function fetchDebrief() {
    try {
      const res = await api.get(`/api/interviews/${id}/debrief`)
      setDebrief(res.data.data)
      setLoading(false)
      setPolling(false)
      setTimeout(() => setBarReady(true), 200)
    } catch (err: unknown) {
      const e = err as { response?: { status?: number } }
      if (e.response?.status === 422) {
        setPolling(true)
        setLoading(false)
        setPollCount(p => p + 1)
        setTimeout(fetchDebrief, 2000)
      } else {
        router.push('/dashboard')
      }
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-50 py-10 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        {/* Overall score card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-7 mb-5">
          <Skeleton className="h-3 w-36 mb-5" />
          <div className="flex items-center gap-8">
            <Skeleton className="w-28 h-28 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex gap-6 pt-1">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          </div>
        </div>
        {/* Score breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-5">
          <Skeleton className="h-5 w-36 mb-6" />
          <div className="grid grid-cols-4 gap-4 mb-6 pb-6 border-b border-slate-100">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-10" />
                </div>
                <Skeleton className="h-2.5 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
        {/* Answer rows */}
        <Skeleton className="h-5 w-40 mb-4" />
        <div className="space-y-2.5">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 px-5 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Skeleton className="h-4 w-5 rounded" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="w-9 h-9 rounded-full flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  if (polling) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-violet-50 border border-violet-200 flex items-center justify-center text-2xl mx-auto mb-6 animate-pulseGlow">
          ⚙️
        </div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight mb-2">Scoring your answers…</h2>
        <p className="text-slate-500 text-sm mb-6">
          Claude is reviewing all answers in parallel. Usually 20–30 seconds.
        </p>
        <div className="w-full rounded-full h-2 bg-slate-200 overflow-hidden mb-2">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(pollCount * 10, 90)}%`, background: 'linear-gradient(90deg, #7c3aed, #9333ea)' }}
          />
        </div>
        <p className="text-slate-400 text-xs">Checking every 2 seconds…</p>
      </div>
    </div>
  )

  if (!debrief) return null

  const score = debrief.overallScore
  const ss = scoreStyle(score)
  const strong = debrief.answers.filter(a => (a.score || 0) >= 75).length
  const skipped = debrief.answers.filter(a => a.feedback?.skipped).length

  const dimAvg = (dim: 'accuracy' | 'completeness' | 'clarity' | 'examples') => {
    const scored = debrief.answers.filter(a => a.feedback?.scores)
    return scored.length
      ? Math.round(scored.reduce((sum, a) => sum + (a.feedback?.scores?.[dim] || 0), 0) / scored.length)
      : 0
  }

  const dims = [
    { key: 'accuracy' as const, label: 'Accuracy', icon: '🎯' },
    { key: 'completeness' as const, label: 'Completeness', icon: '📋' },
    { key: 'clarity' as const, label: 'Clarity', icon: '💡' },
    { key: 'examples' as const, label: 'Examples', icon: '📌' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-6">
      <div className="max-w-3xl mx-auto">

        <div className="mb-8 animate-fadeInUp">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Interview Debrief</h1>
          <p className="text-slate-500 text-sm">
            {new Date(debrief.interview.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
            {' · '}{debrief.interview.persona} persona
          </p>
        </div>

        {/* Overall score card */}
        <div className={`${ss.bg} border ${ss.border} rounded-2xl p-7 mb-5 animate-fadeInUp delay-100`}>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-5">Overall Performance</p>
          <div className="flex items-center gap-8">
            <ScoreRing score={score} label="Overall" size={112} strokeWidth={10} color={ss.ring} />
            <div className="flex-1">
              <p className="text-2xl font-black text-slate-900 mb-1">
                {score >= 75 ? 'Great performance' : score >= 50 ? 'Good effort' : 'Needs more work'}
              </p>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                {score >= 75 ? '🎉 Ready for real interviews. Strong answers across the board.'
                  : score >= 50 ? '👍 Solid foundation. Keep drilling your weaker areas.'
                  : '📚 Review the ideal answers below and run another mock interview.'}
              </p>
              <div className="flex gap-6">
                {[
                  { label: 'Questions', val: debrief.answers.length, color: 'text-slate-900' },
                  { label: 'Strong', val: strong, color: 'text-emerald-600' },
                  { label: 'Skipped', val: skipped, color: 'text-red-500' },
                ].map(s => (
                  <div key={s.label}>
                    <div className={`text-2xl font-black ${s.color}`}>{s.val}</div>
                    <div className="text-xs text-slate-500">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Score breakdown — animated rings + bars */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-5 animate-fadeInUp delay-200">
          <h2 className="font-black text-slate-900 text-base tracking-tight mb-6">Score Breakdown</h2>

          {/* Dimension rings */}
          <div className="grid grid-cols-4 gap-4 mb-6 pb-6 border-b border-slate-100">
            {dims.map((d, i) => {
              const avg = dimAvg(d.key)
              const pct = Math.round((avg / 25) * 100)
              const ds = scoreStyle(pct)
              return (
                <div key={d.key} className="flex flex-col items-center gap-1">
                  <ScoreRing
                    score={pct}
                    label={d.label}
                    size={80}
                    strokeWidth={7}
                    color={ds.ring}
                    delay={i * 150}
                  />
                  <span className="text-xs text-slate-400">{avg}/25</span>
                </div>
              )
            })}
          </div>

          {/* Animated progress bars */}
          <div className="space-y-4">
            {dims.map((d, i) => {
              const avg = dimAvg(d.key)
              const pct = Math.round((avg / 25) * 100)
              const ds = scoreStyle(pct)
              return (
                <div key={d.key}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                      <span>{d.icon}</span>{d.label}
                    </span>
                    <span className="font-bold text-slate-900">{avg}<span className="text-slate-400 font-normal">/25</span></span>
                  </div>
                  <div className="w-full rounded-full h-2.5 bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: barReady ? `${pct}%` : '0%',
                        background: ds.bar,
                        transitionDelay: `${i * 120}ms`,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Answer breakdown */}
        <h2 className="font-black text-slate-900 text-base tracking-tight mb-4 animate-fadeInUp delay-300">Answer Breakdown</h2>
        <div className="space-y-2.5">
          {debrief.answers.map((a, i) => {
            const as_ = scoreStyle(a.score || 0)
            return (
              <div
                key={a.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-violet-200 hover:shadow-sm transition-all animate-fadeInUp"
                style={{ animationDelay: `${300 + i * 60}ms` }}
              >
                <button
                  onClick={() => setOpenId(openId === a.id ? null : a.id)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-slate-400 text-sm w-5 shrink-0 font-mono">{i + 1}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{a.question}</p>
                      <span className="text-xs text-slate-400">
                        {a.feedback?.skipped ? 'Skipped' : `Score: ${a.score}/100`}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {!a.feedback?.skipped && (
                      <div className={`w-9 h-9 rounded-full ${as_.bg} border ${as_.border} flex items-center justify-center`}>
                        <span className={`text-xs font-black ${as_.text}`}>{a.score}</span>
                      </div>
                    )}
                    <svg
                      className={`w-4 h-4 text-slate-400 transition-transform ${openId === a.id ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {openId === a.id && (
                  <div className="px-5 pb-5 border-t border-slate-100 pt-4 space-y-4">
                    {a.feedback?.scores && (
                      <div className="grid grid-cols-4 gap-2">
                        {Object.entries(a.feedback.scores).map(([k, v]) => {
                          const pct = Math.round((v / 25) * 100)
                          const ds = scoreStyle(pct)
                          return (
                            <div key={k} className={`${ds.bg} border ${ds.border} rounded-xl p-3 text-center`}>
                              <p className={`text-xl font-black ${ds.text} mb-0.5`}>{v}</p>
                              <p className="text-xs text-slate-500 capitalize">{k}</p>
                            </div>
                          )
                        })}
                      </div>
                    )}
                    {a.transcript && (
                      <div>
                        <p className="text-xs font-bold text-slate-400 tracking-wider mb-2">YOUR ANSWER</p>
                        <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-xl p-4 border border-slate-100">
                          {a.transcript}
                        </p>
                      </div>
                    )}
                    {a.feedback?.feedback && (
                      <div>
                        <p className="text-xs font-bold text-violet-600 tracking-wider mb-2">FEEDBACK</p>
                        <p className="text-sm text-slate-700 leading-relaxed">{a.feedback.feedback}</p>
                      </div>
                    )}
                    {a.feedback?.improvement && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                        <p className="text-xs font-bold text-emerald-600 tracking-wider mb-2">IDEAL ANSWER</p>
                        <p className="text-sm text-slate-700 leading-relaxed">{a.feedback.improvement}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-8 flex gap-3 animate-fadeInUp">
          <button
            onClick={() => router.push(`/banks/${debrief.interview.id}`)}
            className="flex-1 py-3.5 rounded-xl text-white font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }}
          >
            Review Q&amp;A Bank
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="flex-1 py-3.5 rounded-xl text-slate-700 font-bold text-sm bg-white border border-slate-200 hover:bg-slate-50 hover:-translate-y-0.5 transition-all"
          >
            Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
