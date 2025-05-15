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
  }, [isAuthenticated, localStorage.getItem('user')])

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
    <nav className="bg-white p-4 shadow-md fixed top-0 left-0 w-full z-50">
      <div className="flex items-center justify-between px-6">
        {/* Left: Logo */}
        <Link to="/" className="text-black text-lg font-bold whitespace-nowrap">
          Dormitory Hub
        </Link>

        {/* Right: Navigation Links + Auth Links */}
        <div className="flex items-center space-x-8">
        
          {/* Auth Section */}
          {!isAuthenticated ? (
            <div className="flex items-center space-x-8">
              <div className="flex space-x-6 text-sm font-medium">
                <button onClick={() => scrollToHomeSection('')} className="text-black hover:text-gray-700">HOME</button>
                <button onClick={() => scrollToHomeSection('Service')} className="text-black hover:text-gray-700">OUR SERVICE</button>
                <button onClick={() => scrollToHomeSection('NewActivity')} className="text-black hover:text-gray-700">NEWS & ACTIVITY</button>
                <button onClick={() => scrollToHomeSection('reservation')} className="text-black hover:text-gray-700">RESERVATION</button>
              </div>
              <div className="flex items-center space-x-4 text-sm font-medium">
                <Link to="/signin" className="text-black hover:text-gray-700 border-r pr-4">SIGN IN</Link>
                <Link to="/signup" className="text-black hover:text-gray-700">SIGN UP</Link>
              </div>
            </div>
            
          ) : (
            <div className="flex items-center space-x-8">
              <div className="flex space-x-6 text-sm font-medium">
                <Link to="/dashboard" className="text-black hover:text-gray-700">DASHBOARD</Link>
                <Link to="/booking" className="text-black hover:text-gray-700">ADD BOOKING</Link>
                {/* <Link to="/report-repair" className="text-black hover:text-gray-700">REPORT REPAIR</Link>
                <Link to="/bill" className="text-black hover:text-gray-700">BILL</Link>
                <Link to="/payment" className="text-black hover:text-gray-700">PAYMENT</Link> */}
              </div>
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!isDropdownOpen)}
                  className="text-black hover:text-gray-700 focus:outline-none"
                >
                  {userName} ▼
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg py-2">
                    <Link to="/edit-user" className="block px-4 py-2 hover:bg-gray-100">Edit Profile</Link>
                    <Link to="/my-booking" className="block px-4 py-2 hover:bg-gray-100">My Booking</Link>
                    <Link to="/my-room" className="block px-4 py-2 hover:bg-gray-100">My Room</Link>
                    <Link to="/my-repairs" className="block px-4 py-2 hover:bg-gray-100">My Repair</Link>
                    {/* <Link to="/report-repair" className="block px-4 py-2 hover:bg-gray-100">Report Repair</Link> */}
                    <Link to="/bill" className="block px-4 py-2 hover:bg-gray-100">Bill</Link>
                    <Link to="/payment" className="block px-4 py-2 hover:bg-gray-100">Payment</Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar