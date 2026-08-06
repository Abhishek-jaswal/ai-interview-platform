import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { submitExam } from '../interviewApi'

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = Math.floor(seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function Exam() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const session = state?.session

  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({}) // { questionId: 'A' | 'B' | 'C' | 'D' }
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const submittedRef = useRef(false)

  // Agar koi seedha /ai-interview/exam URL pe aa jaye bina session ke, wapas bhej do
  useEffect(() => {
    if (!session) navigate('/ai-interview')
  }, [session, navigate])

  const handleSubmit = useCallback(async () => {
    if (submittedRef.current || !session) return
    submittedRef.current = true
    setSubmitting(true)
    setError('')

    const answerList = session.questions.map((q) => ({
      questionId: q.id,
      selected: answers[q.id] || null,
    }))

    try {
      const result = await submitExam(session.sessionId, answerList)
      navigate('/ai-interview/result', { state: { result } })
    } catch (err) {
      setError(err.message)
      submittedRef.current = false
      setSubmitting(false)
    }
  }, [session, answers, navigate])

  useEffect(() => {
    if (!session) return
    const endTime = session.startedAt + session.durationMinutes * 60000
    const tick = () => {
      const remaining = Math.max(0, Math.round((endTime - Date.now()) / 1000))
      setSecondsLeft(remaining)
      if (remaining <= 0) handleSubmit()
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [session, handleSubmit])

  if (!session) return null

  const question = session.questions[current]
  const answeredCount = Object.keys(answers).length

  function selectAnswer(letter) {
    setAnswers((prev) => ({ ...prev, [question.id]: letter }))
  }

  return (
    <div className="page">
      <div className="exam-header">
        <div className="exam-progress">
          Question {current + 1} / {session.questions.length} · {answeredCount} answered
        </div>
        <div className={`exam-timer ${secondsLeft < 60 ? 'urgent' : ''}`}>{formatTime(secondsLeft)}</div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="question-card">
        <span className="subject-tag">{question.subject}</span>
        <p className="question-text">{question.question}</p>
        <div className="option-list">
          {Object.entries(question.options).map(([letter, text]) => (
            <div
              key={letter}
              className={`option-item ${answers[question.id] === letter ? 'selected' : ''}`}
              onClick={() => selectAnswer(letter)}
            >
              <span className="option-letter">{letter}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="question-jump">
        {session.questions.map((q, i) => (
          <button
            key={q.id}
            className={`jump-btn ${answers[q.id] ? 'answered' : ''} ${i === current ? 'current' : ''}`}
            onClick={() => setCurrent(i)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <div className="exam-nav">
        <button className="btn secondary" onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0}>
          Previous
        </button>
        {current === session.questions.length - 1 ? (
          <button className="btn" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Submit ho raha hai...' : 'Submit'}
          </button>
        ) : (
          <button className="btn secondary" onClick={() => setCurrent((c) => Math.min(session.questions.length - 1, c + 1))}>
            Next
          </button>
        )}
      </div>
    </div>
  )
}
