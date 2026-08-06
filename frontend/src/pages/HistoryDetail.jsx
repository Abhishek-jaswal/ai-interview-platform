import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getCheckDetail, deleteCheck } from '../api'
import ResultView from '../components/ResultView'

export default function HistoryDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [check, setCheck] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCheckDetail(id)
      .then(setCheck)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  async function handleDelete() {
    if (!confirm('Ye record delete karna chahte hain?')) return
    try {
      await deleteCheck(id)
      navigate('/resume/history')
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <div className="page">
        <div className="loading-wrap">
          <div className="spinner" />
          Load ho raha hai...
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page-head">
        <Link to="/resume/history" style={{ fontSize: 13, color: 'var(--ink-soft)' }}>&larr; History par wapas jayein</Link>
        <h1 style={{ marginTop: 12 }}>{check?.filename}</h1>
        <p>{check && new Date(check.created_at).toLocaleString('en-IN')}</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {check && <ResultView result={JSON.parse(check.result_json)} />}

      <div className="actions-row" style={{ marginTop: 24, justifyContent: 'flex-start' }}>
        <button className="btn danger" onClick={handleDelete}>Delete karein</button>
      </div>
    </div>
  )
}
