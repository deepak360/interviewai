'use client'
import { useEffect, useRef, useState } from 'react'

interface Props {
  score: number
  label: string
  size?: number
  strokeWidth?: number
  color?: string
  delay?: number
}

export default function ScoreRing({
  score,
  label,
  size = 96,
  strokeWidth = 8,
  color = '#7c3aed',
  delay = 0,
}: Props) {
  const [animated, setAnimated] = useState(false)
  const ref = useRef<SVGSVGElement>(null)

  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const dashoffset = circumference * (1 - score / 100)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setAnimated(true), delay)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg
          ref={ref}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
        >
          {/* Track */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="#e2e8f0" strokeWidth={strokeWidth}
          />
          {/* Progress */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={animated ? dashoffset : circumference}
            style={{ transition: `stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1) ${delay}ms` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-black text-slate-900">{score}</span>
        </div>
      </div>
      <span className="text-xs text-slate-500 font-medium text-center">{label}</span>
    </div>
  )
}
