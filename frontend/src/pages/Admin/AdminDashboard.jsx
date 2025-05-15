import React, { useEffect, useState } from 'react'
import axios from 'axios'

function AdminDashboard() {
  const [roomStats, setRoomStats] = useState({ available: 0, rented: 0, booked: 0 })
  const [income, setIncome] = useState(0)
  const [pendingBills, setPendingBills] = useState(0)
  const [repairs, setRepairs] = useState([])
  const [contractAlerts, setContractAlerts] = useState([])

  useEffect(() => {
    // ดึงข้อมูลห้องทั้งหมด แล้วคำนวณสถิติเบื้องต้น
    axios.get('http://localhost:5000/api/room').then(res => {
      const allRooms = res.data
      const available = allRooms.filter(r => r.status === 'empty').length
      const rented = allRooms.filter(r => r.status === 'occupied').length
      const booked = allRooms.filter(r => r.status === 'reserved').length
      setRoomStats({ available, rented, booked })
    })

    // ดึงบิลทั้งหมดแล้วรวมยอดรายได้ (เฉพาะที่จ่ายแล้ว)
    axios.get('http://localhost:5000/api/bill/all').then(res => {
      const paidBills = res.data.filter(b => b.bill_status === 'paid')
      const totalIncome = paidBills.reduce((sum, b) => sum + (b.total_amount || 0), 0)
      setIncome(totalIncome)
    })

    // ดึงบิลทั้งหมด แล้วนับจำนวนที่ยังไม่ได้จ่าย
    axios.get('http://localhost:5000/api/bill/all').then(res => {
      const pending = res.data.filter(b => b.bill_status === 'unpaid').length
      setPendingBills(pending)
    })

    // ดึงรายการแจ้งซ่อมทั้งหมด แล้วโชว์ 5 รายการล่าสุด
    axios.get('http://localhost:5000/api/repair/all').then(res => {
      setRepairs(res.data.slice(0, 5))
    })

    // ดึง lease ทั้งหมดแล้วกรองเฉพาะที่ใกล้หมดอายุ (เช่นภายใน 7 วัน)
    axios.get('http://localhost:5000/api/lease/active').then(res => {
      const soonExpiring = res.data
        .map(l => {
          const end = new Date(l.end_date)
          const today = new Date()
          const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24))
          return { ...l, days_left: diff }
        })
        .filter(l => l.days_left <= 7 && l.days_left >= 0)
      setContractAlerts(soonExpiring)
    })
  }, [])

  return (
    <div className="max-w-7xl mx-auto  p-6 bg-white rounded-lg shadow-lg space-y-4">
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
                - ห้อง {r.Room_ID} ({r.Description}) -{' '}
                <span className={r.Status === 'completed' ? 'text-green-600' : 'text-blue-600'}>
                  {r.Status === 'completed' ? 'เสร็จแล้ว' : 'กำลังดำเนินการ'}
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
