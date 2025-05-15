import React, { useEffect, useState } from 'react'
import axios from 'axios'

function AdminBookingDashboard() {
  const [pendingBookings, setPendingBookings] = useState([])
  const [todayCheckins, setTodayCheckins] = useState([])
  const [allBookings, setAllBookings] = useState([])

  useEffect(() => {
    fetchPendingBookings()
    fetchTodayCheckins()
    fetchAllBookings()
  }, [])

  const fetchPendingBookings = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/booking?status=pending')
      setPendingBookings(res.data)
    } catch {
      setPendingBookings([])
    }
  }

  const fetchTodayCheckins = async () => {
    try {
      const today = new Date().toLocaleDateString('sv-SE')
      const res = await axios.get(`http://localhost:5000/api/booking?status=confirmed&check_in_date=${today}`)
      setTodayCheckins(res.data)
    } catch {
      setTodayCheckins([])
    }
  }

  const fetchAllBookings = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/booking')
      setAllBookings(res.data)
    } catch {
      setAllBookings([])
    }
  }

  const handleConfirmWithFee = async (id) => {
    await axios.put(`http://localhost:5000/api/booking/${id}/confirm`)
    fetchPendingBookings()
    fetchTodayCheckins()
    fetchAllBookings()
  }

  const handleCancel = async (id) => {
    const confirm = window.confirm('คุณต้องการยกเลิกการจองนี้ใช่หรือไม่?')
    if (!confirm) return
    await axios.put(`http://localhost:5000/api/booking/${id}/cancel`)
    fetchPendingBookings()
    fetchAllBookings()
  }

  const handleCheckin = async (id) => {
    await axios.put(`http://localhost:5000/api/booking/${id}/checkin`)
    fetchTodayCheckins()
    fetchPendingBookings()
    fetchAllBookings()
  }

  const renderTable = (data, type = 'all') => (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full text-sm text-gray-700">
        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-4 py-3 text-left">Booking ID</th>
            <th className="px-4 py-3 text-left">Room</th>
            <th className="px-4 py-3 text-left">Tenant</th>
            {type !== 'all' && (
              <>
                <th className="px-4 py-3 text-left">Check-in</th>
                <th className="px-4 py-3 text-left">Check-out</th>
              </>
            )}
            {type === 'all' && (
              <>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Check-in</th>
                <th className="px-4 py-3 text-left">Check-out</th>
              </>
            )}
            <th className="px-4 py-3 text-left">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {data.length === 0 ? (
            <tr>
              <td colSpan={type === 'all' ? 7 : 6} className="text-center py-5 text-gray-400">ไม่มีรายการ</td>
            </tr>
          ) : (
            data.map(b => (
              <tr key={b.Booking_ID} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3">{b.Booking_ID}</td>
                <td className="px-4 py-3">{b.Room_ID}</td>
                <td className="px-4 py-3">{b.Tenant_ID}</td>
                {type === 'all' && (
                  <>
                    <td className="px-4 py-3">{b.booking_status?.slice(0, 10)}</td>
                    <td className="px-4 py-3">{b.check_in_date?.slice(0, 10)}</td>
                    <td className="px-4 py-3">{b.check_out_date?.slice(0, 10)}</td>
                  </>
                )}
                {type !== 'all' && (
                  <>
                    <td className="px-4 py-3">{b.check_in_date?.slice(0, 10)}</td>
                    <td className="px-4 py-3">{b.check_out_date?.slice(0, 10)}</td>
                  </>
                )}
                <td className="px-4 py-3 flex gap-2">
                  {type === 'pending' && (
                    <>
                      <button onClick={() => handleConfirmWithFee(b.Booking_ID)} className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg transition">อนุมัติ</button>
                      <button onClick={() => handleCancel(b.Booking_ID)} className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg transition">ปฏิเสธ</button>
                    </>
                  )}
                  {type === 'checkin' && (
                    <button onClick={() => handleCheckin(b.Booking_ID)} className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition">Check-in</button>
                  )}
                  {type === 'all' && (
                    <>
                      {b.booking_status === 'confirmed' && (
                        <button onClick={() => handleCheckin(b.Booking_ID)} className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition">Check-in</button>
                      )}
                      {b.booking_status !== 'cancelled' && b.booking_status !== 'completed' && (
                        <button onClick={() => handleCancel(b.Booking_ID)} className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg transition">ยกเลิก</button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-2xl shadow-lg space-y-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">การจองห้อง (ฺBooking)</h2>

      <section>
        <h3 className="text-xl font-semibold mb-3 text-gray-700">รายการจองที่รออนุมัติ</h3>
        {renderTable(pendingBookings, 'pending')}
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-3 text-gray-700">Check-in วันนี้</h3>
        {renderTable(todayCheckins, 'checkin')}
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-3 text-gray-700">รายการจองทั้งหมด</h3>
        {renderTable(allBookings, 'all')}
      </section>
    </div>
  )
}

export default AdminBookingDashboard
