import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Navbar({ isAuthenticated, setAuth }) {
  const navigate = useNavigate()
  const [userName, setUserName] = useState('')
  const [isDropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      const user = JSON.parse(localStorage.getItem('user'))
      if (user) {
        setUserName(`${user.First_Name} ${user.Last_Name}`)
      }
    }
  }, [isAuthenticated])

  const handleLogout = () => {
    localStorage.clear()
    setAuth(false)
    navigate('/signin')
  }

  const scrollToHomeSection = (sectionId) => {
    if (window.location.pathname !== '/') {
      localStorage.setItem('scrollToSection', sectionId)
      navigate('/')
    } else {
      const section = document.getElementById(sectionId)
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <nav className="bg-[#202020] p-4 shadow-md fixed top-0 left-0 w-full z-50">
      <div className="flex items-center justify-between px-6">
        {/* Left: Logo */}
        <Link to="/" className="text-white text-lg font-bold whitespace-nowrap">
          Dormitory Hub
        </Link>

        {/* Right: Navigation Links + Auth Links */}
        <div className="flex items-center space-x-8">
          {/* Middle Navigation Links */}
          <div className="flex space-x-6 text-sm font-medium">
            {isAuthenticated ? (
              <Link to="/dashboard" className="text-white hover:text-gray-700">
                DASHBOARD
              </Link>
            ) : (
              <a
                href="#home"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToHomeSection('home')
                }}
                className="text-white hover:text-gray-700"
              >
                HOME
              </a>
            )}

            <a
              href="#Service"
              onClick={(e) => {
                e.preventDefault()
                scrollToHomeSection('Service')
              }}
              className="text-white hover:text-gray-700"
            >
              OUR SERVICE
            </a>

            <a
              href="#NewActivity"
              onClick={(e) => {
                e.preventDefault()
                scrollToHomeSection('NewActivity')
              }}
              className="text-white hover:text-gray-700"
            >
              NEWS & ACTIVITY
            </a>

            {!isAuthenticated ? (
              <a
                href="#reservation"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToHomeSection('reservation')
                }}
                className="text-white hover:text-gray-700"
              >
                RESERVATION
              </a>
            ) : (
              <Link to="/booking" className="text-white hover:text-gray-700">
                ADD BOOKING
              </Link>
            )}
          </div>

          {/* Auth Section */}
          {!isAuthenticated ? (
            <div className="flex items-center space-x-4 text-sm font-medium">
              <Link to="/signin" className="text-white hover:text-gray-700 border-r pr-4">SIGN IN</Link>
              <Link to="/signup" className="text-white hover:text-gray-700">SIGN UP</Link>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!isDropdownOpen)}
                className="text-white hover:text-gray-700 focus:outline-none"
              >
                {userName} ▼
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg py-2 z-50">
                  <Link to="/edit-user" className="block px-4 py-2 hover:bg-gray-100">แก้ไขข้อมูลผู้ใช้</Link>
                  <Link to="/my-booking" className="block px-4 py-2 hover:bg-gray-100">MyBooking</Link>
                  <Link to="/stay-details" className="block px-4 py-2 hover:bg-gray-100">รายละเอียดการเข้าพัก</Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
