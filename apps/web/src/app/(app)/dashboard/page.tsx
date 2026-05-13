import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const initials = session.user?.name
    ? session.user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : '??'

  const steps = [
    { num: '01', title: 'Generate a Q&A Bank', desc: 'Paste your JD + resume — Claude builds tailored questions in ~15 sec.', color: 'bg-violet-600' },
    { num: '02', title: 'Study flashcards', desc: 'Drill every question. Rate confidence so weak spots get more attention.', color: 'bg-purple-600' },
    { num: '03', title: 'Take a mock interview', desc: 'Camera on, mic active, live transcript. Real pressure from your desk.', color: 'bg-amber-500' },
    { num: '04', title: 'Review your debrief', desc: 'Per-question scores, coaching notes, and exactly what to fix next.', color: 'bg-emerald-600' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-md"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }}>
            {initials}
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Hey, {session.user?.name?.split(' ')[0] ?? 'there'} 👋
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">Ready to prepare for your next interview?</p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <Link
            href="/banks/new"
            className="group bg-white rounded-2xl border border-slate-200 p-6 hover:border-violet-300 hover:shadow-md hover:shadow-violet-100 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-xl mb-4">✨</div>
            <h2 className="font-black text-slate-900 text-lg mb-1 tracking-tight group-hover:text-violet-700 transition-colors">
              Generate Q&A Bank
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">
              Paste a JD + resume and get 20 personalised questions powered by Claude.
            </p>
            <div className="flex items-center gap-1 text-violet-600 text-sm font-semibold">
              Get started
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          <Link
            href="/banks"
            className="group bg-white rounded-2xl border border-slate-200 p-6 hover:border-amber-300 hover:shadow-md hover:shadow-amber-50 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-xl mb-4">📚</div>
            <h2 className="font-black text-slate-900 text-lg mb-1 tracking-tight group-hover:text-amber-700 transition-colors">
              My Q&A Banks
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">
              View, study, and launch mock interviews from your existing question banks.
            </p>
            <div className="flex items-center gap-1 text-amber-600 text-sm font-semibold">
              Browse banks
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Steps */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-black text-slate-900 text-base tracking-tight mb-5">How it works</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {steps.map((s) => (
              <div key={s.num} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-xs flex-shrink-0 ${s.color}`}>
                  {s.num}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 mb-0.5">{s.title}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
