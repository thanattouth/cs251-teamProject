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
    try {
      const user = JSON.parse(localStorage.getItem('user'))
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
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">จองห้องพัก</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">เลือกห้องว่าง</label>
          <select name="Room_ID" value={form.Room_ID} onChange={handleChange} required className="border p-2 w-full">
            <option value="">-- เลือกห้อง --</option>
            {rooms.map(room => (
              <option key={room.Room_ID} value={room.Room_ID}>
                {room.Room_ID} ({room.room_type_id})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">วันที่เริ่มเข้าพัก</label>
          <input type="date" name="check_in_date" value={form.check_in_date} onChange={handleChange} required className="border p-2 w-full" />
        </div>
        <div>
          <label className="block mb-1">วันที่สิ้นสุดสัญญา</label>
          <input type="date" name="check_out_date" value={form.check_out_date} onChange={handleChange} required className="border p-2 w-full" />
        </div>
        <button type="submit" className="bg-black text-white px-4 py-2 rounded">จอง</button>
      </form>
    </div>
  )
}

export default BookRoom