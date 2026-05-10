import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'

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
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-gray-400 text-sm">Dashboard coming in Phase 1...</p>
        </div>
      </div>
    </div>
  )
}
