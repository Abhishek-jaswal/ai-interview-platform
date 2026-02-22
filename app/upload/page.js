'use client';

import { useState } from 'react';
import { extractTextFromPDF } from '@/lib/parsePdf';
import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function UploadPage() {
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const handleFile = async (file) => {
    if (!file || !file.name.endsWith('.pdf')) return;
    setFileName(file.name);
    setText('');
    setAnalysis('');

    const reader = new FileReader();
    reader.onload = async function () {
      const buffer = new Uint8Array(this.result);
      const extracted = await extractTextFromPDF(buffer);
      setText(extracted);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleUpload = (e) => handleFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setAnalysis('');
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: text }),
      });
      const data = await res.json();
      setAnalysis(data.result);
    } catch (err) {
      setAnalysis('Error: Failed to analyze. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }
        .drop-zone { transition: border-color 0.2s, background 0.2s; }
        .drop-zone:hover { border-color: rgba(245,158,11,0.4) !important; background: rgba(245,158,11,0.04) !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { animation: spin 0.8s linear infinite; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fade-in 0.4s ease forwards; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#0a0a0f', fontFamily: "'Outfit', sans-serif", color: '#f1f0ee', display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)', top: -200, left: -100 }} />
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        </div>

        <Header />

        <main style={{ flex: 1, maxWidth: 800, margin: '0 auto', padding: '48px 24px', position: 'relative', zIndex: 1, width: '100%' }}>

          {/* Page title */}
          <div style={{ marginBottom: 36 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 14px', borderRadius: 20,
              border: '1px solid rgba(245,158,11,0.25)',
              background: 'rgba(245,158,11,0.07)',
              marginBottom: 16,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 6px #f59e0b' }} />
              <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>AI Resume Analyzer</span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 8 }}>
              Upload your resume
            </h1>
            <p style={{ fontSize: '0.88rem', color: 'rgba(241,240,238,0.38)', lineHeight: 1.7 }}>
              Get detailed AI-powered feedback and suggestions to improve your resume for your target role.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Drop zone */}
            <div
              className="drop-zone"
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById('pdf-input').click()}
              style={{
                border: `2px dashed ${dragging ? '#f59e0b' : 'rgba(255,255,255,0.1)'}`,
                background: dragging ? 'rgba(245,158,11,0.05)' : 'rgba(255,255,255,0.025)',
                borderRadius: 18, padding: '40px 24px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s',
              }}
            >
              <input id="pdf-input" type="file" accept=".pdf" onChange={handleUpload} style={{ display: 'none' }} />
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: 'rgba(245,158,11,0.1)',
                border: '1px solid rgba(245,158,11,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px', fontSize: '1.4rem',
              }}>📄</div>
              {fileName ? (
                <>
                  <p style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f59e0b', marginBottom: 4 }}>{fileName}</p>
                  <p style={{ fontSize: '0.78rem', color: 'rgba(241,240,238,0.3)' }}>Click to replace file</p>
                </>
              ) : (
                <>
                  <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'rgba(241,240,238,0.75)', marginBottom: 4 }}>Drop your PDF here</p>
                  <p style={{ fontSize: '0.78rem', color: 'rgba(241,240,238,0.3)' }}>or click to browse · PDF only</p>
                </>
              )}
            </div>

            {/* Extracted text */}
            {text && (
              <div className="fade-in">
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'rgba(241,240,238,0.35)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  Extracted Text
                </label>
                <textarea
                  value={text}
                  rows={7}
                  readOnly
                  style={{
                    width: '100%',
                    background: '#0e0e18', border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 14, padding: '16px',
                    color: 'rgba(241,240,238,0.5)',
                    fontSize: '0.8rem', lineHeight: 1.65,
                    outline: 'none', resize: 'none',
                    fontFamily: "'DM Mono', monospace",
                  }}
                />
              </div>
            )}

            {/* Analyze button */}
            <button
              onClick={handleAnalyze}
              disabled={loading || !text}
              style={{
                width: '100%', padding: '14px',
                borderRadius: 14, border: 'none',
                background: text && !loading
                  ? 'linear-gradient(135deg, #f59e0b, #ef4444)'
                  : 'rgba(255,255,255,0.06)',
                color: text && !loading ? 'white' : 'rgba(241,240,238,0.25)',
                fontSize: '0.95rem', fontWeight: 700,
                cursor: text && !loading ? 'pointer' : 'not-allowed',
                boxShadow: text && !loading ? '0 6px 24px rgba(245,158,11,0.3)' : 'none',
                transition: 'all 0.2s',
                fontFamily: "'Outfit', sans-serif",
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                letterSpacing: '-0.01em',
              }}
            >
              {loading ? (
                <>
                  <svg className="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12a9 9 0 11-6.219-8.56" />
                  </svg>
                  Analyzing your resume...
                </>
              ) : (
                '✨ Analyze with AI'
              )}
            </button>

            {/* Analysis result */}
            {analysis && (
              <div className="fade-in" style={{
                background: '#0e0e18',
                border: '1px solid rgba(245,158,11,0.2)',
                borderRadius: 18, padding: '24px',
                boxShadow: '0 8px 40px rgba(245,158,11,0.06)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: 'rgba(245,158,11,0.12)',
                    border: '1px solid rgba(245,158,11,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem',
                  }}>🧠</div>
                  <div>
                    <p style={{ fontWeight: 800, fontSize: '0.95rem', color: '#f1f0ee' }}>AI Analysis</p>
                    <p style={{ fontSize: '0.72rem', color: 'rgba(241,240,238,0.3)' }}>Powered by GPT-3.5</p>
                  </div>
                </div>
                <pre style={{
                  whiteSpace: 'pre-wrap',
                  fontSize: '0.85rem',
                  color: 'rgba(241,240,238,0.72)',
                  lineHeight: 1.8,
                  fontFamily: "'Outfit', sans-serif",
                  margin: 0,
                }}>
                  {analysis}
                </pre>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
