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
    <div className="p-6 max-w-5xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">สร้างบิลแบบระบุห้อง</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-2">เลือกห้อง:</h3>
          <ul className="border max-h-96 overflow-y-auto">
            {leases.map(lease => (
              <li
                key={lease.Lease_ID}
                className={`p-2 cursor-pointer border-b ${selected?.Lease_ID === lease.Lease_ID ? 'bg-blue-100' : ''}`}
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

        {selected && (
          <div>
            <h3 className="font-semibold mb-2">รายละเอียด:</h3>
            <p>ห้อง: {selected.Room_ID}</p>
            <p>ผู้เช่า: {selected.firstname} {selected.lastname}</p>
            <p>ค่าเช่า: ฿{selected.monthly_rent}</p>
            <p>ค่าน้ำเหมาจ่าย: ฿{selected.Water_bill}</p>
            <p>ค่าซ่อมบำรุงเดือนนี้: ฿{selected.repairCost || 0}</p>
            <div className="mt-4">
              <label>หน่วยไฟที่ใช้: </label>
              <input
                type="number"
                value={unitUsed}
                onChange={e => setUnitUsed(e.target.value)}
                className="border rounded p-1 w-32"
              />
            </div>

            {unitUsed && !isNaN(unitUsed) && (
              <div className="mt-2 text-lg font-semibold">
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
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
            >
              สร้างบิล
            </button>
            {message && <p className="mt-2 text-blue-600">{message}</p>}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminBillControl
