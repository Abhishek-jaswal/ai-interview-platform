import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getHistory } from '../api'
import { SkeletonCard } from '../components/Skeleton'

function scoreClass(score) {
  if (score >= 80) return 'good'
  if (score >= 60) return 'mid'
  return 'low'
}

export default function History() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getHistory()
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page fade-in">
      <div className="page-head">
        <div className="eyebrow">Past Checks</div>
        <h1>History</h1>
        <p>Aapke pichle sabhi resume checks yahan dikhenge.</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div style={{ display: 'grid', gap: 12 }}>
          <SkeletonCard lines={1} />
          <SkeletonCard lines={1} />
          <SkeletonCard lines={1} />
        </div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🗂️</div>
          <p>Abhi tak koi resume check nahi kiya gaya.</p>
        </div>
      ) : (
        <div className="history-list">
          {items.map((item) => (
            <Link to={`/resume/history/${item.id}`} className="history-item" key={item.id}>
              <div className="history-left">
                <div className="fname">{item.filename}</div>
                <div className="fdate">{new Date(item.created_at).toLocaleString('en-IN')}</div>
              </div>
              <div className={`history-score score-stamp ${scoreClass(item.score || 0)}`} style={{ transform: 'none', width: 48, height: 48 }}>
                {Math.round(item.score || 0)}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
