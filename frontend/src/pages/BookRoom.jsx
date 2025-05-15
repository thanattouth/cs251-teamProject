import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function BookRoom() {
  const [rooms, setRooms] = useState([])
  const [form, setForm] = useState({
    Room_ID: '',
    check_in_date: '',
    check_out_date: ''
  })
  const [hasBookingOrRoom, setHasBookingOrRoom] = useState(false)
  const [checkedStatus, setCheckedStatus] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user?.Tenant_ID) return

    const checkBookingOrRoom = async () => {
      try {
        const { Tenant_ID } = user

        // ดึงข้อมูลการจอง + tenant ปัจจุบัน
        const [bookingRes, tenantRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/booking/tenant/${Tenant_ID}`),
          axios.get(`http://localhost:5000/api/tenant`)
        ])

        const thisTenant = tenantRes.data.find(t => t.Tenant_ID === Tenant_ID)
        const hasRoom = !!thisTenant?.current_room_id

        const hasPendingBooking = bookingRes.data.some(b =>
          ['pending', 'confirmed'].includes(b.booking_status)
        )

        if (hasRoom || hasPendingBooking) {
          setHasBookingOrRoom(true)
        } else {
          const roomRes = await axios.get('http://localhost:5000/api/room?status=empty')
          setRooms(roomRes.data)
        }
      } catch (err) {
        console.error('Booking/room check error:', err)
      } finally {
        setCheckedStatus(true)
      }
    }

    checkBookingOrRoom()
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
      navigate('/my-booking')
    } catch {
      alert('เกิดข้อผิดพลาดในการจอง')
    }
  }

  if (!checkedStatus) {
    return <div className="text-center p-10 text-gray-600">⏳ กำลังโหลดข้อมูล...</div>
  }

  if (hasBookingOrRoom) {
    return (
      <div className="max-w-xl mx-auto mt-24 p-6 bg-white rounded-2xl shadow-lg text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">❌ คุณมีห้องพักหรือการจองอยู่แล้ว</h2>
        <p className="text-gray-600">
          คุณไม่สามารถจองห้องใหม่ได้จนกว่าจะสิ้นสุดการจองหรือห้องเดิม
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto mt-20 p-6 bg-white rounded-2xl shadow-lg space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">📄 จองห้องพัก</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">เลือกห้องว่าง</label>
          <select
            name="Room_ID"
            value={form.Room_ID}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-gray-300"
          >
            <option value="">-- เลือกห้อง --</option>
            {rooms.map(room => (
              <option key={room.Room_ID} value={room.Room_ID}>
                {room.Room_ID} (ชั้น {room.floor})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">วันที่เริ่มเข้าพัก</label>
          <input
            type="date"
            name="check_in_date"
            value={form.check_in_date}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">วันที่สิ้นสุดสัญญา</label>
          <input
            type="date"
            name="check_out_date"
            value={form.check_out_date}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-gray-300"
          />
        </div>

        <div className="pt-4 text-center">
          <button
            type="submit"
            className="bg-black hover:bg-gray-800 text-white font-medium py-2 px-6 rounded-lg transition"
          >
            ยืนยันการจอง
          </button>
        </div>
      </form>
    </div>
  )
}

export default BookRoom
