"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext.jsx"

function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login")
        return
      }

      if (requiredRole && user.role !== requiredRole) {
        // Redirect based on user role
        if (user.role === "Admin") {
          navigate("/admin/dashboard")
        } else if (user.role === "Instructor") {
          navigate("/instructor/dashboard")
        } else {
          navigate("/user/dashboard")
        }
        return
      }
    }
  }, [user, loading, requiredRole, navigate])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (requiredRole && user.role !== requiredRole) {
    return null
  }

  return <>{children}</>
}

export default ProtectedRoute
