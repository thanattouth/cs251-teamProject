import React, { useEffect, useState } from 'react'
import axios from 'axios'

const MyRepairs = ({ user }) => {
  const [repairs, setRepairs] = useState([])

  useEffect(() => {
    if (!user?.Tenant_ID) return
    axios.get(`http://localhost:5000/api/repair/user/${user.Tenant_ID}`)
      .then(res => setRepairs(res.data))
      .catch(err => console.error('โหลดข้อมูลแจ้งซ่อมล้มเหลว:', err))
  }, [user])

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">รายการแจ้งซ่อมของฉัน</h2>
      {repairs.length === 0 ? (
        <p className="text-gray-600">ยังไม่มีรายการแจ้งซ่อม</p>
      ) : (
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">ห้อง</th>
              <th className="border px-2 py-1">วันที่แจ้ง</th>
              <th className="border px-2 py-1">รายละเอียด</th>
              <th className="border px-2 py-1">สถานะ</th>
              <th className="border px-2 py-1">ช่าง</th>
              <th className="border px-2 py-1">วันที่ซ่อม</th>
            </tr>
          </thead>
          <tbody>
            {repairs.map((r, index) => (
              <tr key={index}>
                <td className="border px-2 py-1">{r.Room_ID}</td>
                <td className="border px-2 py-1">{r.Request_date?.split('T')[0]}</td>
                <td className="border px-2 py-1">{r.Description}</td>
                <td className="border px-2 py-1">{r.Status}</td>
                <td className="border px-2 py-1">{r.technician || '-'}</td>
                <td className="border px-2 py-1">{r.maintenance_date?.split('T')[0] || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default MyRepairs
