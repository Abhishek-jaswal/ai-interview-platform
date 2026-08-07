import React, { useState, useRef } from 'react'
import { checkResume } from '../api'
import ResultView from '../components/ResultView'
import { SkeletonCard } from '../components/Skeleton'

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const inputRef = useRef(null)

  function pickFile(f) {
    if (!f) return
    if (f.type !== 'application/pdf') {
      setError('Sirf PDF files allowed hain.')
      return
    }
    setError('')
    setFile(f)
    setResult(null)
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragActive(false)
    pickFile(e.dataTransfer.files?.[0])
  }

  async function handleAnalyze() {
    if (!file) return
    setLoading(true)
    setError('')
    try {
      const data = await checkResume(file)
      setResult(JSON.parse(data.result_json))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setFile(null)
    setResult(null)
    setError('')
  }

  return (
    <div className="page">
      <div className="page-head">
        <div className="eyebrow">AI Resume Review</div>
        <h1>Apna resume check karein</h1>
        <p>PDF upload karein — grammar, formatting, content aur ATS keywords ka detailed analysis milega.</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {!result && (
        <div
          className={`dropzone ${dragActive ? 'active' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
        >
          <div className="icon">📄</div>
          {file ? (
            <div className="filename">{file.name}</div>
          ) : (
            <p>Apna resume PDF yahan drag-drop karein, ya file chunein</p>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden-input"
            onChange={(e) => pickFile(e.target.files?.[0])}
          />
          <div className="actions-row">
            <button className="btn secondary" onClick={() => inputRef.current?.click()}>
              {file ? 'File badlein' : 'File chunein'}
            </button>
            {file && (
              <button className="btn" onClick={handleAnalyze} disabled={loading}>
                {loading ? 'Analyze ho raha hai...' : 'Check karein'}
              </button>
            )}
          </div>
        </div>
      )}

      {loading && (
        <div style={{ marginTop: 32 }}>
          <SkeletonCard lines={2} />
          <div style={{ height: 14 }} />
          <SkeletonCard lines={3} />
          <div style={{ height: 14 }} />
          <SkeletonCard lines={2} />
        </div>
      )}

      {result && (
        <div className="fade-in">
          <ResultView result={result} />
          <div className="actions-row" style={{ marginTop: 24 }}>
            <button className="btn secondary" onClick={reset}>Naya resume check karein</button>
          </div>
        </div>
      )}
    </div>
  )
}
