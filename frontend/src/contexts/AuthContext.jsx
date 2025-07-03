"use client"

import { createContext, useContext, useState, useEffect } from "react"
import apiService from "../services/api.js"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth token
    const token = localStorage.getItem("auth-token")
    const userData = localStorage.getItem("user-data")

    if (token && userData) {
      setUser(JSON.parse(userData))
    }

    setLoading(false)
  }, [])

  const login = async (email, password, role) => {
    setLoading(true)
    try {
      const response = await apiService.post('/auth/login', { email, password, role })
      if (response.token) {
        setUser(response.user)
        apiService.setAuthToken(response.token)
        localStorage.setItem("user-data", JSON.stringify(response.user))
        return { success: true }
      }
      return { success: false, message: response.message || "Login failed" }
    } catch (error) {
      // Show backend error message if available
      return { success: false, message: error.message || "Login failed" }
    } finally {
      setLoading(false)
    }
  }

  const register = async (name, email, password) => {
    setLoading(true)
    try {
      const response = await apiService.post('/auth/register', { name, email, password })
      
      if (response.token) {
        setUser(response.user)
        apiService.setAuthToken(response.token)
        localStorage.setItem("user-data", JSON.stringify(response.user))
        return true
      }
      return false
    } catch (error) {
      console.error("Register error:", error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    apiService.removeAuthToken()
    localStorage.removeItem("user-data")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
