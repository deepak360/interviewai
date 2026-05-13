import Link from 'next/link'
import AnimatedCounter from '@/components/AnimatedCounter'
import ScoreRing from '@/components/ScoreRing'

function MockCard() {
  return (
    <div className="animate-float relative w-full max-w-sm mx-auto lg:mx-0" style={{ animationDuration: '5s' }}>
      <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200 border border-slate-200 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-red-500 font-semibold">
            <div className="relative flex items-center justify-center w-2 h-2">
              <div className="animate-ping-slow absolute inline-flex w-full h-full rounded-full bg-red-400 opacity-75" />
              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
            </div>
            Live
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <div className="text-xs text-violet-600 font-bold mb-2 uppercase tracking-wider">Question 3 of 8</div>
          <p className="text-slate-800 text-sm leading-relaxed font-medium">
            Tell me about a time you had to deal with a difficult stakeholder. How did you handle it?
          </p>
        </div>

        <div className="flex gap-2 items-center">
          <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full rounded-full animate-fadeInLeft delay-500"
              style={{ width: '38%', background: 'linear-gradient(90deg, #7c3aed, #9333ea, #d97706)' }} />
          </div>
          <span className="text-xs text-slate-400 font-mono">3:42</span>
        </div>

        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
          <div className="text-xs text-slate-400 font-medium mb-1">Live transcript</div>
          <p className="text-slate-800 text-xs leading-relaxed">
            In my last role at Acme Corp, I worked with a senior director who frequently changed
            <span className="inline-block w-0.5 h-3.5 bg-violet-500 ml-0.5 align-middle"
              style={{ animation: 'blink 1s step-end infinite' }} />
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Clarity', val: 87, color: '#7c3aed' },
            { label: 'Pace', val: 72, color: '#9333ea' },
            { label: 'Depth', val: 91, color: '#d97706' },
          ].map((m, i) => (
            <div key={m.label}
              className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-center animate-scaleIn"
              style={{ animationDelay: `${0.4 + i * 0.15}s` }}>
              <div className="text-lg font-black" style={{ color: m.color }}>{m.val}</div>
              <div className="text-xs text-slate-500">{m.label}</div>
              <div className="mt-1.5 h-1 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full rounded-full animate-fadeInLeft"
                  style={{ width: `${m.val}%`, background: m.color, animationDelay: `${0.6 + i * 0.15}s` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating badge */}
      <div className="absolute -top-3 -right-3 w-16 h-16 bg-white border border-violet-200 rounded-2xl shadow-lg shadow-violet-100 flex flex-col items-center justify-center animate-scaleIn delay-700">
        <div className="text-xl font-black text-violet-600">94</div>
        <div className="text-xs text-slate-400">Score</div>
      </div>

      <div className="absolute -bottom-4 -left-3 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-lg animate-scaleIn delay-800">
        <div className="text-xs text-slate-500">AI Feedback ready</div>
        <div className="text-xs text-violet-600 font-semibold">View debrief →</div>
      </div>
    </div>
  )
}

function Hero() {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden bg-white">
      <div className="absolute top-20 left-10 w-96 h-96 rounded-full opacity-[0.07] blur-3xl"
        style={{ background: 'radial-gradient(circle, #7c3aed, transparent)', animation: 'float 8s ease-in-out infinite' }} />
      <div className="absolute bottom-10 right-20 w-72 h-72 rounded-full opacity-[0.05] blur-3xl"
        style={{ background: 'radial-gradient(circle, #9333ea, transparent)', animation: 'float 10s ease-in-out infinite reverse' }} />

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 rounded-full px-4 py-2 mb-8 animate-fadeInUp">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
              <span className="text-violet-700 text-sm font-semibold">Powered by Claude AI</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1.05] tracking-tighter mb-6 animate-fadeInUp delay-100">
              Land your
              <br />
              <span className="text-transparent bg-clip-text animate-gradientMove"
                style={{ backgroundImage: 'linear-gradient(135deg, #7c3aed, #9333ea, #6d28d9)', backgroundSize: '200% 200%' }}>
                dream job.
              </span>
              <br />
              <span className="text-slate-400">Not by luck.</span>
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed mb-10 max-w-md animate-fadeInUp delay-200">
              Paste a job description and resume. Get a personalised question bank, practice with flashcards, and take a live AI-proctored mock interview.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10 animate-fadeInUp delay-300">
              <Link href="/register"
                className="group flex items-center justify-center gap-2 text-white px-7 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }}>
                Start for free
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <a href="#how-it-works"
                className="flex items-center justify-center gap-2 text-slate-700 px-7 py-3.5 rounded-xl font-bold text-sm border border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                See how it works
              </a>
            </div>

            <div className="flex flex-wrap gap-5 text-slate-500 text-sm animate-fadeInUp delay-400">
              {['No credit card', 'Free plan forever', '2-min setup'].map(t => (
                <div key={t} className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  {t}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center lg:justify-end pb-8 animate-fadeInRight delay-200">
            <MockCard />
          </div>
        </div>
      </div>
    </section>
  )
}

function Stats() {
  const items = [
    { target: 50, suffix: 'K+', label: 'Interviews practiced', icon: '🎯' },
    { target: 94, suffix: '%', label: 'Confidence boost reported', icon: '📈' },
    { target: 3, suffix: '×', label: 'Faster preparation', icon: '⚡' },
    { target: 200, suffix: '+', label: 'Job roles covered', icon: '💼' },
  ]

  return (
    <section className="border-y border-slate-200 bg-slate-50 py-14 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        {items.map((s, i) => (
          <div key={s.label}
            className="text-center animate-scaleIn"
            style={{ animationDelay: `${i * 0.12}s` }}>
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-3xl font-black mb-1 tracking-tight"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              <AnimatedCounter target={s.target} suffix={s.suffix} />
            </div>
            <div className="text-slate-500 text-sm">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Features() {
  const features = [
    { icon: '🧠', title: 'AI Question Banks', desc: 'Claude reads your JD and resume to generate 20–40 targeted questions — technical, behavioural, and situational, tailored to the exact role.', tag: 'Personalised', wide: true, delay: 0 },
    { icon: '🃏', title: 'Flashcard Drill', desc: 'Spaced repetition with confidence ratings. Weak spots get more attention automatically.', tag: 'Smart study', wide: false, delay: 100 },
    { icon: '🎭', title: 'AI Personas', desc: 'Friendly HR, brutal tech lead, or speed-round panel. Know every style before the real interview.', tag: 'Configurable', wide: false, delay: 200 },
    { icon: '📊', title: 'Scored Debrief & Coaching', desc: 'Per-question scores, filler word counts, pacing analysis, and concrete steps to fix each weak area before your real interview.', tag: 'Post-interview', wide: true, delay: 100 },
    { icon: '🎥', title: 'Live Mock Interview', desc: 'Camera on, mic active, real-time transcription. Full pressure from your desk.', tag: 'Proctored', wide: false, delay: 200 },
    { icon: '🔒', title: 'Private & Encrypted', desc: 'Your resume and recordings encrypted at rest. Delete everything any time.', tag: 'Secure', wide: false, delay: 300 },
  ]

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14 animate-fadeInUp">
          <p className="text-xs font-bold tracking-widest uppercase text-violet-600 mb-3">Features</p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Everything you need to land the offer</h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">From personalised prep to realistic simulation — one platform, end to end.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {features.map(f => (
            <div key={f.title}
              className={`group bg-white border border-slate-200 rounded-2xl p-7 hover:border-violet-300 hover:shadow-xl hover:shadow-violet-50 hover:-translate-y-1 transition-all duration-300 animate-fadeInUp ${f.wide ? 'md:col-span-4' : 'md:col-span-2'}`}
              style={{ animationDelay: `${f.delay}ms` }}>
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl group-hover:scale-110 transition-transform duration-200">{f.icon}</span>
                <span className="text-xs text-violet-700 bg-violet-50 border border-violet-200 px-2.5 py-1 rounded-full font-semibold">{f.tag}</span>
              </div>
              <h3 className="font-black text-slate-900 text-lg mb-2">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    { num: '01', title: 'Paste JD & resume', desc: 'Drop the job description and resume. Claude maps skills, gaps, and likely questions instantly.', icon: '📋', color: '#7c3aed', bg: '#f5f3ff' },
    { num: '02', title: 'Study flashcards', desc: 'Drill tailored questions. Rate confidence so the system hammers your weakest spots.', icon: '🃏', color: '#9333ea', bg: '#faf5ff' },
    { num: '03', title: 'Take mock interview', desc: 'Camera on, timed answers, live AI interviewer. Real pressure from your desk.', icon: '🎤', color: '#d97706', bg: '#fffbeb' },
    { num: '04', title: 'Get your debrief', desc: 'Scores, coaching notes, and exactly what to fix before the real interview.', icon: '📊', color: '#059669', bg: '#f0fdf4' },
  ]

  return (
    <section id="how-it-works" className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14 animate-fadeInUp">
          <p className="text-xs font-bold tracking-widest uppercase text-violet-600 mb-3">How it works</p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Four steps to interview-ready.</h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">No fluff — the fastest path from nervous to confident.</p>
        </div>

        {/* Pipeline timeline */}
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-10 left-[calc(12.5%+8px)] right-[calc(12.5%+8px)] h-0.5 bg-slate-200 origin-left animate-fadeInUp delay-200">
            <div className="h-full origin-left animate-fadeInLeft delay-400"
              style={{ background: 'linear-gradient(90deg, #7c3aed, #9333ea, #d97706, #059669)', animation: 'drawLine 1.2s ease-out 0.5s both' }} />
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.num}
                className="relative flex flex-col items-center text-center animate-fadeInUp"
                style={{ animationDelay: `${i * 150}ms` }}>
                {/* Step circle */}
                <div className="relative w-20 h-20 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-md z-10 hover:scale-110 transition-transform duration-200"
                  style={{ background: s.bg, border: `2px solid ${s.color}20` }}>
                  {s.icon}
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-white text-xs font-black flex items-center justify-center shadow-sm"
                    style={{ background: s.color }}>
                    {i + 1}
                  </div>
                </div>
                <h3 className="font-black text-slate-900 text-base mb-2">{s.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Arrow indicators on mobile */}
          <div className="md:hidden flex justify-center my-2">
            <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Outcome banner */}
        <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-6 flex items-center justify-between gap-4 shadow-sm animate-fadeInUp delay-600">
          <div className="flex items-center gap-4">
            <div className="text-4xl">🎉</div>
            <div>
              <p className="font-black text-slate-900">Result: You walk in confident.</p>
              <p className="text-slate-500 text-sm">94% of users report significantly higher confidence after just one full session.</p>
            </div>
          </div>
          <Link href="/register"
            className="flex-shrink-0 text-white text-sm px-5 py-2.5 rounded-xl font-bold shadow-md hover:shadow-lg transition-all whitespace-nowrap"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }}>
            Try it free →
          </Link>
        </div>
      </div>
    </section>
  )
}

