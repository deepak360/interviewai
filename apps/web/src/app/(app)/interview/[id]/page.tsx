'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import api from '@/lib/api'

interface Question {
  id: string
  topic: string
  difficulty: 'core' | 'deep' | 'trap'
  question: string
  idealAnswer: string
}

type Stage = 'setup' | 'intro' | 'question' | 'answer' | 'complete'

export default function InterviewPage() {
  const { id } = useParams()
  const router = useRouter()

  const [questions, setQuestions] = useState<Question[]>([])
  const [current, setCurrent] = useState(0)
  const [stage, setStage] = useState<Stage>('setup')
  const [transcript, setTranscript] = useState('')
  const [timer, setTimer] = useState(120)
  const [loading, setLoading] = useState(true)
  const [camAllowed, setCamAllowed] = useState(false)
  const [persona, setPersona] = useState('balanced')
  const [interviewId, setInterviewId] = useState<string | null>(null)
  const [scoring, setScoring] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const recognitionRef = useRef<any>(null)
  const timerRef = useRef<any>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const transcriptRef = useRef('')
  const isRecordingRef = useRef(false)
  const stageRef = useRef<Stage>('setup')

  // keep stageRef in sync
  useEffect(() => { stageRef.current = stage }, [stage])

  const attachStream = useCallback((node: HTMLVideoElement | null) => {
    if (node && streamRef.current) {
      node.srcObject = streamRef.current
      videoRef.current = node
    }
  }, [])

  useEffect(() => {
    api.get(`/api/banks/${id}`)
      .then(res => setQuestions(res.data.data.bank.questions as Question[]))
      .catch(() => router.push('/dashboard'))
      .finally(() => setLoading(false))
  }, [id])

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
      setCamAllowed(true)
    } catch {
      alert('Camera/mic access denied. Please allow access and try again.')
    }
  }

  function speak(text: string, onEnd?: () => void) {
    speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    utter.rate = 0.9
    if (onEnd) utter.onend = onEnd
    speechSynthesis.speak(utter)
  }

  async function startIntro() {
    try {
      const res = await api.post('/api/interviews', { bankId: id, persona })
      setInterviewId(res.data.data.interview.id)
    } catch {
      alert('Failed to start interview. Try again.')
      return
    }
    setStage('intro')
    const msg = `Hello! I am your ${persona} interviewer today. We will go through ${questions.length} questions. Take your time with each answer. Let us begin.`
    speak(msg, () => setStage('question'))
  }

  function startRecognition() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (e: any) => {
      let text = ''
      for (let i = 0; i < e.results.length; i++) {
        text += e.results[i][0].transcript + ' '
      }
      const trimmed = text.trim()
      setTranscript(trimmed)
      transcriptRef.current = trimmed
    }

    // auto-restart when recognition ends (handles browser timeout)
    recognition.onend = () => {
      if (isRecordingRef.current && stageRef.current === 'answer') {
        try {
          recognition.start()
        } catch { /* ignore restart errors */ }
      }
    }

    recognition.onerror = (e: any) => {
      if (e.error === 'no-speech' || e.error === 'audio-capture') {
        // restart on common errors
        if (isRecordingRef.current && stageRef.current === 'answer') {
          setTimeout(() => {
            try { recognition.start() } catch { /* ignore */ }
          }, 500)
        }
      }
    }

    recognition.start()
    recognitionRef.current = recognition
  }

  function startAnswer() {
    setStage('answer')
    setTranscript('')
    transcriptRef.current = ''
    isRecordingRef.current = true
    setTimer(120)

    startRecognition()

    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          handleNext(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  function stopRecognition() {
    isRecordingRef.current = false
    if (recognitionRef.current) {
      try { recognitionRef.current.stop() } catch { /* ignore */ }
      recognitionRef.current = null
    }
  }

  async function handleNext(skipped = false) {
    stopRecognition()
    clearInterval(timerRef.current)

    const q = questions[current]
    const finalTranscript = skipped ? '' : transcriptRef.current

    if (interviewId) {
      try {
        await api.post(`/api/interviews/${interviewId}/answer`, {
          questionId: q.id,
          question: q.question,
          idealAnswer: q.idealAnswer,
          transcript: finalTranscript
        })
      } catch { /* continue even if save fails */ }
    }

    setTranscript('')
    transcriptRef.current = ''

    if (current + 1 >= questions.length) {
      await finishInterview()
    } else {
      setCurrent(prev => prev + 1)
      setStage('question')
    }
  }

  async function finishInterview() {
    streamRef.current?.getTracks().forEach(t => t.stop())
    speechSynthesis.cancel()
    setScoring(true)
    setStage('complete')

    if (interviewId) {
      try {
        await api.post(`/api/interviews/${interviewId}/complete`)
      } catch { /* scoring will fail gracefully */ }
    }
    setScoring(false)
  }

  useEffect(() => {
    return () => {
      isRecordingRef.current = false
      streamRef.current?.getTracks().forEach(t => t.stop())
      clearInterval(timerRef.current)
      try { recognitionRef.current?.stop() } catch { /* ignore */ }
      speechSynthesis.cancel()
    }
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <p className="text-gray-400">Loading...</p>
    </div>
  )

  const q = questions[current]

  if (stage === 'setup') return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-gray-800 rounded-2xl p-8 max-w-lg w-full text-white">
        <h1 className="text-2xl font-bold mb-2">Mock Interview Setup</h1>
        <p className="text-gray-400 text-sm mb-6">
          {questions.length} questions · ~{Math.round(questions.length * 2)} minutes
        </p>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Interviewer Persona</label>
          <select
            value={persona} onChange={e => setPersona(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white"
          >
            <option value="balanced">Balanced — friendly but thorough</option>
            <option value="technical">Deep Diver — technical and probing</option>
            <option value="hr">Friendly HR — conversational and warm</option>
            <option value="aggressive">Aggressive — challenging and fast-paced</option>
          </select>
        </div>
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-300 mb-3">Camera & Mic</p>
          <div className="bg-gray-900 rounded-xl overflow-hidden aspect-video mb-3">
            <video
              ref={el => { if (el) { videoRef.current = el; if (streamRef.current) el.srcObject = streamRef.current } }}
              autoPlay muted playsInline className="w-full h-full object-cover"
            />
          </div>
          {!camAllowed ? (
            <button onClick={startCamera}
              className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700">
              Enable Camera & Mic
            </button>
          ) : (
            <p className="text-center text-green-400 text-sm">✓ Camera & mic ready</p>
          )}
        </div>
        <button onClick={startIntro} disabled={!camAllowed}
          className="w-full bg-green-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-40">
          Start Interview →
        </button>
      </div>
    </div>
  )

  if (stage === 'intro') return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="text-5xl mb-4 animate-pulse">🎤</div>
        <p className="text-gray-300">Interviewer is speaking...</p>
      </div>
    </div>
  )

  if (stage === 'complete') return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full text-white text-center">
        <div className="text-5xl mb-4">{scoring ? '⏳' : '🏁'}</div>
        <h2 className="text-2xl font-bold mb-2">
          {scoring ? 'Scoring your answers...' : 'Interview Complete!'}
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          {scoring
            ? 'AI is reviewing each answer. This takes about 30 seconds.'
            : 'Your answers have been saved and scored.'}
        </p>
        {!scoring && (
          <div className="space-y-3">
            {interviewId && (
              <button
                onClick={() => router.push(`/debrief/${interviewId}`)}
                className="w-full bg-green-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-green-700"
              >
                View Debrief →
              </button>
            )}
            <button onClick={() => router.push('/dashboard')}
              className="w-full bg-gray-700 text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-600">
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <span className="text-gray-400 text-sm">Question {current + 1} of {questions.length}</span>
        <div className="flex items-center gap-4">
          {stage === 'answer' && (
            <span className={`text-sm font-mono ${timer < 30 ? 'text-red-400 animate-pulse' : 'text-gray-400'}`}>
              ⏱ {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
            </span>
          )}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${stage === 'answer' ? 'bg-red-500 animate-pulse' : 'bg-gray-600'}`} />
            <span className="text-gray-400 text-sm">{stage === 'answer' ? 'Recording' : 'Ready'}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 gap-6 p-6 overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0">
          <div className="bg-gray-800 rounded-2xl p-6 flex-1 overflow-y-auto">
            <div className="flex gap-2 mb-4">
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-900 text-green-400">{q.difficulty}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300">{q.topic}</span>
            </div>
            <p className="text-white text-lg font-medium leading-relaxed">{q.question}</p>
            {stage === 'answer' && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-400">Your answer (live transcript)</p>
                  <span className="text-xs text-green-400 animate-pulse">● listening</span>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 min-h-24 border border-gray-700">
                  {transcript
                    ? <p className="text-gray-300 text-sm leading-relaxed">{transcript}</p>
                    : <p className="text-gray-600 text-sm">Start speaking...</p>
                  }
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 flex gap-3">
            {stage === 'question' && (
              <>
                <button onClick={() => speak(q.question, startAnswer)}
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-green-700">
                  🎤 Start Answering
                </button>
                <button onClick={() => handleNext(true)}
                  className="px-6 bg-gray-700 text-gray-300 py-3 rounded-xl text-sm font-medium hover:bg-gray-600">
                  Skip →
                </button>
              </>
            )}
            {stage === 'answer' && (
              <>
                <button onClick={() => handleNext(false)}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-blue-700">
                  Next Question →
                </button>
                <button onClick={() => handleNext(true)}
                  className="px-6 bg-gray-700 text-gray-300 py-3 rounded-xl text-sm font-medium hover:bg-gray-600">
                  Skip
                </button>
              </>
            )}
          </div>
        </div>

        <div className="w-64 shrink-0 flex flex-col gap-3">
          <div className="bg-gray-800 rounded-2xl overflow-hidden aspect-video relative">
            <video ref={attachStream} autoPlay muted playsInline className="w-full h-full object-cover" />
            {stage === 'answer' && (
              <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-600 rounded-full px-2 py-0.5">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                <span className="text-white text-xs">REC</span>
              </div>
            )}
          </div>
          <p className="text-gray-600 text-xs text-center">You</p>
          <div className="bg-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-xs mb-3">Progress</p>
            <div className="flex flex-wrap gap-1.5">
              {questions.map((_, i) => (
                <div key={i} className={`w-3 h-3 rounded-full ${
                  i < current ? 'bg-green-500' : i === current ? 'bg-blue-500 animate-pulse' : 'bg-gray-600'
                }`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
