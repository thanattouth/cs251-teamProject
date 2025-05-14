import React, { useState, useEffect } from 'react'
import axios from 'axios'

function BookRoom() {
  const [rooms, setRooms] = useState([])
  const [form, setForm] = useState({
    Room_ID: '',
    check_in_date: '',
    check_out_date: ''
  })

  useEffect(() => {
    axios.get('http://localhost:5000/api/room?status=empty')
      .then(res => setRooms(res.data))
      .catch(() => setRooms([]))
  }, [])

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    const user = JSON.parse(localStorage.getItem('user'))
    try {
      await axios.post('http://localhost:5000/api/booking', {
        ...form,
        Tenant_ID: user?.Tenant_ID,
      })
      alert('ส่งคำขอจองสำเร็จ')
      setForm({ Room_ID: '', check_in_date: '', check_out_date: '' })
    } catch {
      alert('เกิดข้อผิดพลาด')
    }
  }

  return (
    <div className="relative min-h-screen pt-28 pb-16 px-4 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: 'url("/hero-bg2.jpg")' }}
      ></div>

      <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/100 to-white/25"></div>

      <div className="relative z-10 max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-10">
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-10">
          🏨 จองห้องพัก
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ห้องว่าง */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              เลือกห้องว่าง
            </label>
            <select
              name="Room_ID"
              value={form.Room_ID}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-2"
            >
              <option value="">-- เลือกห้อง --</option>
              {rooms.map(room => (
                <option key={room.Room_ID} value={room.Room_ID}>
                  {room.Room_ID} ({room.room_type_id})
                </option>
              ))}
            </select>
          </div>

          {/* วันที่ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">วันที่เริ่มเข้าพัก</label>
              <input
                type="date"
                name="check_in_date"
                value={form.check_in_date}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">วันที่สิ้นสุดสัญญา</label>
              <input
                type="date"
                name="check_out_date"
                value={form.check_out_date}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-2"
              />
            </div>
          </div>

          {/* ปุ่ม */}
          <div className="text-center pt-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg"
            >
              ส่งคำขอจอง
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BookRoom
