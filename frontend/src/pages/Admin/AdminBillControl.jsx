import React, { useEffect, useState } from 'react'
import axios from 'axios'

const AdminBillControl = () => {
  const [leases, setLeases] = useState([])
  const [selected, setSelected] = useState(null)
  const [unitUsed, setUnitUsed] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    axios.get('http://localhost:5000/api/lease/active')
      .then(res => setLeases(res.data))
      .catch(err => console.error('Error loading leases:', err))
  }, [])

  const handleGenerate = () => {
    if (!selected || !unitUsed) return alert('กรุณาเลือกห้องและกรอกหน่วยไฟ')
    axios.post('http://localhost:5000/api/bill/manual', {
      leaseId: selected.Lease_ID,
      unitUsed: Number(unitUsed)
    })
      .then(res => setMessage(res.data.message))
      .catch(err => setMessage('เกิดข้อผิดพลาด'))
  }

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white shadow-md rounded-xl">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">สร้างบิลแบบระบุห้อง</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* เลือกห้อง */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">เลือกห้อง</h3>
          <ul className="border rounded-lg max-h-[400px] overflow-y-auto divide-y">
            {leases.map(lease => (
              <li
                key={lease.Lease_ID}
                className={`p-3 cursor-pointer transition ${
                  selected?.Lease_ID === lease.Lease_ID
                    ? 'bg-blue-100 font-medium'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => {
                  setSelected(lease)
                  setUnitUsed('')
                  setMessage('')
                }}
              >
                ห้อง {lease.Room_ID} - {lease.firstname} {lease.lastname}
              </li>
            ))}
          </ul>
        </div>

        {/* แสดงรายละเอียดเมื่อเลือก */}
        {selected && (
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">รายละเอียดห้อง</h3>
            <div className="space-y-2 text-gray-700">
              <p><strong>ห้อง:</strong> {selected.Room_ID}</p>
              <p><strong>ผู้เช่า:</strong> {selected.firstname} {selected.lastname}</p>
              <p><strong>ค่าเช่า:</strong> ฿{selected.monthly_rent}</p>
              <p><strong>ค่าน้ำเหมาจ่าย:</strong> ฿{selected.Water_bill}</p>
              <p><strong>ค่าซ่อมบำรุงเดือนนี้:</strong> ฿{selected.repairCost || 0}</p>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-600 mb-1">หน่วยไฟที่ใช้</label>
              <input
                type="number"
                value={unitUsed}
                onChange={e => setUnitUsed(e.target.value)}
                className="w-32 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="เช่น 50"
              />
            </div>

            {unitUsed && !isNaN(unitUsed) && (
              <div className="mt-4 text-base font-semibold text-gray-800 space-y-1">
                <p>ค่าไฟ: ฿{Number(selected.Electric_bill) * Number(unitUsed)}</p>
                <p>
                  ยอดรวมทั้งหมด: ฿{(
                    Number(selected.monthly_rent) +
                    Number(selected.Water_bill) +
                    Number(selected.repairCost) +
                    (Number(selected.Electric_bill) * Number(unitUsed))
                  ).toFixed(2)}
                </p>
              </div>
            )}

            <button
              onClick={handleGenerate}
              className="mt-6 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition"
            >
              สร้างบิล
            </button>

            {message && <p className="mt-3 text-green-600">{message}</p>}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminBillControl
