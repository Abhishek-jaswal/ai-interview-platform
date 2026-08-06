import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="page">
      <div className="page-head">
        <div className="eyebrow">Dashboard</div>
        <h1>Hello {user?.name?.split(' ')[0]} 👋</h1>
        <p>Aaj kya karna chahoge?</p>
      </div>

      <div className="module-grid">
        <div className="module-card" onClick={() => navigate('/resume')}>
          <div className="module-icon">📄</div>
          <h3>Resume Analyzer</h3>
          <p>Apna resume upload karke ATS score aur corrections check karein.</p>
          <span className="btn">Open</span>
        </div>

        <div className="module-card" onClick={() => navigate('/ai-interview')}>
          <div className="module-icon">🤖</div>
          <h3>AI Interview</h3>
          <p>Government exams (SSC, Army, Police aur aur) ke liye practice test dein.</p>
          <span className="btn">Start</span>
        </div>
      </div>
    </div>
  )
}
