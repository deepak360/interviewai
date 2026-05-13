'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import Link from 'next/link'
import { Skeleton } from '@/components/Skeleton'

interface Bank {
  id: string
  topics: string[]
  createdAt: string
  jdText: string
}

export default function BanksPage() {
  const router = useRouter()
  const [banks, setBanks] = useState<Bank[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/banks')
      .then(res => setBanks(res.data.data.banks))
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false))
  }, [router])

  if (loading) return (
    <div className="min-h-screen bg-slate-50 py-10 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-10 w-28 rounded-xl" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex gap-1.5 pt-1">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-8 w-16 rounded-lg" />
                  <Skeleton className="h-8 w-16 rounded-lg" />
                  <Skeleton className="h-8 w-16 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Q&A Banks</h1>
            <p className="text-slate-500 text-sm mt-1">{banks.length} bank{banks.length !== 1 ? 's' : ''} generated</p>
          </div>
          <Link
            href="/banks/new"
            className="flex items-center gap-1.5 text-white text-sm px-4 py-2.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            New Bank
          </Link>
        </div>

        {banks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-16 text-center">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-slate-700 font-semibold mb-1">No banks yet</p>
            <p className="text-slate-400 text-sm mb-6">Generate your first question bank from a job description.</p>
            <Link
              href="/banks/new"
              className="inline-flex items-center gap-1.5 text-white text-sm px-5 py-2.5 rounded-xl font-bold shadow-md"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }}
            >
              ✨ Generate first bank
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {banks.map((bank) => (
              <div
                key={bank.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-violet-200 hover:shadow-md hover:shadow-violet-50 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-400 mb-2 font-medium">
                      {new Date(bank.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    <p className="text-sm text-slate-700 line-clamp-2 leading-relaxed mb-3">{bank.jdText}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {bank.topics.map(t => (
                        <span key={t} className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-violet-50 text-violet-700 border border-violet-200">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <Link
                      href={`/banks/${bank.id}`}
                      className="text-xs px-3 py-2 rounded-lg font-semibold text-center bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 transition-all"
                    >
                      View
                    </Link>
                    <Link
                      href={`/study/${bank.id}`}
                      className="text-xs px-3 py-2 rounded-lg font-semibold text-center bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100 transition-all"
                    >
                      Study
                    </Link>
                    <Link
                      href={`/interview/${bank.id}`}
                      className="text-xs px-3 py-2 rounded-lg font-bold text-center text-white shadow-sm transition-all hover:shadow-md"
                      style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }}
                    >
                      Interview
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
