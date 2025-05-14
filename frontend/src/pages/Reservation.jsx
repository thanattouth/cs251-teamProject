import React, { useState } from 'react';
import RoomMap from '../components/RoomMap';

const Reservation = () => {
  const [selectedRoom, setSelectedRoom] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
  });

  const [showRoomMap, setShowRoomMap] = useState(false); // 🔁 toggle popup

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullData = { ...formData, roomType: selectedRoom };
    localStorage.setItem('reservation', JSON.stringify(fullData));
    alert(`✅ Reservation submitted for ${selectedRoom}`);
    setSelectedRoom('');
  };

  return (
    <div className="relative min-h-screen pt-28 pb-16 px-4 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: 'url("/hero-bg2.jpg")' }}
      ></div>

      <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/100 to-white/25"></div>

      <div className="relative z-10 max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-10">
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-10">
          🏨 Room Reservation
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Room Picker */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Selected Room
            </label>
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={selectedRoom || 'No room selected'}
                readOnly
                className="w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-2 text-gray-600"
              />
              <button
                type="button"
                onClick={() => setShowRoomMap(true)}
                className="text-sm text-blue-600 underline"
              >
                เลือกห้อง
              </button>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-2"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-2"
              required
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Check-in</label>
              <input
                type="date"
                name="checkIn"
                value={formData.checkIn}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Check-out</label>
              <input
                type="date"
                name="checkOut"
                value={formData.checkOut}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-2"
                required
              />
            </div>
          </div>

          {/* Guests */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Number of Guests</label>
            <input
              type="number"
              name="guests"
              value={formData.guests}
              onChange={handleChange}
              min="1"
              max="2"
              className="w-full border border-gray-300 rounded-xl px-4 py-2"
              required
            />
          </div>

          <div className="text-center pt-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg"
            >
               Reserve Now
            </button>
          </div>
        </form>
      </div>

      {/* 🔘 RoomMap Popup */}
      {showRoomMap && (
        <RoomMap
          onSelect={(roomNumber) => setSelectedRoom(roomNumber)}
          onClose={() => setShowRoomMap(false)}
        />
      )}
    </div>
  );
};

export default Reservation;
