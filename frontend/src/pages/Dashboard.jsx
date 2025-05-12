import React from 'react';

const Dashboard = () => {
  // สมมติข้อมูลผู้เช่าและห้อง
  const tenant = {
    firstName: 'View',
    lastName: 'TidHeeMak',
    email: 'v@gmail.com',
    phone: '098-123-4567',
    idCard: '1234567890123',
    room: {
      roomNumber: 'B302',
      dormitory: 'Majuraj Dormitory',
      floor: 3,
      status: 'Currently Staying',
      checkInDate: '2025-05-01',
      duration: 'Ethernity'
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8 space-y-10">
        {/* Welcome Section */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Welcome, {tenant.firstName} 👋</h1>
            <p className="text-gray-500 mt-1">Here is your dashboard summary.</p>
          </div>
          <img
            src="/logo.png"
            alt="Dashboard Illustration"
            className="w-32 h-32 object-contain hidden md:block"
          />
        </div>

        {/* Room Information */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-blue-800 mb-3">🏠 Your Room Information</h2>
          <div className="text-gray-700 space-y-1">
            <p><strong>Room:</strong> {tenant.room.roomNumber}</p>
            <p><strong>Dormitory:</strong> {tenant.room.dormitory}</p>
            <p><strong>Floor:</strong> {tenant.room.floor}</p>
            <p><strong>Status:</strong> {tenant.room.status}</p>
            <p><strong>Check-in Date:</strong> {tenant.room.checkInDate}</p>
            <p><strong>Duration:</strong> {tenant.room.duration}</p>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-green-800 mb-3">👤 Your Personal Information</h2>
          <div className="text-gray-700 space-y-1">
            <p><strong>Full Name:</strong> {tenant.firstName} {tenant.lastName}</p>
            <p><strong>Email:</strong> {tenant.email}</p>
            <p><strong>Phone:</strong> {tenant.phone}</p>
            <p><strong>ID Card Number:</strong> {tenant.idCard}</p>
          </div>
        </div>

        {/* Announcement Section */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-yellow-800 mb-3">📢 Announcements</h2>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>Wi-Fi maintenance on May 20, 2025 (8:00 - 12:00)</li>
            <li>Monthly rental due on the 5th of each month</li>
            <li>Room inspection scheduled for May 25, 2025</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
