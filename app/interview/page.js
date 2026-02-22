'use client';

import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useState, useRef, useEffect } from 'react';

const TOPICS = [
  { label: 'Frontend', icon: '🖥️' },
  { label: 'Backend', icon: '⚙️' },
  { label: 'DSA', icon: '🧮' },
  { label: 'System Design', icon: '🏗️' },
  { label: 'HR', icon: '🤝' },
];

export default function InterviewPage() {
  const [topic, setTopic] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [interviewEnded, setInterviewEnded] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const startInterview = () => {
    if (!topic) return;
    setMessages([{
      role: 'assistant',
      content: `🚀 Let's begin your **${topic}** interview. I'll ask you 5 questions and score each one out of 5. Ready for your first question?`,
    }]);
    setStarted(true);
    setQuestionCount(1);
  };

  const handleSend = async () => {
    if (!input.trim() || interviewEnded || loading) return;

    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages, topic }),
      });
      const data = await res.json();
      const assistantMessage = { role: 'assistant', content: data.result };
      const newMessages = [...updatedMessages, assistantMessage];
      setMessages(newMessages);

      const scoreMatch = data.result.match(/⭐\sScore:\s(\d)\/5/);
      const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;
      setTotalScore(prev => prev + score);

      if (questionCount >= 5) {
        setMessages([...newMessages, {
          role: 'system',
          content: `Interview complete! Final score: ${totalScore + score}/25`,
        }]);
        setInterviewEnded(true);
      } else {
        setQuestionCount(prev => prev + 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const restart = () => {
    setTopic(''); setMessages([]); setInput(''); setStarted(false);
    setQuestionCount(0); setInterviewEnded(false); setTotalScore(0);
  };

  const scoreColor = (s) => {
    if (s >= 20) return '#10b981';
    if (s >= 12) return '#f59e0b';
    return '#f43f5e';
  };

  return (
    <ProtectedRoute>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }
        .send-btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
        .send-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        @keyframes blink { 0%,100% { opacity: 0.3; } 50% { opacity: 1; } }
        .dot { animation: blink 1.2s ease-in-out infinite; }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#0a0a0f', fontFamily: "'Outfit', sans-serif", color: '#f1f0ee', display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)', top: -150, right: -100 }} />
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        </div>

        <Header />

        <main style={{ flex: 1, maxWidth: 860, margin: '0 auto', padding: '40px 24px', position: 'relative', zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column' }}>

          {!started ? (
            /* Topic Selection */
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingTop: 20 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '6px 14px', borderRadius: 20,
                border: '1px solid rgba(6,182,212,0.25)',
                background: 'rgba(6,182,212,0.07)',
                marginBottom: 24,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#06b6d4', boxShadow: '0 0 6px #06b6d4' }} />
                <span style={{ fontSize: '0.75rem', color: '#06b6d4', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  5 Questions · Scored /25
                </span>
              </div>

              <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 12 }}>
                🎤 Mock Interview
              </h1>
              <p style={{ fontSize: '0.9rem', color: 'rgba(241,240,238,0.4)', marginBottom: 40, lineHeight: 1.7 }}>
                Choose a topic and face a strict AI interviewer. Each answer is scored in real-time.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 36 }}>
                {TOPICS.map(t => (
                  <button
                    key={t.label}
                    onClick={() => setTopic(t.label)}
                    style={{
                      padding: '12px 22px', borderRadius: 14,
                      border: `1.5px solid ${topic === t.label ? '#06b6d4' : 'rgba(255,255,255,0.08)'}`,
                      background: topic === t.label ? 'rgba(6,182,212,0.12)' : 'rgba(255,255,255,0.03)',
                      color: topic === t.label ? '#06b6d4' : 'rgba(241,240,238,0.55)',
                      fontSize: '0.88rem', fontWeight: 600,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                      transition: 'all 0.2s',
                      fontFamily: "'Outfit', sans-serif",
                    }}
                  >
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>

              <button
                onClick={startInterview}
                disabled={!topic}
                style={{
                  padding: '14px 36px', borderRadius: 14, border: 'none',
                  background: topic ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' : 'rgba(255,255,255,0.06)',
                  color: topic ? 'white' : 'rgba(241,240,238,0.25)',
                  fontSize: '0.95rem', fontWeight: 700,
                  cursor: topic ? 'pointer' : 'not-allowed',
                  boxShadow: topic ? '0 6px 24px rgba(6,182,212,0.3)' : 'none',
                  transition: 'all 0.2s',
                  fontFamily: "'Outfit', sans-serif",
                  letterSpacing: '-0.01em',
                }}
              >
                🚀 Start {topic ? `${topic} ` : ''}Interview
              </button>
            </div>

          ) : (
            /* Chat UI */
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 16 }}>
              {/* Header bar */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 20px', borderRadius: 14,
                background: '#0e0e18',
                border: '1px solid rgba(255,255,255,0.07)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: interviewEnded ? '#10b981' : '#06b6d4', boxShadow: interviewEnded ? '0 0 6px #10b981' : '0 0 6px #06b6d4' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f1f0ee' }}>
                    {topic} Interview
                  </span>
                  {!interviewEnded && (
                    <span style={{ fontSize: '0.75rem', color: 'rgba(241,240,238,0.35)', fontFamily: "'DM Mono', monospace" }}>
                      Q{questionCount}/5
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(241,240,238,0.3)', marginBottom: 1 }}>Score</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: scoreColor(totalScore), fontFamily: "'DM Mono', monospace" }}>
                      {totalScore}/25
                    </div>
                  </div>
                  <button
                    onClick={restart}
                    style={{
                      padding: '6px 14px', borderRadius: 8,
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'transparent', color: 'rgba(241,240,238,0.4)',
                      fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                      fontFamily: "'Outfit', sans-serif",
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#f59e0b'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(241,240,238,0.4)'}
                  >
                    Restart
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div style={{
                flex: 1, minHeight: 400, maxHeight: 520,
                overflowY: 'auto',
                padding: '20px',
                background: '#0e0e18',
                borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', flexDirection: 'column', gap: 14,
              }}>
                {messages.map((msg, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                    {msg.role === 'assistant' && (
                      <div style={{
                        width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                        background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.75rem', marginRight: 10, marginTop: 2,
                      }}>🤖</div>
                    )}
                    <div style={{
                      maxWidth: '72%',
                      padding: '11px 15px',
                      borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                      background: msg.role === 'user'
                        ? 'linear-gradient(135deg, #06b6d4, #3b82f6)'
                        : msg.role === 'system' ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.05)',
                      border: msg.role === 'system' ? '1px solid rgba(16,185,129,0.25)' : '1px solid rgba(255,255,255,0.06)',
                      fontSize: '0.86rem',
                      color: msg.role === 'user' ? 'white' : msg.role === 'system' ? '#10b981' : 'rgba(241,240,238,0.85)',
                      lineHeight: 1.65,
                      whiteSpace: 'pre-wrap',
                    }}>
                      {msg.content}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>🤖</div>
                    <div style={{ padding: '11px 16px', borderRadius: '14px 14px 14px 4px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 5, alignItems: 'center' }}>
                      {[0, 1, 2].map(i => (
                        <div key={i} className="dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#06b6d4' }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              {!interviewEnded ? (
                <div style={{ display: 'flex', gap: 10 }}>
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    placeholder="Type your answer..."
                    disabled={loading}
                    style={{
                      flex: 1, padding: '13px 18px',
                      borderRadius: 14,
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'rgba(255,255,255,0.04)',
                      color: '#f1f0ee', fontSize: '0.88rem',
                      outline: 'none', fontFamily: "'Outfit', sans-serif",
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={e => e.target.style.borderColor = 'rgba(6,182,212,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  />
                  <button
                    className="send-btn"
                    onClick={handleSend}
                    disabled={!input.trim() || loading}
                    style={{
                      padding: '13px 24px', borderRadius: 14, border: 'none',
                      background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                      color: 'white', fontSize: '0.88rem', fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontFamily: "'Outfit', sans-serif",
                      boxShadow: '0 4px 14px rgba(6,182,212,0.3)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Send →
                  </button>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '24px', background: '#0e0e18', borderRadius: 16, border: '1px solid rgba(16,185,129,0.2)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 8 }}>🎉</div>
                  <p style={{ fontWeight: 800, fontSize: '1.1rem', color: '#10b981', marginBottom: 4 }}>Interview Complete!</p>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(241,240,238,0.4)', marginBottom: 20 }}>
                    Final Score: <span style={{ color: scoreColor(totalScore), fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>{totalScore}/25</span>
                  </p>
                  <button
                    onClick={restart}
                    style={{
                      padding: '11px 28px', borderRadius: 12, border: 'none',
                      background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                      color: 'white', fontSize: '0.88rem', fontWeight: 700,
                      cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
                    }}
                  >
                    🔁 Try Again
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
