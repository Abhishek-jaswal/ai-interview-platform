import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCategories, getCredits } from '../interviewApi'
import { SkeletonGrid } from '../components/Skeleton'

export default function AIInterview() {
  const [categories, setCategories] = useState([])
  const [credits, setCredits] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([getCategories(), getCredits()])
      .then(([cats, cred]) => {
        setCategories(cats)
        setCredits(cred)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page fade-in">
      <div className="page-head">
        <div className="eyebrow">AI Interview</div>
        <h1>Category chunein</h1>
        <p>
          {credits
            ? `Aapke paas ${credits.attemptsRemaining} attempt${credits.attemptsRemaining === 1 ? '' : 's'} bache hain.`
            : 'Government exam category select karein.'}
        </p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <SkeletonGrid count={6} />
      ) : (
        <div className="category-grid">
          {categories.map((cat) => (
            <div key={cat.id} className="category-card" onClick={() => navigate(`/ai-interview/${cat.id}`)}>
              <div className="icon">{cat.icon}</div>
              <h4>{cat.name}</h4>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
