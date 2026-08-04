import React from 'react'

function scoreClass(score) {
  if (score >= 80) return 'good'
  if (score >= 60) return 'mid'
  return 'low'
}

export default function ResultView({ result }) {
  if (!result) return null

  const {
    overall_score = 0,
    summary = '',
    strengths = [],
    issues = [],
    missing_sections = [],
    ats_keywords_suggestion = [],
  } = result

  return (
    <div className="result-wrap">
      <div className="score-band">
        <div className={`score-stamp ${scoreClass(overall_score)}`}>
          <span className="num">{Math.round(overall_score)}</span>
          <span className="of">/ 100</span>
        </div>
        <div className="score-summary">
          <h3>Overall Assessment</h3>
          <p>{summary}</p>
        </div>
      </div>

      {strengths.length > 0 && (
        <>
          <div className="section-title">
            Strengths <span className="count">{strengths.length}</span>
          </div>
          <ul className="strength-list">
            {strengths.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </>
      )}

      {issues.length > 0 && (
        <>
          <div className="section-title">
            Corrections <span className="count">{issues.length}</span>
          </div>
          {issues.map((issue, i) => (
            <div key={i} className={`issue-card ${issue.severity || 'medium'}`}>
              <div className="issue-top">
                <span className="tag">{issue.category}</span>
                <span className={`tag sev-${issue.severity}`}>{issue.severity} priority</span>
              </div>
              {issue.original && <div className="issue-original">{issue.original}</div>}
              <p className="issue-problem">{issue.problem}</p>
              <p className="issue-suggestion">{issue.suggestion}</p>
            </div>
          ))}
        </>
      )}

      {missing_sections.length > 0 && (
        <>
          <div className="section-title">Missing Sections</div>
          <div className="chip-row">
            {missing_sections.map((m, i) => (
              <span className="chip" key={i}>{m}</span>
            ))}
          </div>
        </>
      )}

      {ats_keywords_suggestion.length > 0 && (
        <>
          <div className="section-title">Suggested ATS Keywords</div>
          <div className="chip-row">
            {ats_keywords_suggestion.map((k, i) => (
              <span className="chip" key={i}>{k}</span>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
