import React, { useEffect, useState } from 'react'
import axios from 'axios'

const formatDate = (isoString) => {
  const date = new Date(isoString)
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const statusColor = {
  completed: 'text-green-600 bg-green-100',
  cancelled: 'text-red-600 bg-red-100',
  pending: 'text-yellow-600 bg-yellow-100',
}

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
    <div className="max-w-6xl mx-auto mt-20 p-8 bg-white rounded-2xl shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">รายการจองห้องพักของคุณ</h2>
      </div>

      {bookings.length === 0 ? (
        <p className="text-gray-500 text-center">ยังไม่มีรายการจอง</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-50 text-gray-700 font-semibold">
              <tr>
                <th className="py-3 px-4 text-left">Booking ID</th>
                <th className="py-3 px-4 text-left">ห้อง</th>
                <th className="py-3 px-4 text-left">สถานะ</th>
                <th className="py-3 px-4 text-left">วันเข้า</th>
                <th className="py-3 px-4 text-left">วันออก</th>
                <th className="py-3 px-4 text-left">ค่ามัดจำ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-700">
              {bookings.map(b => (
                <tr key={b.Booking_ID} className="hover:bg-gray-50 transition">
                  <td className="py-3 px-4">{b.Booking_ID}</td>
                  <td className="py-3 px-4">{b.Room_ID}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[b.booking_status] || 'bg-gray-100 text-gray-700'}`}>
                      {b.booking_status}
                    </span>
                  </td>
                  <td className="py-3 px-4">{formatDate(b.check_in_date)}</td>
                  <td className="py-3 px-4">{formatDate(b.check_out_date)}</td>
                  <td className="py-3 px-4">{b.booking_fee ? `฿${b.booking_fee}` : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default MyBookings
