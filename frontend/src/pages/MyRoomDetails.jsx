import React, { useEffect, useState } from 'react'
import axios from 'axios'

const MyRoomDetails = ({ user }) => {
  const [roomData, setRoomData] = useState(null)
  const [error, setError] = useState(null)
  const [repairs, setRepairs] = useState([])

  useEffect(() => {
    if (!user?.Tenant_ID) return

    axios.get(`http://localhost:5000/api/room/tenant/${user.Tenant_ID}/room-details`)
      .then(res => setRoomData(res.data))
      .catch(err => {
        console.error('Error loading room details:', err)
        setError('ไม่สามารถโหลดข้อมูลห้องได้')
      })
    axios.get(`http://localhost:5000/api/repair/user/${user.Tenant_ID}`)
      .then(res => setRepairs(res.data))
      .catch(err => {
        console.error('Error loading repair requests:', err)
      })
  }, [user])

  if (error) {
    return <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow text-red-600">{error}</div>
  }

  if (!roomData) {
    return <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow">กำลังโหลดข้อมูล...</div>
  }

  const { room, furniture } = roomData

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">ข้อมูลห้องพักของฉัน</h2>

      <table className="w-full table-auto border mb-6 text-center">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">เลขห้อง</th>
            <th className="border px-4 py-2">ชั้น</th>
            <th className="border px-4 py-2">หอพัก</th>
            {/* <th className="border px-4 py-2">ราคา</th> */}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2">{room.Room_ID}</td>
            <td className="border px-4 py-2">{room.Floor}</td>
            <td className="border px-4 py-2">{room.dormitory_name}</td>
            {/* <td className="border px-4 py-2">{room.Cost} บาท</td> */}
          </tr>
        </tbody>
      </table>
      <div className="mb-6 space-y-2 text-gray-700">
        <p><strong>ค่าเช่ารายเดือน:</strong> {room.Cost} บาท</p>
        <p><strong>ค่าน้ำหน่วยละ:</strong> {room.water_rate ?? '-'} บาท</p>
        <p><strong>ค่าไฟหน่วยละ:</strong> {room.electric_rate ?? '-'} บาท</p>
      </div>
      <h3 className="text-lg font-semibold mb-2">รายการเฟอร์นิเจอร์ในห้อง</h3>
      {furniture.length > 0 ? (
        <ul className="list-disc pl-6 text-gray-700">
          {furniture.map((item, idx) => (
            <li key={idx}>
              {item.furniture_name} จำนวน {item.quantity}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">ไม่มีรายการเฟอร์นิเจอร์</p>
      )}
      <h3 className="text-lg font-semibold mt-8 mb-2">คำร้องแจ้งซ่อมของห้องนี้</h3>
      {repairs.length > 0 ? (
        <table className="w-full table-auto border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">วันที่แจ้ง</th>
              <th className="border px-2 py-1">รายละเอียด</th>
              <th className="border px-2 py-1">สถานะ</th>
              <th className="border px-2 py-1">วันที่ซ่อม</th>
            </tr>
          </thead>
          <tbody>
            {repairs.map((r, idx) => (
              <tr key={idx}>
                <td className="border px-2 py-1">{r.Request_date?.split('T')[0]}</td>
                <td className="border px-2 py-1">{r.Description}</td>
                <td className="border px-2 py-1">{r.Status}</td>
                <td className="border px-2 py-1">{r.maintenance_date?.split('T')[0] || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600">ยังไม่มีคำร้องแจ้งซ่อมสำหรับห้องนี้</p>
      )}
    </div>
  )
}

export default MyRoomDetails
