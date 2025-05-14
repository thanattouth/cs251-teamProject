import React, { useEffect, useState } from 'react'

const Dashboard = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const roomInfo = {
    roomNumber: 'B302',
    dormitory: 'Majuraj Dormitory',
    floor: 3,
    status: 'Currently Staying',
    checkInDate: '2025-05-01',
    duration: 'Eternity',
  }

  if (!user) {
    return <div className="p-10 text-center text-[#777F65] bg-[#EDECE3]">Loading user info...</div>
  }

  return (
    <div className="relative min-h-screen">
      {/* Background Layer with low opacity and gradient */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: "linear-gradient(to bottom, rgba(237,236,227,0.4), rgba(237,236,227,0.9)), url('/bg-dashboard.jpg')",
          opacity: 0.3,
        }}
      ></div>

      {/* Foreground content */}
      <div className="relative z-10 p-6 mt-15">
        <div className="max-w-5xl mx-auto bg-[#EEEDE8]/90 shadow-xl rounded-2xl p-8 space-y-10 border border-[#ddd] backdrop-blur-sm">

          {/* Welcome Section */}
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#777F65]">Welcome, {user.First_Name} 👋</h1>
              <p className="text-[#777F65] mt-1 text-sm">Here is your personalized dashboard summary.</p>
            </div>
            <img
              src="/logo.png"
              alt="Dashboard Illustration"
              className="w-28 h-28 object-contain hidden md:block"
            />
          </div>

          {/* Room Information */}
          <div className="bg-[#f9f6f1] border-l-4 border-[#C48F5F] p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-[#C48F5F] mb-3">🏠 Your Room Information</h2>
            <div className="text-[#555] space-y-1">
              <p><strong>Room:</strong> {roomInfo.roomNumber}</p>
              <p><strong>Dormitory:</strong> {roomInfo.dormitory}</p>
              <p><strong>Floor:</strong> {roomInfo.floor}</p>
              <p><strong>Status:</strong> {roomInfo.status}</p>
              <p><strong>Check-in Date:</strong> {roomInfo.checkInDate}</p>
              <p><strong>Duration:</strong> {roomInfo.duration}</p>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-[#ededed] border-l-4 border-[#777F65] p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-[#777F65] mb-3">👤 Your Personal Information</h2>
            <div className="text-[#444] space-y-1">
              <p><strong>Full Name:</strong> {user.First_Name} {user.Last_Name}</p>
              <p><strong>Email:</strong> {user.Email}</p>
              <p><strong>Phone:</strong> {user.Phone}</p>
              <p><strong>ID Card Number:</strong> {user.ID_card_number}</p>
            </div>
          </div>

          {/* Announcement Section */}
          <div className="bg-[#f5f2ed] border-l-4 border-[#d4a373] p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-[#a05c1a] mb-3">📢 Announcements</h2>
            <ul className="list-disc pl-5 text-[#444] space-y-1">
              <li>Wi-Fi maintenance on May 20, 2025 (8:00 - 12:00)</li>
              <li>Monthly rental due on the 5th of each month</li>
              <li>Room inspection scheduled for May 25, 2025</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Dashboard
