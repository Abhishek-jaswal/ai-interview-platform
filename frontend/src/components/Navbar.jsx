import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  function go(path) {
    setOpen(false)
    navigate(path)
  }

  const isActive = (path, exact = false) =>
    exact ? location.pathname === path : location.pathname.startsWith(path)

  return (
    <div className="navbar">
      <Link to="/" className="brand" onClick={() => setOpen(false)}>
        Career<span className="mark">Prep</span>
      </Link>

      {user && (
        <>
          <button className="nav-toggle" onClick={() => setOpen((v) => !v)} aria-label="Menu">
            <span style={open ? { transform: 'translateY(7px) rotate(45deg)' } : undefined} />
            <span style={open ? { opacity: 0 } : undefined} />
            <span style={open ? { transform: 'translateY(-7px) rotate(-45deg)' } : undefined} />
          </button>

          <div className={`nav-links ${open ? 'open' : ''}`}>
            <a className={isActive('/', true) ? 'active' : ''} onClick={() => go('/')}>Dashboard</a>
            <a className={isActive('/resume') ? 'active' : ''} onClick={() => go('/resume')}>Resume</a>
            <a className={isActive('/ai-interview') ? 'active' : ''} onClick={() => go('/ai-interview')}>Interview</a>
            <a onClick={() => go('/resume/history')}>History</a>
            <span className="nav-user">{user.name}</span>
            <button className="btn secondary" onClick={handleLogout}>Logout</button>
          </div>
        </>
      )}
    </div>
  )
}
