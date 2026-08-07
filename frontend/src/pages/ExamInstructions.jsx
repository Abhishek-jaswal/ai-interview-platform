import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getCategories, startExam } from '../interviewApi'
import { SkeletonCard } from '../components/Skeleton'

export default function ExamInstructions() {
  const { categoryId, examId } = useParams()
  const [exam, setExam] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [starting, setStarting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    getCategories()
      .then((cats) => {
        const category = cats.find((c) => c.id === categoryId)
        const found = category?.exams.find((e) => e.id === examId)
        if (!found) {
          setError('Ye exam nahi mila.')
        } else {
          setExam(found)
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [categoryId, examId])

  async function handleStart() {
    setStarting(true)
    setError('')
    try {
      const session = await startExam(categoryId, examId)
      navigate('/ai-interview/exam', { state: { session } })
    } catch (err) {
      if (err.code === 'NO_ATTEMPTS_LEFT') {
        setError('Aapke attempts khatam ho gaye hain. Credits kharidne ke liye support se sampark karein.')
      } else {
        setError(err.message)
      }
      setStarting(false)
    }
  }

  return (
    <div className="page fade-in">
      <Link to={`/ai-interview/${categoryId}`} style={{ fontSize: 13, color: 'var(--ink-soft)' }}>&larr; Wapas jayein</Link>

      {error && <div className="error-banner" style={{ marginTop: 16 }}>{error}</div>}

      {loading ? (
        <div style={{ marginTop: 20 }}>
          <SkeletonCard lines={5} />
        </div>
      ) : (
        exam && (
          <div className="instructions-card" style={{ marginTop: 20 }}>
            <h2>{exam.name}</h2>
            <p style={{ color: 'var(--ink-soft)', fontSize: 14 }}>Shuru karne se pehle ye details dhyan se padhein.</p>

            <div className="instructions-grid">
              <div className="stat">
                <div className="val">{exam.totalQuestions}</div>
                <div className="label">Total Questions</div>
              </div>
              <div className="stat">
                <div className="val">{exam.durationMinutes}</div>
                <div className="label">Minutes</div>
              </div>
              <div className="stat">
                <div className="val">{exam.negativeMarking}</div>
                <div className="label">Negative Marking</div>
              </div>
            </div>

            <ul>
              <li>Ek attempt use hoga is exam ko start karte hi — beech me chhod diya to bhi wapas nahi milega.</li>
              <li>Timer server-side track hota hai, browser band karne se time nahi rukega.</li>
              <li>Sabhi questions AI-generated hain aur har baar naye honge.</li>
              <li>Submit karne ke baad turant score aur AI feedback milega.</li>
            </ul>

            <button className="btn" onClick={handleStart} disabled={starting}>
              {starting ? 'Exam taiyar ho raha hai...' : 'Start Exam'}
            </button>
          </div>
        )
      )}
    </div>
  )
}
