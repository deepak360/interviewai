'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

export default function Navbar() {
  const path = usePathname()

  const links = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/banks', label: 'My Banks' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-slate-900 font-black text-base tracking-tight">InterviewAI</span>
        </Link>
        <div className="hidden sm:flex items-center gap-1">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm px-3 py-1.5 rounded-lg transition-all font-medium ${
                path === l.href || (l.href !== '/dashboard' && path.startsWith(l.href))
                  ? 'text-violet-700 bg-violet-50'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: '/login' })}
        className="text-sm text-slate-400 hover:text-red-500 transition-colors font-medium"
      >
        Sign out
      </button>
    </nav>
  )
}
