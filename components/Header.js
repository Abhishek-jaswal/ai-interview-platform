'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (!session) return null;

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/upload', label: 'Resume' },
    { href: '/interview', label: 'Interview' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        .nav-link { position: relative; transition: color 0.2s; }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0;
          width: 0; height: 1.5px;
          background: #f59e0b;
          transition: width 0.25s ease;
        }
        .nav-link:hover::after, .nav-link.active::after { width: 100%; }
        .logout-btn:hover { background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.4); color: #f87171; }
      `}</style>
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(10,10,15,0.92)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        fontFamily: "'Outfit', sans-serif",
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          padding: '0 24px',
          height: 60,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(245,158,11,0.3)',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4l3 3" />
              </svg>
            </div>
            <span style={{ fontWeight: 800, fontSize: '1rem', color: '#f1f0ee', letterSpacing: '-0.02em' }}>
              PrepAI
            </span>
          </Link>

          {/* Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${pathname === link.href ? 'active' : ''}`}
                style={{
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  color: pathname === link.href ? '#f59e0b' : 'rgba(241,240,238,0.5)',
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '5px 12px 5px 5px',
              borderRadius: 20,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: '50%',
                background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.7rem', fontWeight: 700, color: 'white',
              }}>
                {(session?.user?.name || session?.user?.email || 'U')[0].toUpperCase()}
              </div>
              <span style={{ fontSize: '0.8rem', color: 'rgba(241,240,238,0.6)', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {session?.user?.name || session?.user?.email}
              </span>
            </div>

            <button
              className="logout-btn"
              onClick={() => signOut({ callbackUrl: '/login' })}
              style={{
                padding: '7px 14px', borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'transparent',
                color: 'rgba(241,240,238,0.45)',
                fontSize: '0.8rem', fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
