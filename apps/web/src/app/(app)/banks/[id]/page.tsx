'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import api from '@/lib/api'

interface Question {
  id: string
  topic: string
  difficulty: 'core' | 'deep' | 'trap'
  question: string
  idealAnswer: string
  whyItMatters: string
  tags: string[]
}

interface Bank {
  id: string
  topics: string[]
  questions: Question[]
  createdAt: string
}

const DIFF_STYLES = {
  core: 'bg-violet-50 text-violet-700 border-violet-200',
  deep: 'bg-amber-50 text-amber-700 border-amber-200',
  trap: 'bg-red-50 text-red-600 border-red-200',
}

export default function BankPage() {
  const { id } = useParams()
  const router = useRouter()
  const [bank, setBank] = useState<Bank | null>(null)
  const [loading, setLoading] = useState(true)
  const [openId, setOpenId] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    api.get(`/api/banks/${id}`)
      .then(res => setBank(res.data.data.bank))
      .catch(() => router.push('/dashboard'))
      .finally(() => setLoading(false))
  }, [id, router])

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex items-center gap-3 text-slate-400">
        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Loading bank…
      </div>
    </div>
  )

  if (!bank) return null

  const questions = bank.questions as unknown as Question[]
  const filtered = filter === 'all' ? questions : questions.filter(q => q.difficulty === filter)

  const filterOptions = [
    { key: 'all', label: `All · ${questions.length}` },
    { key: 'core', label: `Core · ${questions.filter(q => q.difficulty === 'core').length}` },
    { key: 'deep', label: `Deep · ${questions.filter(q => q.difficulty === 'deep').length}` },
    { key: 'trap', label: `Trap · ${questions.filter(q => q.difficulty === 'trap').length}` },
  ]

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-6">
      <div className="max-w-3xl mx-auto">

        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Q&A Bank</h1>
            <p className="text-slate-500 text-sm">
              {questions.length} questions · {bank.topics.join(', ')}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/study/${id}`)}
              className="text-sm px-4 py-2.5 rounded-xl font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all"
            >
              Study
            </button>
            <button
              onClick={() => router.push(`/interview/${id}`)}
              className="text-sm px-4 py-2.5 rounded-xl font-bold text-white shadow-md hover:shadow-lg transition-all"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }}
            >
              Interview →
            </button>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap mb-6">
          {filterOptions.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                filter === f.key
                  ? 'text-white border-transparent shadow-md'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
              style={filter === f.key ? { background: 'linear-gradient(135deg, #7c3aed, #9333ea)' } : {}}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="space-y-2.5">
          {filtered.map((q, i) => (
            <div key={q.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-violet-200 transition-all">
              <button
                onClick={() => setOpenId(openId === q.id ? null : q.id)}
                className="w-full text-left px-5 py-4 flex items-start justify-between gap-4 hover:bg-slate-50 transition-all"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span className="text-slate-400 text-sm mt-0.5 w-5 shrink-0 font-mono">{i + 1}</span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${DIFF_STYLES[q.difficulty]}`}>
                        {q.difficulty}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                        {q.topic}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-800 leading-relaxed">{q.question}</p>
                  </div>
                </div>
                <svg
                  className={`w-4 h-4 text-slate-400 flex-shrink-0 mt-1 transition-transform ${openId === q.id ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openId === q.id && (
                <div className="px-5 pb-5 border-t border-slate-100 pt-4 space-y-4">
                  <div>
                    <p className="text-xs font-bold text-violet-600 tracking-wider mb-2">IDEAL ANSWER</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{q.idealAnswer}</p>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="text-xs font-bold text-amber-600 tracking-wider mb-1">WHY THIS IS ASKED</p>
                    <p className="text-sm text-amber-900">{q.whyItMatters}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {q.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
