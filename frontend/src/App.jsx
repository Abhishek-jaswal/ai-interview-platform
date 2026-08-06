import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './AuthContext'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ResumeAnalyzer from './pages/ResumeAnalyzer'
import History from './pages/History'
import HistoryDetail from './pages/HistoryDetail'
import AIInterview from './pages/AIInterview'
import SelectExam from './pages/SelectExam'
import ExamInstructions from './pages/ExamInstructions'
import Exam from './pages/Exam'
import InterviewResult from './pages/InterviewResult'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) {
    return <div className="loading-wrap"><div className="spinner" />Load ho raha hai...</div>
  }
  if (!user) return <Navigate to="/login" replace />
  return children
}

function AppRoutes() {
  return (
    <div className="app-shell">
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

        <Route path="/resume" element={<ProtectedRoute><ResumeAnalyzer /></ProtectedRoute>} />
        <Route path="/resume/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
        <Route path="/resume/history/:id" element={<ProtectedRoute><HistoryDetail /></ProtectedRoute>} />

        <Route path="/ai-interview" element={<ProtectedRoute><AIInterview /></ProtectedRoute>} />
        <Route path="/ai-interview/exam" element={<ProtectedRoute><Exam /></ProtectedRoute>} />
        <Route path="/ai-interview/result" element={<ProtectedRoute><InterviewResult /></ProtectedRoute>} />
        <Route path="/ai-interview/:categoryId" element={<ProtectedRoute><SelectExam /></ProtectedRoute>} />
        <Route path="/ai-interview/:categoryId/:examId/instructions" element={<ProtectedRoute><ExamInstructions /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

