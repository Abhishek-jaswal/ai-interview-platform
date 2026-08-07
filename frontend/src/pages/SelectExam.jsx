import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getCategories } from '../interviewApi'
import { SkeletonCard } from '../components/Skeleton'

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

  return (
    <div className="page fade-in">
      <Link to="/ai-interview" style={{ fontSize: 13, color: 'var(--ink-soft)' }}>&larr; Categories</Link>

      {error && <div className="error-banner" style={{ marginTop: 16 }}>{error}</div>}

      {loading ? (
        <div style={{ marginTop: 20, display: 'grid', gap: 12 }}>
          <SkeletonCard lines={1} />
          <SkeletonCard lines={1} />
          <SkeletonCard lines={1} />
        </div>
      ) : (
        category && (
          <>
            <div className="page-head" style={{ marginTop: 12 }}>
              <h1>{category.icon} {category.name}</h1>
              <p>Exam chunein jiski practice karni hai.</p>
            </div>

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
          </>
        )
      )}
    </div>
  )
}
