import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const MyRepairs = ({ user }) => {
  const [repairs, setRepairs] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    if (!user?.Tenant_ID) return
    axios.get(`http://localhost:5000/api/repair/user/${user.Tenant_ID}`)
      .then(res => setRepairs(res.data))
  }, [user])

  const statusBadge = (status) => {
    const badgeClass = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
    }[status] || 'bg-gray-100 text-gray-800'

    return <span className={`text-sm px-3 py-1 rounded-full font-medium ${badgeClass}`}>{status}</span>
  }

  return (
    <div className="max-w-7xl mx-auto mt-20 p-6 bg-white rounded-xl shadow space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">รายการแจ้งซ่อมของฉัน</h2>
        <button
          onClick={() => navigate('/report-repair')}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          + แจ้งซ่อม
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border border-gray-200 rounded-xl">
          <thead className="bg-gray-50 text-gray-600 font-semibold">
            <tr>
              <th className="px-4 py-3">วันที่แจ้ง</th>
              <th className="px-4 py-3">รายละเอียด</th>
              <th className="px-4 py-3">สถานะ</th>
              <th className="px-4 py-3">วันที่ซ่อม</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {repairs.map((r, i) => (
              <tr key={i} className="even:bg-gray-50 hover:bg-gray-100 transition">
                <td className="px-4 py-2">{r.Request_date?.split('T')[0]}</td>
                <td className="px-4 py-2">{r.Description}</td>
                <td className="px-4 py-2">{statusBadge(r.Status)}</td>
                <td className="px-4 py-2">{r.maintenance_date?.split('T')[0] || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MyRepairs
