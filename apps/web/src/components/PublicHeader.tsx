'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function PublicHeader() {
  const path = usePathname()
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(path) || path.startsWith('/reset-password')
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-sm group-hover:shadow-md transition-all"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-black text-slate-900 text-lg tracking-tight">InterviewAI</span>
        </Link>

        {/* Nav — hide on auth pages */}
        {!isAuthPage && (
          <nav className="hidden md:flex items-center gap-6">
            {[
              { href: '/#features', label: 'Features' },
              { href: '/#how-it-works', label: 'How it works' },
              { href: '/#testimonials', label: 'Reviews' },
            ].map(l => (
              <a key={l.label} href={l.href}
                className="text-sm text-slate-500 hover:text-slate-900 font-medium transition-colors">
                {l.label}
              </a>
            ))}
          </nav>
        )}

        {/* CTAs */}
        <div className="flex items-center gap-3">
          {isAuthPage ? (
            <Link href="/" className="text-sm text-slate-500 hover:text-slate-900 font-medium transition-colors">
              ← Home
            </Link>
          ) : (
            <>
              <Link href="/login"
                className="hidden sm:block text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-50">
                Log in
              </Link>
              <Link href="/register"
                className="text-sm text-white font-bold px-4 py-2 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }}>
                Get started free
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
