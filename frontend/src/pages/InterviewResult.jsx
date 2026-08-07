import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function scoreClass(score) {
  if (score >= 80) return 'good'
  if (score >= 60) return 'mid'
  return 'low'
}

export default function InterviewResult() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const result = state?.result

  if (!result) {
    navigate('/ai-interview')
    return null
  }

  const { examName, overallScore, correct, wrong, unattempted, totalQuestions, subjectBreakdown, aiFeedback } = result

  return (
    <div className="page fade-in">
      <div className="page-head">
        <div className="eyebrow">Result</div>
        <h1>{examName}</h1>
        <p>{correct} correct · {wrong} wrong · {unattempted} unattempted (out of {totalQuestions})</p>
      </div>

      <div className="score-band">
        <div className={`score-stamp ${scoreClass(overallScore)}`}>
          <span className="num">{overallScore}</span>
          <span className="of">%</span>
        </div>
        <div className="score-summary">
          <h3>Overall Score</h3>
          <p>{aiFeedback?.expectedImprovement || 'Aapka performance neeche subject-wise dikhaya gaya hai.'}</p>
        </div>
      </div>

      <div className="section-title">Subject-wise Breakdown</div>
      <div className="subject-grid">
        {Object.entries(subjectBreakdown || {}).map(([subject, s]) => {
          const pct = s.total ? Math.round((s.correct / s.total) * 100) : 0
          return (
            <div className="subject-stat" key={subject}>
              <div className="subject-name">{subject}</div>
              <div className="subject-score">{pct}%</div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${pct}%` }} />
              </div>
            </div>
          )
        })}
      </div>

      {aiFeedback && (
        <>
          <div className="section-title">AI Feedback</div>

          {aiFeedback.weakAreas?.length > 0 && (
            <div className="feedback-block">
              <h4>Weak Areas</h4>
              <ul>{aiFeedback.weakAreas.map((w, i) => <li key={i}>{w}</li>)}</ul>
            </div>
          )}

          {aiFeedback.studyPlan?.length > 0 && (
            <div className="feedback-block">
              <h4>Study Plan</h4>
              <ul>{aiFeedback.studyPlan.map((w, i) => <li key={i}>{w}</li>)}</ul>
            </div>
          )}

          {aiFeedback.dailySchedule?.length > 0 && (
            <div className="feedback-block">
              <h4>Daily Schedule</h4>
              <ul>{aiFeedback.dailySchedule.map((w, i) => <li key={i}>{w}</li>)}</ul>
            </div>
          )}

          {aiFeedback.suggestedBooks?.length > 0 && (
            <div className="feedback-block">
              <h4>Suggested Books</h4>
              <ul>{aiFeedback.suggestedBooks.map((w, i) => <li key={i}>{w}</li>)}</ul>
            </div>
          )}
        </>
      )}

      <div className="actions-row" style={{ marginTop: 24, justifyContent: 'flex-start' }}>
        <button className="btn" onClick={() => navigate('/ai-interview')}>Naya exam dein</button>
        <button className="btn secondary" onClick={() => navigate('/')}>Dashboard par jayein</button>
      </div>
    </div>
  )
}
