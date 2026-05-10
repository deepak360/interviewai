import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {session.user.name} 👋
        </h1>
        <p className="text-gray-500 mt-1">Ready to prepare for your next interview?</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/banks/new" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:border-green-400 transition-all group">
            <div className="text-3xl mb-3">✨</div>
            <h2 className="font-semibold text-gray-900 group-hover:text-green-700">Generate Q&A Bank</h2>
            <p className="text-sm text-gray-500 mt-1">Paste a JD + resume and get 20 personalised interview questions</p>
          </Link>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 opacity-50">
            <div className="text-3xl mb-3">🎤</div>
            <h2 className="font-semibold text-gray-900">Mock Interview</h2>
            <p className="text-sm text-gray-500 mt-1">Coming in Phase 2</p>
          </div>
        </div>
      </div>
    </div>
  )
}
