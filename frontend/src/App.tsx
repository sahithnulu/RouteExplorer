import { Routes, Route, Navigate } from 'react-router-dom'
import MapView from './components/MapView'
import Login from './pages/Login'
import Register from './pages/Register'
import React from 'react'

const isAuthenticated = () => {
  const token = localStorage.getItem('accessToken')
  const refreshToken = localStorage.getItem('refreshToken')
  return !!(token || refreshToken)
}

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />
}

const AuthRoute = ({ children }: { children: React.ReactElement }) => {
  return isAuthenticated() ? <Navigate to="/" /> : children
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><MapView /></ProtectedRoute>} />
      <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
      <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App