import { useState, useEffect } from 'react'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('uconnect_token') !== null
  })
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('uconnect_user')
    return stored ? JSON.parse(stored) : null
  })

  const login = (token, userData) => {
    localStorage.setItem('uconnect_token', token)
    localStorage.setItem('uconnect_user', JSON.stringify(userData))
    setIsAuthenticated(true)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('uconnect_token')
    localStorage.removeItem('uconnect_user')
    setIsAuthenticated(false)
    setUser(null)
  }

  return {
    isAuthenticated,
    user,
    login,
    logout,
  }
}



