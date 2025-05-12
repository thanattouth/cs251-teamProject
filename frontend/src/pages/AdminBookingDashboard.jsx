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

  const handleConfirmWithFee = async (id, fee) => {
    await axios.put(`http://localhost:5000/api/booking/${id}/confirm`, {
    })
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

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">แดชบอร์ดการจองห้อง (แอดมิน)</h2>

      {/* Section 1: รายการจองที่รออนุมัติ */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold mb-3">รายการจองที่รออนุมัติ</h3>
        <table className="w-full border mb-2">
          <thead>
            <tr className="bg-gray-100">
              <th>Booking ID</th>
              <th>Room</th>
              <th>Tenant</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingBookings.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-4">ไม่มีรายการ</td></tr>
            ) : (
              pendingBookings.map(b => (
                <tr key={b.Booking_ID}>
                  <td>{b.Booking_ID}</td>
                  <td>{b.Room_ID}</td>
                  <td>{b.Tenant_ID}</td>
                  <td>{b.check_in_date}</td>
                  <td>{b.check_out_date}</td>
                  <td>
                    <button className="bg-green-600 text-white px-2 py-1 rounded mr-2"
                      onClick={() => handleConfirmWithFee(b.Booking_ID)}>
                      อนุมัติ
                    </button>
                    <button className="bg-red-600 text-white px-2 py-1 rounded"
                      onClick={() => handleCancel(b.Booking_ID)}>
                      ปฏิเสธ
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      {/* Section 2: รายการ Check-in วันนี้ */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold mb-3">Check-in วันนี้</h3>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th>Booking ID</th>
              <th>Room</th>
              <th>Tenant</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {todayCheckins.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-4">ไม่มีรายการ</td></tr>
            ) : (
              todayCheckins.map(b => (
                <tr key={b.Booking_ID}>
                  <td>{b.Booking_ID}</td>
                  <td>{b.Room_ID}</td>
                  <td>{b.Tenant_ID}</td>
                  <td>{b.check_in_date}</td>
                  <td>{b.check_out_date}</td>
                  <td>
                    <button className="bg-blue-600 text-white px-2 py-1 rounded"
                      onClick={() => handleCheckin(b.Booking_ID)}>
                      Check-in
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      {/* Section 3: แสดง Booking ทั้งหมด */}
      <section>
        <h3 className="text-xl font-semibold mb-3">รายการจองทั้งหมด</h3>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th>Booking ID</th>
              <th>Room</th>
              <th>Tenant</th>
              <th>สถานะ</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {allBookings.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-4">ไม่มีรายการ</td></tr>
            ) : (
              allBookings.map(b => (
                <tr key={b.Booking_ID}>
                  <td>{b.Booking_ID}</td>
                  <td>{b.Room_ID}</td>
                  <td>{b.Tenant_ID}</td>
                  <td>{b.booking_status}</td>
                  <td>{b.check_in_date}</td>
                  <td>{b.check_out_date}</td>
                  <td>
                    {b.booking_status === 'confirmed' && (
                      <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                        onClick={() => handleCheckin(b.Booking_ID)}>
                        Check-in
                      </button>
                    )}
                    {b.booking_status !== 'cancelled' && b.booking_status !== 'completed' && (
                      <button className="bg-red-500 text-white px-2 py-1 rounded"
                        onClick={() => handleCancel(b.Booking_ID)}>
                        ยกเลิก
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export default AdminBookingDashboard
