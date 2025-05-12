import React from 'react'
import { Navigate } from 'react-router-dom'

function AdminProtectedRoute({ children }) {
  const token = localStorage.getItem('adminToken')

  if (!token) {
    return <Navigate to="/admin/signin" />
  }

  return children
}

export default AdminProtectedRoute