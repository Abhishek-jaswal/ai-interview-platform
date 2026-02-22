'use client';

import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (session) {
    router.push('/dashboard');
    return null;
  }

  const handleLogin = () => {
    setError('');
    if (email === 'admin' && password === 'admin123') {
      router.push('/dashboard');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.09)',
    background: 'rgba(255,255,255,0.04)',
    color: '#f1f0ee',
    fontSize: '0.88rem',
    outline: 'none',
    fontFamily: "'Outfit', sans-serif",
    transition: 'border-color 0.2s',
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0f; }
        .input-field:focus { border-color: rgba(245,158,11,0.5) !important; background: rgba(245,158,11,0.04) !important; }
        .social-btn:hover { background: rgba(255,255,255,0.08) !important; border-color: rgba(255,255,255,0.15) !important; }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: '#0a0a0f',
        fontFamily: "'Outfit', sans-serif",
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Ambient glows */}
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute', width: 700, height: 700, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)',
            top: -300, right: -200,
            animation: 'pulse-glow 4s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute', width: 500, height: 500, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)',
            bottom: -200, left: -100,
            animation: 'pulse-glow 6s ease-in-out infinite 2s',
          }} />
          {/* Grid pattern */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }} />
        </div>

        {/* Left panel - branding */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          justifyContent: 'center', padding: '60px',
          position: 'relative', zIndex: 1,
        }} className="hidden md:flex">
          <div style={{ marginBottom: 48 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '8px 16px',
              borderRadius: 20,
              border: '1px solid rgba(245,158,11,0.25)',
              background: 'rgba(245,158,11,0.08)',
              marginBottom: 32,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 6px #f59e0b' }} />
              <span style={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                AI-Powered Platform
              </span>
            </div>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: '-0.04em',
              color: '#f1f0ee',
              marginBottom: 20,
            }}>
              Ace your next<br />
              <span style={{ color: '#f59e0b' }}>interview</span> with AI.
            </h1>
            <p style={{ fontSize: '1rem', color: 'rgba(241,240,238,0.45)', lineHeight: 1.7, maxWidth: 400 }}>
              Upload your resume, get instant AI feedback, and practice with a real-time mock interviewer tailored to your role.
            </p>
          </div>

          {/* Feature pills */}
          {[
            { icon: '📄', text: 'AI Resume Analysis' },
            { icon: '🎤', text: 'Mock Interview Simulator' },
            { icon: '⭐', text: 'Real-time Scoring & Feedback' },
          ].map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 16px', borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(255,255,255,0.025)',
              marginBottom: 10, maxWidth: 320,
              animation: `float ${3 + i * 0.5}s ease-in-out infinite ${i * 0.3}s`,
            }}>
              <span style={{ fontSize: '1.1rem' }}>{f.icon}</span>
              <span style={{ fontSize: '0.85rem', color: 'rgba(241,240,238,0.65)', fontWeight: 500 }}>{f.text}</span>
            </div>
          ))}
        </div>

        {/* Right panel - login form */}
        <div style={{
          width: '100%', maxWidth: 440,
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', padding: '40px 40px',
          borderLeft: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(16,16,24,0.7)',
          backdropFilter: 'blur(20px)',
          position: 'relative', zIndex: 1,
        }}>
          {/* Logo */}
          <div style={{ marginBottom: 36 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(245,158,11,0.35)',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4l3 3" />
                </svg>
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#f1f0ee', letterSpacing: '-0.02em' }}>PrepAI</span>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f1f0ee', letterSpacing: '-0.03em', marginBottom: 4 }}>
              Welcome back
            </h2>
            <p style={{ fontSize: '0.83rem', color: 'rgba(241,240,238,0.35)' }}>Sign in to continue your prep journey</p>
          </div>

          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'rgba(241,240,238,0.4)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Email
              </label>
              <input
                type="text"
                placeholder="hello@yoursite.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-field"
                style={inputStyle}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'rgba(241,240,238,0.4)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-field"
                style={inputStyle}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
            </div>

            {error && (
              <p style={{ fontSize: '0.8rem', color: '#f87171', background: 'rgba(239,68,68,0.08)', padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)' }}>
                {error}
              </p>
            )}

            <button
              onClick={handleLogin}
              style={{
                width: '100%', padding: '12px',
                borderRadius: 12, border: 'none',
                background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                color: 'white', fontSize: '0.9rem', fontWeight: 700,
                cursor: 'pointer', letterSpacing: '-0.01em',
                boxShadow: '0 6px 20px rgba(245,158,11,0.35)',
                transition: 'opacity 0.2s, transform 0.15s',
                fontFamily: "'Outfit', sans-serif",
                marginTop: 4,
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Sign In
            </button>
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            <span style={{ fontSize: '0.75rem', color: 'rgba(241,240,238,0.25)' }}>or continue with</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
          </div>

          {/* Social */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { provider: 'github', label: 'GitHub', icon: '/screenshots/github.png' },
              { provider: 'google', label: 'Google', icon: '/screenshots/google.jpg' },
            ].map(s => (
              <button
                key={s.provider}
                className="social-btn"
                onClick={() => signIn(s.provider)}
                style={{
                  width: '100%', padding: '11px 16px',
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.04)',
                  color: 'rgba(241,240,238,0.75)',
                  fontSize: '0.86rem', fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  transition: 'all 0.2s',
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                <Image src={s.icon} alt={s.label} width={18} height={18} style={{ borderRadius: 3 }} />
                Continue with {s.label}
              </button>
            ))}
          </div>

          <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'rgba(241,240,238,0.25)', marginTop: 28 }}>
            New here?{' '}
            <Link href="/dashboard" style={{ color: '#f59e0b', textDecoration: 'none', fontWeight: 600 }}>
              Create an account →
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
