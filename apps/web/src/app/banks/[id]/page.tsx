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

const DIFF_COLORS = {
  core: 'bg-green-100 text-green-700',
  deep: 'bg-orange-100 text-orange-700',
  trap: 'bg-red-100 text-red-700'
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
  }, [id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </div>
  )

  if (!bank) return null

  const questions = (bank.questions as unknown as Question[])
  const filtered = filter === 'all' ? questions : questions.filter(q => q.difficulty === filter)

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Q&A Bank</h1>
            <p className="text-gray-500 text-sm mt-1">
              {questions.length} questions · {bank.topics.join(', ')}
            </p>
          </div>
          <button
            onClick={() => router.push(`/study/${id}`)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
          >
            Study →
          </button>
        </div>

        <div className="flex gap-2 flex-wrap mb-6">
          {['all', 'core', 'deep', 'trap'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                filter === f
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'
              }`}
            >
              {f === 'all' ? `All (${questions.length})` : `${f} (${questions.filter(q => q.difficulty === f).length})`}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map((q, i) => (
            <div key={q.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <button
                onClick={() => setOpenId(openId === q.id ? null : q.id)}
                className="w-full text-left px-6 py-4 flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <span className="text-gray-400 text-sm mt-0.5 w-5 shrink-0">{i + 1}</span>
                  <div>
                    <div className="flex gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DIFF_COLORS[q.difficulty]}`}>
                        {q.difficulty}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                        {q.topic}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{q.question}</p>
                  </div>
                </div>
                <span className="text-gray-400 shrink-0">{openId === q.id ? '▲' : '▼'}</span>
              </button>

              {openId === q.id && (
                <div className="px-6 pb-5 border-t border-gray-50">
                  <div className="mt-4">
                    <p className="text-xs font-medium text-green-700 mb-2">IDEAL ANSWER</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{q.idealAnswer}</p>
                  </div>
                  <div className="mt-4 bg-amber-50 rounded-lg px-4 py-3">
                    <p className="text-xs font-medium text-amber-700 mb-1">WHY THIS IS ASKED</p>
                    <p className="text-sm text-amber-800">{q.whyItMatters}</p>
                  </div>
                  <div className="mt-3 flex gap-2 flex-wrap">
                    {q.tags.map(tag => (
                      <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
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
