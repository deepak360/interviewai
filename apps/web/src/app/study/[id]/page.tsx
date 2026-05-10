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

const DIFF_COLORS = {
  core: 'bg-green-100 text-green-700',
  deep: 'bg-orange-100 text-orange-700',
  trap: 'bg-red-100 text-red-700'
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

  useEffect(() => {
    api.get(`/api/banks/${id}`)
      .then(res => {
        setQuestions(res.data.data.bank.questions as Question[])
      })
      .catch(() => router.push('/dashboard'))
      .finally(() => setLoading(false))
  }, [id])

  function rate(confidence: 'got_it' | 'shaky' | 'need_review') {
    const q = questions[current]
    setRatings(prev => ({ ...prev, [q.id]: confidence }))
    setFlipped(false)
    if (current + 1 >= questions.length) {
      setDone(true)
    } else {
      setCurrent(prev => prev + 1)
    }
  }

  function restart() {
    setCurrent(0)
    setFlipped(false)
    setRatings({})
    setDone(false)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </div>
  )

  if (done) {
    const gotIt = Object.values(ratings).filter(r => r === 'got_it').length
    const shaky = Object.values(ratings).filter(r => r === 'shaky').length
    const needReview = Object.values(ratings).filter(r => r === 'need_review').length
    const readyToTest = needReview <= 2 && gotIt >= questions.length * 0.7

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-md p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">{readyToTest ? '🎉' : '📚'}</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {readyToTest ? 'Ready to Test!' : 'Keep Studying'}
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            {readyToTest
              ? 'You\'re confident on most questions. Time for a mock interview!'
              : 'You have some weak areas. Review them before the mock interview.'}
          </p>

          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-green-50 rounded-xl p-3">
              <p className="text-2xl font-bold text-green-600">{gotIt}</p>
              <p className="text-xs text-green-700 mt-1">Got it</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-3">
              <p className="text-2xl font-bold text-orange-600">{shaky}</p>
              <p className="text-xs text-orange-700 mt-1">Shaky</p>
            </div>
            <div className="bg-red-50 rounded-xl p-3">
              <p className="text-2xl font-bold text-red-600">{needReview}</p>
              <p className="text-xs text-red-700 mt-1">Need review</p>
            </div>
          </div>

          <div className="space-y-3">
            {readyToTest && (
              <button
                onClick={() => router.push(`/interview/${id}`)}
                className="w-full bg-green-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-green-700"
              >
                🎤 Start Mock Interview
              </button>
            )}
            <button
              onClick={restart}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl text-sm font-medium hover:bg-gray-200"
            >
              Study Again
            </button>
            <button
              onClick={() => router.push(`/banks/${id}`)}
              className="w-full text-gray-400 text-sm hover:text-gray-600"
            >
              Back to Q&A Bank
            </button>
          </div>
        </div>
      </div>
    )
  }

  const q = questions[current]
  if (!q) return null

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>{current + 1} of {questions.length}</span>
            <span>{Object.keys(ratings).length} rated</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all"
              style={{ width: `${((current) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* card */}
        <div
          className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 mb-6 cursor-pointer min-h-64 flex flex-col justify-between"
          onClick={() => !flipped && setFlipped(true)}
        >
          <div>
            <div className="flex gap-2 mb-4">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DIFF_COLORS[q.difficulty]}`}>
                {q.difficulty}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                {q.topic}
              </span>
            </div>

            <p className="text-lg font-medium text-gray-900 leading-relaxed">
              {q.question}
            </p>
          </div>

          {!flipped ? (
            <p className="text-sm text-gray-400 mt-6 text-center">
              tap to reveal answer
            </p>
          ) : (
            <div className="mt-6 border-t border-gray-100 pt-4">
              <p className="text-xs font-medium text-green-700 mb-2">IDEAL ANSWER</p>
              <p className="text-sm text-gray-700 leading-relaxed">{q.idealAnswer}</p>
              <div className="mt-3 bg-amber-50 rounded-lg px-3 py-2">
                <p className="text-xs text-amber-700"><strong>Why asked:</strong> {q.whyItMatters}</p>
              </div>
            </div>
          )}
        </div>

        {/* rating buttons — only show after flip */}
        {flipped && (
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => rate('need_review')}
              className="bg-red-50 text-red-600 border border-red-200 py-3 rounded-xl text-sm font-medium hover:bg-red-100"
            >
              😕 Need review
            </button>
            <button
              onClick={() => rate('shaky')}
              className="bg-orange-50 text-orange-600 border border-orange-200 py-3 rounded-xl text-sm font-medium hover:bg-orange-100"
            >
              🤔 Shaky
            </button>
            <button
              onClick={() => rate('got_it')}
              className="bg-green-50 text-green-600 border border-green-200 py-3 rounded-xl text-sm font-medium hover:bg-green-100"
            >
              ✅ Got it
            </button>
          </div>
        )}

        {/* skip */}
        {!flipped && (
          <div className="text-center mt-4">
            <button
              onClick={() => { setFlipped(false); setCurrent(p => Math.min(p + 1, questions.length - 1)) }}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              skip →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
