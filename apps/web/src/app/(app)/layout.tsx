import Navbar from '@/components/Navbar'
import Link from 'next/link'

function AppFooter() {
  return (
    <footer className="border-t border-slate-100 bg-white mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-5 text-xs text-slate-400">
          <Link href="/" className="hover:text-violet-600 transition-colors font-medium">InterviewAI</Link>
          <a href="#" className="hover:text-slate-600 transition-colors">Privacy</a>
          <a href="#" className="hover:text-slate-600 transition-colors">Terms</a>
          <a href="#" className="hover:text-slate-600 transition-colors">Help</a>
        </div>
        <p className="text-xs text-slate-400">© 2026 InterviewAI</p>
      </div>
    </footer>
  )
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <AppFooter />
    </div>
  )
}
