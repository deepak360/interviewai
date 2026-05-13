import Link from 'next/link'

export default function PublicFooter() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-white font-black text-base tracking-tight">InterviewAI</span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-500 max-w-xs">
              AI-powered interview prep that gives you personalised feedback — so you walk in confident.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm">
              {['Features', 'How it works', 'Pricing', 'Changelog'].map(l => (
                <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">Study</h4>
            <ul className="space-y-2.5 text-sm">
              {['Interview tips', 'PM frameworks', 'Question types', 'STAR method'].map(l => (
                <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm">
              {['About', 'Blog', 'Privacy', 'Terms'].map(l => (
                <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-600">© 2026 InterviewAI. All rights reserved.</p>
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <span>Built with</span>
            <span className="text-violet-400">Claude</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
