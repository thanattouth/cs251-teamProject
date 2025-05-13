import React, { useEffect, useState } from 'react'
import axios from 'axios'

const MyBookings = ({ user }) => {
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    if (!user?.Tenant_ID) return

    axios.get(`http://localhost:5000/api/booking/tenant/${user.Tenant_ID}`)
      .then(res => setBookings(res.data))
      .catch(err => {
        console.error('Error loading bookings:', err)
        setBookings([])
      })
  }, [user])

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">การจองของฉัน</h2>
      {bookings.length === 0 ? (
        <p className="text-gray-600">ยังไม่มีรายการจอง</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">Booking ID</th>
              <th className="border px-2 py-1">ห้อง</th>
              <th className="border px-2 py-1">สถานะ</th>
              <th className="border px-2 py-1">วันเข้า</th>
              <th className="border px-2 py-1">วันออก</th>
              <th className="border px-2 py-1">ค่ามัดจำ</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.Booking_ID}>
                <td className="border px-2 py-1">{b.Booking_ID}</td>
                <td className="border px-2 py-1">{b.Room_ID}</td>
                <td className="border px-2 py-1">{b.booking_status}</td>
                <td className="border px-2 py-1">{b.check_in_date}</td>
                <td className="border px-2 py-1">{b.check_out_date}</td>
                <td className="border px-2 py-1">{b.booking_fee || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default MyBookings
