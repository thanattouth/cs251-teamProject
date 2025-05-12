import React, { useEffect, useState } from 'react'
import axios from 'axios'

function AdminDashboard() {
  const [roomStats, setRoomStats] = useState({ available: 0, rented: 0, booked: 0 })
  const [income, setIncome] = useState(0)
  const [pendingBills, setPendingBills] = useState(0)
  const [repairs, setRepairs] = useState([])
  const [contractAlerts, setContractAlerts] = useState([])

  useEffect(() => {
    // ดึงข้อมูลสถิติห้อง
    axios.get('http://localhost:5000/api/admin/room-stats').then(res => setRoomStats(res.data))
    // ดึงรายได้เดือนนี้
    axios.get('http://localhost:5000/api/admin/income').then(res => setIncome(res.data.income))
    // ดึงจำนวนบิลค้างชำระ
    axios.get('http://localhost:5000/api/admin/pending-bills').then(res => setPendingBills(res.data.count))
    // ดึงรายการแจ้งซ่อมล่าสุด
    axios.get('http://localhost:5000/api/admin/repairs').then(res => setRepairs(res.data))
    // ดึงสัญญาที่ใกล้หมดอายุ
    axios.get('http://localhost:5000/api/admin/contract-alerts').then(res => setContractAlerts(res.data))
  }, [])

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg space-y-4">
      {/* สถิติห้อง */}
      <div className="flex justify-between items-center border-b pb-2 text-lg font-semibold">
        <span>ห้องว่าง: {roomStats.available}</span>
        <span className="text-red-600">มีผู้เช่า: {roomStats.rented}</span>
        <span className="text-yellow-500">จองแล้ว: {roomStats.booked}</span>
      </div>

      {/* รายได้ & บิลค้างชำระ */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-100 rounded p-4 flex flex-col items-center">
          <div className="text-2xl font-bold mb-1">💰 รายได้เดือนนี้</div>
          <div className="text-2xl text-green-700 font-bold">฿{income.toLocaleString()}</div>
        </div>
        <div className="bg-yellow-100 rounded p-4 flex flex-col items-center">
          <div className="text-lg font-bold mb-1">🧾 บิลค้างชำระ</div>
          <div className="text-xl text-yellow-700 font-bold">{pendingBills} ใบ</div>
        </div>
      </div>

      {/* การแจ้งซ่อมล่าสุด */}
      <div className="bg-blue-50 rounded p-4">
        <div className="font-bold mb-2">🛠 การแจ้งซ่อมล่าสุด:</div>
        <ul className="space-y-1">
          {repairs.length === 0 ? (
            <li className="text-gray-500">ไม่มีรายการแจ้งซ่อม</li>
          ) : (
            repairs.map((r, idx) => (
              <li key={idx}>
                - ห้อง {r.Room_ID} ({r.description}) -{' '}
                <span className={r.status === 'completed' ? 'text-green-600' : 'text-blue-600'}>
                  {r.status === 'completed' ? 'เสร็จแล้ว' : 'กำลังดำเนินการ'}
                </span>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* เตือนสัญญา */}
      <div className="bg-red-50 rounded p-4">
        <div className="font-bold mb-2">📅 เตือน:</div>
        <ul className="space-y-1">
          {contractAlerts.length === 0 ? (
            <li className="text-gray-500">ไม่มีสัญญาใกล้หมดอายุ</li>
          ) : (
            contractAlerts.map((c, idx) => (
              <li key={idx}>
                ห้อง {c.Room_ID} สัญญาหมดในอีก {c.days_left} วัน
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  )
}

export default AdminDashboard