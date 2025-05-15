import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const AllRepairsAdmin = () => {
  const [repairs, setRepairs] = useState([])
  const [employees, setEmployees] = useState([])
  const [selectedEmp, setSelectedEmp] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    axios.get('http://localhost:5000/api/repair/all')
      .then(res => setRepairs(res.data))
      .catch(err => console.error('โหลดรายการแจ้งซ่อมล้มเหลว:', err))

    axios.get('http://localhost:5000/api/employee')
      .then(res => setEmployees(res.data))
      .catch(err => console.error('โหลดพนักงานล้มเหลว:', err))
  }, [])

  const updateStatus = async (requestId, type) => {
    try {
      if (type === 'accept') {
        const employeeId = selectedEmp[requestId]
        if (!employeeId) return alert('กรุณาเลือกพนักงานก่อนรับเรื่อง')
        await axios.put(`http://localhost:5000/api/repair/accept/${requestId}`, { employeeId })
        alert('รับเรื่องสำเร็จ')
        window.location.reload()
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาด: ' + err.message)
    }
  }

  const completedRepairs = repairs.filter(r => r.Status === 'completed')
  const inProgressRepairs = repairs.filter(r => r.Status !== 'completed')

  const RepairTable = ({ title, data }) => (
    <div className="mt-10">
      <h3 className="text-xl font-semibold text-gray-700 mb-3">{title}</h3>
      {data.length === 0 ? (
        <p className="text-gray-500">ไม่มีข้อมูล</p>
      ) : (
        <div className="overflow-x-auto bg-gray-50 rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-4 py-2 text-left">ชื่อผู้เช่า</th>
                <th className="px-4 py-2 text-left">ห้อง</th>
                <th className="px-4 py-2 text-left">วันที่แจ้ง</th>
                <th className="px-4 py-2 text-left">รายละเอียด</th>
                <th className="px-4 py-2 text-left">สถานะ</th>
                <th className="px-4 py-2 text-left">ช่าง</th>
                <th className="px-4 py-2 text-left">วันที่ซ่อม</th>
                <th className="px-4 py-2 text-left">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {data.map((r, index) => (
                <tr key={index} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2">{r.firstname} {r.lastname}</td>
                  <td className="px-4 py-2">{r.Room_ID}</td>
                  <td className="px-4 py-2">{r.Request_date?.split('T')[0]}</td>
                  <td className="px-4 py-2">{r.Description}</td>
                  <td className="px-4 py-2">{r.Status}</td>
                  <td className="px-4 py-2">{r.technician || '-'}</td>
                  <td className="px-4 py-2">{r.maintenance_date?.split('T')[0] || '-'}</td>
                  <td className="px-4 py-2">
                    {r.Status === 'pending' && (
                      <div className="flex gap-2 items-center">
                        <select
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                          value={selectedEmp[r.Request_ID] || ''}
                          onChange={(e) =>
                            setSelectedEmp({ ...selectedEmp, [r.Request_ID]: e.target.value })
                          }
                        >
                          <option value="">เลือกช่าง</option>
                          {employees.map(emp => (
                            <option key={emp.Employee_ID} value={emp.Employee_ID}>
                              {emp.firstname} {emp.lastname}
                            </option>
                          ))}
                        </select>
                        <button
                          className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-3 py-1 rounded transition"
                          onClick={() => updateStatus(r.Request_ID, 'accept')}
                        >
                          รับเรื่อง
                        </button>
                      </div>
                    )}

                    {r.Status === 'in_progress' && (
                      <button
                        className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded transition"
                        onClick={() => navigate(`/admin/repairs/complete/${r.Request_ID}`)}
                      >
                        ซ่อมเสร็จสิ้น
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )


  return (
  <div className="max-w-7xl mx-auto p-6 bg-white rounded-xl shadow">
    <h2 className="text-3xl font-semibold text-gray-800 mb-6">รายการแจ้งซ่อมทั้งหมด</h2>

    <RepairTable title="คำร้องที่ยังไม่เสร็จ" data={inProgressRepairs} />
    <RepairTable title="คำร้องที่เสร็จแล้ว" data={completedRepairs} />
  </div>
)
}

export default AllRepairsAdmin
