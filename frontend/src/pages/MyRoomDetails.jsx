import React, { useEffect, useState } from 'react'
import axios from 'axios'

const MyRoomDetails = ({ user }) => {
  const [roomData, setRoomData] = useState(null)
  const [dormUtility, setDormUtility] = useState({ water: null, electric: null })
  const [error, setError] = useState(null)
  const [repairs, setRepairs] = useState([])
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!user?.Tenant_ID) return

    axios.get(`http://localhost:5000/api/room/tenant/${user.Tenant_ID}/room-details`)
      .then(res => {
        if (!res.data?.room) {
          setNotFound(true)
        } else {
          setRoomData(res.data)
          const dormId = res.data.room.Dormitory_ID
          if (dormId) {
            axios.get(`http://localhost:5000/api/dormitory/${dormId}`)
              .then(dormRes => {
                setDormUtility({
                  water: dormRes.data.Water_bill,
                  electric: dormRes.data.Electric_bill
                })
              })
          }
        }
      })
      .catch(err => {
        if (err.response?.status === 404) {
          setNotFound(true)
        } else {
          setError('ไม่สามารถโหลดข้อมูลห้องได้')
        }
      })

    axios.get(`http://localhost:5000/api/repair/user/${user.Tenant_ID}`)
      .then(res => setRepairs(res.data))
  }, [user])

  if (error) {
    return <div className="max-w-6xl mx-auto p-6 bg-red-50 text-red-600 rounded-xl shadow">{error}</div>
  }

  if (notFound || roomData === null || !roomData.room) {
    return (
      <div className="max-w-xl mx-auto mt-24 p-6 bg-white rounded-xl shadow text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">❌ ไม่พบห้องที่เช่า</h2>
        <p className="text-gray-600">คุณยังไม่มีห้องพักที่ใช้งานอยู่ในขณะนี้</p>
      </div>
    )
  }

  const { room, furniture } = roomData

  const statusBadge = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      cancelled: 'bg-red-100 text-red-700'
    }
    return <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-600'}`}>{status}</span>
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      <h2 className="text-3xl font-bold text-center text-gray-800">🏠 ข้อมูลห้องพักของฉัน</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InfoCard icon="🛏" label="เลขห้อง" value={room.Room_ID} />
        <InfoCard icon="🏢" label="ชั้น" value={room.Floor} />
        <InfoCard icon="📍" label="หอพัก" value={room.dormitory_name} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CostCard icon="💸" label="ค่าเช่ารายเดือน" value={`${room.Cost} บาท`} />
        <CostCard icon="💧" label="ค่าน้ำต่อหน่วย" value={`${dormUtility.water ?? '-'} บาท`} />
        <CostCard icon="⚡" label="ค่าไฟต่อหน่วย" value={`${dormUtility.electric ?? '-'} บาท`} />
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-4">🪑 เฟอร์นิเจอร์ในห้อง</h3>
        {furniture.length > 0 ? (
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            {furniture.map((item, i) => (
              <li key={i}>{item.furniture_name} จำนวน {item.quantity}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">ไม่มีรายการเฟอร์นิเจอร์</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-4">🛠 รายการแจ้งซ่อม</h3>
        {repairs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm rounded-lg border border-gray-200">
              <thead className="bg-gray-50 text-gray-700 font-semibold">
                <tr>
                  <th className="px-4 py-3 text-left">วันที่แจ้ง</th>
                  <th className="px-4 py-3 text-left">รายละเอียด</th>
                  <th className="px-4 py-3 text-left">สถานะ</th>
                  <th className="px-4 py-3 text-left">วันที่ซ่อม</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {repairs.map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{r.Request_date?.split('T')[0]}</td>
                    <td className="px-4 py-2">{r.Description}</td>
                    <td className="px-4 py-2">{statusBadge(r.Status)}</td>
                    <td className="px-4 py-2">{r.maintenance_date?.split('T')[0] || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">ยังไม่มีคำร้องแจ้งซ่อม</p>
        )}
      </div>
    </div>
  )
}

const InfoCard = ({ icon, label, value }) => (
  <div className="bg-white p-5 rounded-xl shadow text-center space-y-1">
    <div className="text-3xl">{icon}</div>
    <div className="text-lg font-semibold text-gray-700">{value}</div>
    <div className="text-sm text-gray-500">{label}</div>
  </div>
)

const CostCard = ({ icon, label, value }) => (
  <div className="bg-white p-5 rounded-xl shadow flex items-center space-x-4">
    <div className="text-2xl">{icon}</div>
    <div>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-lg font-semibold text-gray-700">{value}</div>
    </div>
  </div>
)

export default MyRoomDetails
