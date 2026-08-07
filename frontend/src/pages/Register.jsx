import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../api'
import { useAuth } from '../AuthContext'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await registerUser(name, email, password)
      login(data)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card fade-in">
        <h1>Account banayein</h1>
        <p className="sub">Apne resumes check karne ke liye sign up karein.</p>
        {error && <div className="error-banner">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Poora naam</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required minLength={2} placeholder="Jaise: Rahul Sharma" />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="aap@example.com" />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="Kam se kam 6 characters" />
          </div>
          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Banaya ja raha hai...' : 'Sign Up'}
          </button>
        </form>
        <div className="switch-link">
          Pehle se account hai? <Link to="/login">Login karein</Link>
        </div>
      </div>
    </div>
  )
}
