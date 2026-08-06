import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="navbar">
      <Link to="/" className="brand">
        Resume<span className="mark">Mark</span>
      </Link>
      {user && (
        <div className="nav-links">
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/resume">Resume</NavLink>
          <NavLink to="/ai-interview">Interview</NavLink>
          <NavLink to="/resume/history">History</NavLink>
          <span style={{ color: 'var(--ink-faint)' }}>{user.name}</span>
          <button className="btn secondary" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  )
}
