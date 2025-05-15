import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AdminNavbar = () => {
  const navigate = useNavigate()
  const [isSignedIn, setIsSignedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      setIsSignedIn(false)
      navigate('/admin/signin')
    } else {
      setIsSignedIn(true)
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setIsSignedIn(false)
    navigate('/admin/signin')
  }

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* ซ้าย: ปุ่มกลับ dashboard */}
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="text-lg font-bold hover:text-gray-300"
        >
          Admin Dashboard
        </button>

        {/* ขวา: Logout */}
        {isSignedIn && (
          <button onClick={handleLogout} className="hover:text-gray-300">
            Logout
          </button>
        )}
      </div>
    </nav>
  )
}

export default AdminNavbar