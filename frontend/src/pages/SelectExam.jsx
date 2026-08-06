import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getCategories } from '../interviewApi'

export default function SelectExam() {
  const { categoryId } = useParams()
  const [category, setCategory] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getCategories()
      .then((cats) => {
        const found = cats.find((c) => c.id === categoryId)
        if (!found) {
          setError('Ye category nahi mili.')
        } else {
          setCategory(found)
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [categoryId])

  if (loading) {
    return <div className="page"><div className="loading-wrap"><div className="spinner" />Load ho raha hai...</div></div>
  }

  return (
    <div className="page">
      <div className="page-head">
        <Link to="/ai-interview" style={{ fontSize: 13, color: 'var(--ink-soft)' }}>&larr; Categories</Link>
        <h1 style={{ marginTop: 12 }}>{category?.icon} {category?.name}</h1>
        <p>Exam chunein jiski practice karni hai.</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {category && (
        <div className="exam-list">
          {category.exams.map((exam) => (
            <div
              key={exam.id}
              className="exam-item"
              onClick={() => navigate(`/ai-interview/${categoryId}/${exam.id}/instructions`)}
            >
              <div>
                <div className="name">{exam.name}</div>
                <div className="meta">{exam.totalQuestions} questions · {exam.durationMinutes} min</div>
              </div>
              <span className="btn secondary">Select</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
