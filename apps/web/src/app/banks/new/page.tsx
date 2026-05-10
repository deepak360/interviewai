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
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Generate Q&A Bank</h1>
          <p className="text-gray-500 mt-1">
            Paste the job description and your resume — AI will generate a personalised question bank.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={jd}
              onChange={e => setJd(e.target.value)}
              rows={10}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              placeholder="Paste the full job description here..."
            />
            <p className="text-xs text-gray-400 mt-1">{jd.length} characters</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Resume <span className="text-gray-400 font-normal">(optional but recommended)</span>
            </label>
            <textarea
              value={resume}
              onChange={e => setResume(e.target.value)}
              rows={8}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              placeholder="Paste your resume text here..."
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Generating 20 questions... (this takes ~15 seconds)
              </>
            ) : (
              '✨ Generate Q&A Bank'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