function WhatWeMeasure() {
  const metrics = [
    { score: 92, label: 'Accuracy', color: '#7c3aed', desc: 'How correct and relevant your answer is to the question asked.', delay: 0 },
    { score: 87, label: 'Completeness', color: '#9333ea', desc: 'Did you cover all key aspects the interviewer expects?', delay: 200 },
    { score: 84, label: 'Clarity', color: '#d97706', desc: 'Structure, flow, and how easily your answer can be followed.', delay: 400 },
    { score: 79, label: 'Use of examples', color: '#059669', desc: 'Concrete stories and data vs vague generalisations.', delay: 600 },
  ]

  const comms = [
    { label: 'Filler words', value: '3', unit: 'per min', good: true, icon: '🗣️' },
    { label: 'Pace', value: '148', unit: 'WPM', good: true, icon: '⏱️' },
    { label: 'Pauses', value: '2.1', unit: 'sec avg', good: true, icon: '⏸️' },
    { label: 'Eye contact', value: '91', unit: '%', good: true, icon: '👁️' },
  ]

  return (
    <section id="what-we-measure" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14 animate-fadeInUp">
          <p className="text-xs font-bold tracking-widest uppercase text-violet-600 mb-3">Scoring infographic</p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">What AI measures, exactly.</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Every answer gets scored across four dimensions. Every session tracks your communication quality. No vague feedback — just data.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Score rings infographic */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 animate-fadeInLeft">
            <h3 className="font-black text-slate-900 text-lg mb-2">Answer quality scores</h3>
            <p className="text-slate-500 text-sm mb-8">Each answer scored 0–25 per dimension, totalled to 100.</p>
            <div className="grid grid-cols-2 gap-6">
              {metrics.map(m => (
                <div key={m.label} className="flex flex-col items-center gap-3">
                  <ScoreRing score={m.score} label={m.label} color={m.color} size={90} delay={m.delay} />
                  <p className="text-xs text-slate-400 text-center leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Communication metrics */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 animate-fadeInRight">
            <h3 className="font-black text-slate-900 text-lg mb-2">Communication analytics</h3>
            <p className="text-slate-500 text-sm mb-8">Tracked from your microphone and camera in real-time.</p>
            <div className="space-y-5">
              {comms.map((c, i) => (
                <div key={c.label} className="animate-fadeInUp" style={{ animationDelay: `${i * 120}ms` }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{c.icon}</span>
                      <span className="text-sm font-semibold text-slate-700">{c.label}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-slate-900 text-sm">{c.value}</span>
                      <span className="text-xs text-slate-400 ml-1">{c.unit}</span>
                      <span className="ml-2 text-xs text-emerald-600 font-semibold bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full">Good</span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full rounded-full"
                      style={{
                        width: i === 0 ? '85%' : i === 1 ? '74%' : i === 2 ? '78%' : '91%',
                        background: 'linear-gradient(90deg, #7c3aed, #9333ea)',
                        animation: `fillBar 1.2s ease-out ${i * 150 + 300}ms both`,
                        animationFillMode: 'both',
                      }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-violet-50 border border-violet-200 rounded-xl">
              <p className="text-xs text-violet-700 font-semibold mb-1">💡 AI coaching note</p>
              <p className="text-xs text-violet-600 leading-relaxed">
                Your filler word rate has dropped 40% since last session. Keep using the pause-and-breathe technique before answering.
              </p>
            </div>
          </div>
        </div>

        {/* Score improvement chart */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 animate-fadeInUp delay-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-black text-slate-900 text-lg">Score progression across sessions</h3>
              <p className="text-slate-500 text-sm mt-1">Users typically improve 18–24 points over 3 sessions.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <div className="w-3 h-3 rounded-full" style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }} />
                Your score
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <div className="w-3 h-3 rounded-full bg-slate-300" />
                Average
              </div>
            </div>
          </div>

          <div className="relative h-40 flex items-end gap-3">
            {[
              { session: 'S1', score: 52, avg: 58 },
              { session: 'S2', score: 64, avg: 62 },
              { session: 'S3', score: 73, avg: 66 },
              { session: 'S4', score: 81, avg: 69 },
              { session: 'S5', score: 87, avg: 71 },
            ].map((d, i) => (
              <div key={d.session} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full flex flex-col items-center gap-1">
                  {/* User bar */}
                  <div className="w-full rounded-t-lg relative overflow-hidden"
                    style={{ height: `${d.score * 1.4}px`, background: 'linear-gradient(180deg, #7c3aed, #9333ea)', animation: `fillBar 0.8s ease-out ${i * 120}ms both`, transformOrigin: 'bottom' }}>
                    <div className="absolute inset-0 animate-shimmer" />
                  </div>
                </div>
                <span className="text-xs text-slate-400 font-medium">{d.session}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-sm">📈</div>
              <div>
                <p className="text-sm font-bold text-slate-900">+35 points improvement</p>
                <p className="text-xs text-slate-400">Over 5 sessions · Typical user journey</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-emerald-600">87</div>
              <div className="text-xs text-slate-400">Latest score</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  const items = [
    { quote: "I'd been failing technical screens for months. After two weeks with InterviewAI, I landed two FAANG offers. The question banks are frighteningly accurate.", name: 'Priya M.', role: 'Senior SWE', av: 'PM', score: 91 },
    { quote: "The mock interview feedback caught that I was overusing filler words. No coach had flagged that in 6 months of prep. This did it in one session.", name: 'James T.', role: 'PM, Series B', av: 'JT', score: 84 },
    { quote: "As a career switcher into finance I had zero idea what they actually ask. The JD analysis gave me a precise roadmap — I crushed the interview.", name: 'Aisha K.', role: 'IB Associate', av: 'AK', score: 88 },
  ]

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14 animate-fadeInUp">
          <p className="text-xs font-bold tracking-widest uppercase text-violet-600 mb-3">Stories</p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">They prepared. They won.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((t, i) => (
            <div key={t.name}
              className="bg-white border border-slate-200 rounded-2xl p-7 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-50 hover:-translate-y-1 transition-all duration-300 animate-fadeInUp"
              style={{ animationDelay: `${i * 150}ms` }}>
              <div className="flex items-center justify-between mb-5">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, idx) => (
                    <svg key={idx} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-violet-600">{t.score}</div>
                  <div className="text-xs text-slate-400">final score</div>
                </div>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }}>
                  {t.av}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                  <div className="text-slate-400 text-xs">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  const plans = [
    { name: 'Free', price: '$0', period: 'forever', desc: 'One application. Prove it works.', features: ['1 question bank', '20 flashcard questions', '1 mock interview', 'Basic debrief'], cta: 'Start free', href: '/register', highlight: false },
    { name: 'Pro', price: '$19', period: '/mo', desc: 'For the serious job seeker.', features: ['Unlimited banks & flashcards', '10 mock interviews/month', 'Full debrief + coaching plan', 'All AI personas', 'Recording storage'], cta: 'Start Pro free', href: '/register', highlight: true },
    { name: 'Team', price: '$49', period: '/mo', desc: 'Bootcamps & career coaches.', features: ['Everything in Pro', '5 seats included', 'Team analytics', 'Custom personas', 'Priority support'], cta: 'Contact us', href: '/register', highlight: false },
  ]

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14 animate-fadeInUp">
          <p className="text-xs font-bold tracking-widest uppercase text-violet-600 mb-3">Pricing</p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Simple pricing, no surprises.</h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">Start free. Upgrade when you need more. Cancel any time.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {plans.map((p, i) => (
            <div key={p.name}
              className={`rounded-2xl p-8 border transition-all animate-fadeInUp hover:-translate-y-1 duration-300 ${p.highlight ? 'shadow-xl shadow-violet-100 md:-translate-y-2 border-violet-300' : 'bg-white border-slate-200 shadow-sm hover:shadow-md'}`}
              style={{
                animationDelay: `${i * 120}ms`,
                ...(p.highlight ? { background: 'linear-gradient(160deg, #f5f3ff, #ede9fe)' } : {}),
              }}>
              {p.highlight && (
                <div className="text-xs font-black uppercase tracking-widest text-center bg-violet-600 text-white px-3 py-1 rounded-full mb-4 w-fit mx-auto animate-pulseGlow">
                  Most popular
                </div>
              )}
              <div className={`text-sm font-bold mb-1 ${p.highlight ? 'text-violet-700' : 'text-slate-500'}`}>{p.name}</div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-black text-slate-900">{p.price}</span>
                <span className="text-sm text-slate-400">{p.period}</span>
              </div>
              <p className="text-slate-500 text-sm mb-6">{p.desc}</p>
              <ul className="space-y-2.5 mb-8">
                {p.features.map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-slate-700">
                    <svg className="w-4 h-4 flex-shrink-0 text-violet-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={p.href}
                className={`block text-center py-3 rounded-xl font-bold text-sm transition-all ${p.highlight ? 'text-white shadow-md hover:shadow-lg' : 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-50'}`}
                style={p.highlight ? { background: 'linear-gradient(135deg, #7c3aed, #9333ea)' } : {}}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #4c1d95, #6d28d9, #7e22ce)' }}>
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #c026d3, transparent)', animation: 'float 8s ease-in-out infinite' }} />
      <div className="absolute bottom-0 left-10 w-72 h-72 rounded-full opacity-15 blur-3xl"
        style={{ background: 'radial-gradient(circle, #a78bfa, transparent)', animation: 'float 10s ease-in-out infinite reverse' }} />
      <div className="relative max-w-3xl mx-auto px-6 text-center animate-fadeInUp">
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
          Your next offer
          <br />
          <span className="text-violet-200">starts today.</span>
        </h2>
        <p className="text-violet-200 text-xl mb-10 font-light">
          Thousands of candidates prepared here. Now it&apos;s your turn.
        </p>
        <Link href="/register"
          className="inline-flex items-center gap-2 bg-white text-violet-700 px-10 py-4 rounded-2xl font-bold text-base transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 hover:scale-105 animate-pulseGlow"
          style={{ animationDuration: '2s' }}>
          Create free account
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
        <p className="text-violet-300 text-sm mt-4">No card needed · 2 minutes</p>
      </div>
    </section>
  )
}

function StudyPaths() {
  const paths = [
    {
      icon: '📖',
      title: 'PM Interviews',
      color: 'from-violet-500 to-purple-600',
      bg: 'bg-violet-50',
      border: 'border-violet-200',
      text: 'text-violet-700',
      skills: ['Product sense', 'Metrics & data', 'Execution', 'Estimation'],
      questions: '200+',
    },
    {
      icon: '💻',
      title: 'Eng Leadership',
      color: 'from-blue-500 to-indigo-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      skills: ['System design', 'Team processes', 'Trade-offs', 'Delivery'],
      questions: '180+',
    },
    {
      icon: '📊',
      title: 'Data Science',
      color: 'from-amber-500 to-orange-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-700',
      skills: ['Experiment design', 'SQL/Python', 'Model evaluation', 'Storytelling'],
      questions: '150+',
    },
  ]

  return (
    <section className="section bg-slate-50">
      <div className="container-lg">
        <div className="text-center mb-12">
          <p className="section-label mb-3">Study Paths</p>
          <h2 className="section-heading mb-4">Built for your role</h2>
          <p className="section-subheading max-w-xl mx-auto">
            Paste your JD and Claude auto-detects your role. Questions tailored to exactly what you&apos;ll be asked.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {paths.map((p, i) => (
            <div key={p.title} className="card card-hover p-6 animate-fadeInUp" style={{ animationDelay: `${i * 120}ms` }}>
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center text-2xl mb-5 shadow-sm`}>
                {p.icon}
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight mb-1">{p.title}</h3>
              <p className={`text-xs font-bold mb-4 ${p.text}`}>{p.questions} questions</p>
              <div className="space-y-2">
                {p.skills.map(s => (
                  <div key={s} className="flex items-center gap-2.5">
                    <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${p.color}`} />
                    <span className="text-sm text-slate-600">{s}</span>
                  </div>
                ))}
              </div>
              <div className={`mt-5 ${p.bg} border ${p.border} rounded-xl px-3 py-2 flex items-center justify-between`}>
                <span className={`text-xs font-semibold ${p.text}`}>Confidence boost</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, idx) => (
                    <div key={idx} className={`w-1.5 h-4 rounded-full ${idx < 4 ? `bg-gradient-to-t ${p.color}` : 'bg-slate-200'}`} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <StudyPaths />
      <WhatWeMeasure />
      <Testimonials />
      <Pricing />
      <CTA />
    </main>
  )
}
