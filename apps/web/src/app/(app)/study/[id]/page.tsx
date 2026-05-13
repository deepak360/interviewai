'use client'
import { useEffect, useState, useTransition } from 'react'
import { useParams, useRouter } from 'next/navigation'
import api from '@/lib/api'
import { Skeleton } from '@/components/Skeleton'

interface Question {
  id: string
  topic: string
  difficulty: 'core' | 'deep' | 'trap'
  question: string
  idealAnswer: string
  whyItMatters: string
  tags: string[]
}

const DIFF_STYLES = {
  core: 'bg-violet-50 text-violet-700 border-violet-200',
  deep: 'bg-amber-50 text-amber-700 border-amber-200',
  trap: 'bg-red-50 text-red-600 border-red-200',
}

export default function StudyPage() {
  const { id } = useParams()
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [current, setCurrent] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [ratings, setRatings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [done, setDone] = useState(false)
  const [, startTransition] = useTransition()

  useEffect(() => {
    api.get(`/api/banks/${id}`)
      .then(res => setQuestions(res.data.data.bank.questions as Question[]))
      .catch(() => router.push('/dashboard'))
      .finally(() => setLoading(false))
  }, [id, router])

  function rate(confidence: 'got_it' | 'shaky' | 'need_review') {
    const q = questions[current]
    setRatings(prev => ({ ...prev, [q.id]: confidence }))
    setFlipped(false)
    // startTransition marks card navigation as non-urgent — keeps button press snappy (INP)
    startTransition(() => {
      if (current + 1 >= questions.length) {
        setDone(true)
      } else {
        setCurrent(prev => prev + 1)
      }
    })
  }

  function restart() {
    setCurrent(0)
    setFlipped(false)
    setRatings({})
    setDone(false)
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-50 py-10 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
        <Skeleton className="w-full h-80 rounded-2xl" />
        <div className="grid grid-cols-3 gap-3 mt-4">
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
        </div>
      </div>
    </div>
  )

  if (done) {
    const gotIt = Object.values(ratings).filter(r => r === 'got_it').length
    const shaky = Object.values(ratings).filter(r => r === 'shaky').length
    const needReview = Object.values(ratings).filter(r => r === 'need_review').length
    const readyToTest = needReview <= 2 && gotIt >= questions.length * 0.7

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 max-w-md w-full text-center animate-scaleIn">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
            style={{ background: readyToTest ? 'linear-gradient(135deg, #059669, #10b981)' : 'linear-gradient(135deg, #7c3aed, #9333ea)' }}>
            {readyToTest ? '🎉' : '📚'}
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
            {readyToTest ? 'Ready to interview!' : 'Keep studying'}
          </h2>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            {readyToTest
              ? "You're confident on most questions. Time for the real thing."
              : 'Some weak spots remain. One more pass before the mock interview.'}
          </p>

          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { count: gotIt, label: 'Got it', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
              { count: shaky, label: 'Shaky', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
              { count: needReview, label: 'Need review', bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
            ].map(s => (
              <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-4`}>
                <p className={`text-2xl font-black ${s.text} mb-0.5`}>{s.count}</p>
                <p className={`text-xs ${s.text} opacity-80`}>{s.label}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {readyToTest && (
              <button
                onClick={() => router.push(`/interview/${id}`)}
                className="w-full py-3 rounded-xl text-white font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }}
              >
                🎤 Start Mock Interview
              </button>
            )}
            <button
              onClick={restart}
              className="w-full py-3 rounded-xl text-slate-700 font-bold text-sm bg-slate-100 hover:bg-slate-200 transition-all"
            >
              Study again
            </button>
            <button
              onClick={() => router.push(`/banks/${id}`)}
              className="w-full text-slate-400 text-sm hover:text-slate-600 transition-colors py-2"
            >
              ← Back to Q&amp;A Bank
            </button>
          </div>
        </div>
      </div>
    )
  }

  const q = questions[current]
  if (!q) return null
  const progress = (current / questions.length) * 100

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-6">
      <div className="max-w-2xl mx-auto">

        <div className="mb-6 animate-fadeInUp">
          <div className="flex justify-between text-xs text-slate-500 mb-2 font-medium">
            <span>{current + 1} of {questions.length}</span>
            <span>{Object.keys(ratings).length} rated</span>
          </div>
          <div className="w-full rounded-full h-2 bg-slate-200 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #7c3aed, #9333ea, #d97706)' }}
            />
          </div>
        </div>

        {/* 3D Flip Card */}
        <div className="perspective-1000 mb-4" style={{ height: '320px' }}>
          <div className={`transform-style-3d card-flip relative w-full h-full${flipped ? ' is-flipped' : ''}`}>

            {/* Front face — question */}
            <div
              className="backface-hidden absolute inset-0 bg-white rounded-2xl border border-slate-200 hover:border-violet-200 hover:shadow-md shadow-sm p-8 flex flex-col justify-between cursor-pointer transition-shadow"
              onClick={() => setFlipped(true)}
            >
              <div>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${DIFF_STYLES[q.difficulty]}`}>
                    {q.difficulty}
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                    {q.topic}
                  </span>
                </div>
                <p className="text-lg font-semibold text-slate-900 leading-relaxed">{q.question}</p>
              </div>
              <div className="flex items-center justify-center gap-2 text-slate-400">
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-violet-50 border border-violet-100">
                  <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <span className="text-sm text-slate-500 font-medium">Tap card to reveal answer</span>
              </div>
            </div>

            {/* Back face — answer */}
            <div className="backface-hidden rotate-y-180 absolute inset-0 bg-white rounded-2xl border border-violet-300 shadow-sm p-8 flex flex-col overflow-y-auto"
              style={{ boxShadow: '0 4px 20px rgba(124,58,237,0.08)' }}>
              <div className="flex flex-wrap gap-1.5 mb-5 flex-shrink-0">
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${DIFF_STYLES[q.difficulty]}`}>
                  {q.difficulty}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                  {q.topic}
                </span>
              </div>
              <div className="space-y-4 flex-1">
                <div>
                  <p className="text-xs font-bold text-violet-600 tracking-wider mb-2">IDEAL ANSWER</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{q.idealAnswer}</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <p className="text-xs font-semibold text-amber-600 mb-1">Why asked:</p>
                  <p className="text-xs text-amber-900 leading-relaxed">{q.whyItMatters}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {flipped ? (
          <div className="grid grid-cols-3 gap-3 animate-fadeInUp">
            {[
              { key: 'need_review' as const, label: 'Need review', emoji: '😕', cls: 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' },
              { key: 'shaky' as const, label: 'Shaky', emoji: '🤔', cls: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' },
              { key: 'got_it' as const, label: 'Got it!', emoji: '✅', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' },
            ].map(btn => (
              <button
                key={btn.key}
                onClick={() => rate(btn.key)}
                className={`py-3.5 rounded-xl text-sm font-bold border transition-all hover:-translate-y-0.5 hover:shadow-sm ${btn.cls}`}
              >
                {btn.emoji} {btn.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center mt-3">
            <button
              onClick={() => { setFlipped(false); setCurrent(p => Math.min(p + 1, questions.length - 1)) }}
              className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
            >
              Skip →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
