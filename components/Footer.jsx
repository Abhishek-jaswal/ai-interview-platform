'use client';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '24px',
      fontFamily: "'Outfit', sans-serif",
      background: 'rgba(10,10,15,0.6)',
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        display: 'flex', flexWrap: 'wrap',
        alignItems: 'center', justifyContent: 'space-between',
        gap: 12,
      }}>
        <span style={{ fontSize: '0.78rem', color: 'rgba(241,240,238,0.25)' }}>
          © 2025 PrepAI · Built by Abhishek
        </span>
        <div style={{ display: 'flex', gap: 20 }}>
          {[
            { label: 'GitHub', href: 'https://github.com/Abhishek-jaswal' },
            { label: 'LinkedIn', href: 'https://www.linkedin.com/in/abhishekjaswall' },
            { label: 'Portfolio', href: 'https://abhishek-jaswal.vercel.app/' },
            { label: 'Privacy', href: '/privacy-policy' },
          ].map(link => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              style={{
                fontSize: '0.78rem',
                color: 'rgba(241,240,238,0.3)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#f59e0b'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(241,240,238,0.3)'}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
