import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Dashboard = () => {
  const [user, setUser] = useState(null)
  const [repairCount, setRepairCount] = useState(0)
  const [billCount, setBillCount] = useState(0)
  const [paidTotal, setPaidTotal] = useState(0)
  const [roomData, setRoomData] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)

      const { Tenant_ID } = parsedUser

      axios.get(`http://localhost:5000/api/repair/user/${Tenant_ID}`)
        .then(res => setRepairCount(res.data.length))

      axios.get(`http://localhost:5000/api/bill/tenant/${Tenant_ID}`)
        .then(res => setBillCount(res.data.length))

      axios.get(`http://localhost:5000/api/payment/tenant/${Tenant_ID}`)
        .then(res => {
          const total = res.data.reduce((sum, p) => sum + Number(p.amount || 0), 0)
          setPaidTotal(total)
        })

      axios.get(`http://localhost:5000/api/room/tenant/${Tenant_ID}/room-details`)
        .then(res => setRoomData(res.data))
    }
  }, [])

  if (!user) {
    return <div className="p-10 text-center text-[#777F65] bg-[#EDECE3]">Loading user info...</div>
  }

  const room = roomData?.room || {}

  return (
    <div className="relative min-h-screen bg-[#F9F8F3]">
      <div className="max-w-7xl mx-auto py-10 px-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-10 border border-[#ddd]">

          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#777F65]">👋 ยินดีต้อนรับ, {user.First_Name}</h1>
              <p className="text-sm text-[#777F65] mt-1">แดชบอร์ดสรุปรายการของคุณ</p>
            </div>
            <img src="/logo.png" alt="logo" className="w-24 h-24 hidden md:block" />
          </div>

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SummaryCard icon="🧾" label="จำนวนบิลทั้งหมด" value={billCount} />
            <SummaryCard icon="🛠" label="แจ้งซ่อมทั้งหมด" value={repairCount} />
            <SummaryCard icon="💸" label="ยอดชำระรวม" value={`฿${paidTotal.toFixed(2)}`} />
          </div>

          {/* Room */}
          <div className="bg-[#f9f6f1] border-l-4 border-[#C48F5F] p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-[#C48F5F] mb-3">🏠 ข้อมูลห้องพัก</h2>
            {roomData ? (
              <div className="text-[#555] space-y-1 text-sm">
                <p><strong>ห้อง:</strong> {room.Room_ID}</p>
                <p><strong>หอพัก:</strong> {room.dormitory_name}</p>
                <p><strong>ชั้น:</strong> {room.Floor}</p>
              </div>
            ) : (
              <p className="text-gray-500">ไม่พบข้อมูลห้อง</p>
            )}
          </div>

          {/* Announcements */}
          <div className="bg-[#f5f2ed] border-l-4 border-[#d4a373] p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-[#a05c1a] mb-3">📢 ประกาศ</h2>
            <ul className="list-disc pl-5 text-[#444] space-y-1 text-sm">
              <li>📶 ปรับปรุง Wi-Fi วันที่ 20 พ.ค. 2025</li>
              <li>📅 ชำระค่าเช่าทุกวันที่ 5 ของเดือน</li>
              <li>🧹 ตรวจห้องวันที่ 25 พ.ค. 2025</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

const SummaryCard = ({ icon, label, value }) => (
  <div className="bg-[#fefefe] border border-gray-200 rounded-xl p-5 shadow-sm text-center">
    <div className="text-3xl mb-2">{icon}</div>
    <div className="text-sm text-gray-500">{label}</div>
    <div className="text-xl font-semibold text-gray-700">{value}</div>
  </div>
)

export default Dashboard
