'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Dashboard() {
  const { data: session } = useSession();

  const cards = [
    {
      href: '/upload',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" y1="18" x2="12" y2="12" />
          <line x1="9" y1="15" x2="15" y2="15" />
        </svg>
      ),
      color: '#f59e0b',
      glow: 'rgba(245,158,11,0.15)',
      tag: 'AI-Powered',
      title: 'Resume Analyzer',
      desc: 'Upload your resume and get detailed AI feedback on how to improve it for your target role.',
      cta: 'Analyze Resume →',
    },
    {
      href: '/interview',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      ),
      color: '#06b6d4',
      glow: 'rgba(6,182,212,0.15)',
      tag: 'Interactive',
      title: 'Mock Interview',
      desc: 'Practice with a strict AI interviewer across Frontend, Backend, DSA, System Design, and HR rounds.',
      cta: 'Start Interview →',
    },
  ];

  const stats = [
    { label: 'Topics Available', value: '5' },
    { label: 'Questions per Round', value: '5' },
    { label: 'Max Score', value: '25' },
    { label: 'AI Model', value: 'GPT-3.5' },
  ];

  return (
    <ProtectedRoute>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        .card-hover { transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease; }
        .card-hover:hover { transform: translateY(-4px); }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#0a0a0f', fontFamily: "'Outfit', sans-serif", color: '#f1f0ee', display: 'flex', flexDirection: 'column' }}>
        {/* Ambient */}
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)', top: -200, right: -100 }} />
          <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.05) 0%, transparent 70%)', bottom: -100, left: -100 }} />
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        </div>

        <Header />

        <main style={{ flex: 1, maxWidth: 1000, margin: '0 auto', padding: '60px 24px', position: 'relative', zIndex: 1, width: '100%' }}>

          {/* Hero */}
          <div style={{ marginBottom: 60, textAlign: 'center' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 14px', borderRadius: 20,
              border: '1px solid rgba(245,158,11,0.25)',
              background: 'rgba(245,158,11,0.07)',
              marginBottom: 20,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 6px #f59e0b' }} />
              <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Ready to practice
              </span>
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, letterSpacing: '-0.04em', color: '#f1f0ee', marginBottom: 12 }}>
              Hello, {session?.user?.name?.split(' ')[0] || 'there'} 👋
            </h1>
            <p style={{ fontSize: '1rem', color: 'rgba(241,240,238,0.4)', maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>
              Your AI-powered interview preparation hub. Pick a tool below to get started.
            </p>
          </div>

          {/* Stats bar */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1,
            background: 'rgba(255,255,255,0.05)',
            borderRadius: 16, overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.06)',
            marginBottom: 40,
          }}>
            {stats.map((s, i) => (
              <div key={i} style={{
                padding: '16px 20px', textAlign: 'center',
                background: '#0e0e18',
                borderRight: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b', letterSpacing: '-0.02em' }}>{s.value}</div>
                <div style={{ fontSize: '0.73rem', color: 'rgba(241,240,238,0.35)', marginTop: 2, fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
            {cards.map((card, i) => (
              <Link key={i} href={card.href} style={{ textDecoration: 'none' }}>
                <div
                  className="card-hover"
                  style={{
                    background: '#0e0e18',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 20, padding: '28px',
                    cursor: 'pointer', height: '100%',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = card.color + '55';
                    e.currentTarget.style.boxShadow = `0 16px 48px ${card.glow}`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Icon */}
                  <div style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: card.glow,
                    border: `1px solid ${card.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: card.color, marginBottom: 20,
                  }}>
                    {card.icon}
                  </div>

                  {/* Tag */}
                  <span style={{
                    display: 'inline-block',
                    fontSize: '0.68rem', fontWeight: 700,
                    padding: '3px 9px', borderRadius: 20,
                    background: card.glow, color: card.color,
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    marginBottom: 12,
                  }}>
                    {card.tag}
                  </span>

                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#f1f0ee', marginBottom: 10 }}>
                    {card.title}
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(241,240,238,0.4)', lineHeight: 1.7, marginBottom: 24 }}>
                    {card.desc}
                  </p>

                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    fontSize: '0.85rem', fontWeight: 700, color: card.color,
                  }}>
                    {card.cta}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
