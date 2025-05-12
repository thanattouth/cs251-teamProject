import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

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
        <div>
          <Link to="/admin/dashboard" className="text-lg font-bold hover:text-gray-300">
            Admin Dashboard
          </Link>
        </div>
        {isSignedIn && (
          <div className="flex space-x-4">
            <Link to="/admin/dashboard" className="hover:text-gray-300">
              Dashboard
            </Link>
            <Link to="/admin/tenant" className="hover:text-gray-300">
              Tenant
            </Link>
            <Link to="/admin/employee" className="hover:text-gray-300">
              Employee
            </Link>
            <Link to="/admin/dormitory" className="hover:text-gray-300">
              Dormitory
            </Link>
            <Link to="/admin/booking" className="hover:text-gray-300">
              Booking
            </Link>
            <Link to="/admin/lease" className="hover:text-gray-300">
              Lease
            </Link>
            <button onClick={handleLogout} className="hover:text-gray-300">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default AdminNavbar