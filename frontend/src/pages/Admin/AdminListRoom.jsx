import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

const RoomList = () => {
  const { Dormitory_ID } = useParams()
  const [rooms, setRooms] = useState([])
  const [dormitory, setDormitory] = useState({})
  const [filterFloor, setFilterFloor] = useState('')
  const [roomTypes, setRoomTypes] = useState([])
  const [openedRoomId, setOpenedRoomId] = useState(null)
  const [roomDetails, setRoomDetails] = useState({})

  useEffect(() => {
    axios.get(`http://localhost:5000/api/dormitory/${Dormitory_ID}`)
      .then((res) => setDormitory(res.data))
      .catch((err) => console.error('Error fetching dormitory:', err))

    axios.get(`http://localhost:5000/api/dormitory/${Dormitory_ID}/rooms`)
      .then((res) => setRooms(res.data))
      .catch((err) => console.error('Error fetching rooms:', err))

    axios.get('http://localhost:5000/api/room-types')
      .then((res) => setRoomTypes(res.data))
      .catch((err) => console.error('Error fetching room types:', err))
  }, [Dormitory_ID])

  const getStatusColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'empty': return 'bg-green-100 text-green-800'
      case 'reserved': return 'bg-blue-100 text-blue-800'
      case 'occupied': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const translateStatus = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'empty': return 'ว่าง'
      case 'reserved': return 'จอง'
      case 'occupied': return 'มีผู้พักอาศัย'
      default: return 'ไม่ทราบสถานะ'
    }
  }

  const translateRoomType = (type) => {
    switch ((type || '').toLowerCase().trim()) {
      case 'single': return 'ห้องเดี่ยว'
      case 'double': return 'ห้องคู่'
      default: return 'ไม่ทราบประเภท'
    }
  }

  const getRoomTypeName = (typeId) => {
    const found = roomTypes.find((t) => t.Type_ID === typeId)
    return found ? found.Type_name : ''
  }

  const handleToggleDetails = async (roomId) => {
    if (openedRoomId === roomId) {
      setOpenedRoomId(null)
    } else {
      try {
        const res = await axios.get(`http://localhost:5000/api/room/${roomId}/details`)
        setRoomDetails((prev) => ({ ...prev, [roomId]: res.data }))
        setOpenedRoomId(roomId)
      } catch (err) {
        console.error('Error fetching room details:', err)
      }
    }
  }

  const filteredRooms = filterFloor
    ? rooms.filter((room) => room.Floor === parseInt(filterFloor))
    : rooms

  return (
    <div className="p-8 max-w-7xl mx-auto bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        ห้องทั้งหมดในหอพัก: <span className="text-emerald-600">{dormitory.Name || 'กำลังโหลด...'}</span>
      </h1>

      <div className="mb-6 text-gray-700 space-y-1 text-sm">
        <p><strong>📍 ที่ตั้ง:</strong> {dormitory.Location || 'N/A'}</p>
        <p><strong>🏬 จำนวนชั้น:</strong> {dormitory.Floor || 'N/A'} | <strong>ห้อง/ชั้น:</strong> {dormitory.RoomsPerFloor || 'N/A'}</p>
        <p><strong>⚡ ค่าไฟ:</strong> {dormitory.Electric_bill || 'N/A'} บาท/หน่วย | <strong>💧 ค่าน้ำ:</strong> {dormitory.Water_bill || 'N/A'} บาท/เดือน</p>
      </div>

      <div className="mb-6">
        <label htmlFor="floorFilter" className="block text-sm font-medium text-gray-700 mb-2">กรองตามชั้น</label>
        <select
          id="floorFilter"
          value={filterFloor}
          onChange={(e) => setFilterFloor(e.target.value)}
          className="w-full md:w-1/4 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 p-2"
        >
          <option value="">แสดงทุกชั้น</option>
          {[...new Set(rooms.map((r) => r.Floor))].map((floor) => (
            <option key={floor} value={floor}>ชั้น {floor}</option>
          ))}
        </select>
      </div>

      {filteredRooms.length > 0 ? (
        <div className="overflow-x-auto border rounded-xl shadow-sm">
          <table className="min-w-full text-sm text-gray-700 divide-y divide-gray-100">
            <thead className="bg-gray-50 text-xs text-gray-600 uppercase">
              <tr>
                <th className="px-4 py-3 text-left">เลขห้อง</th>
                <th className="px-4 py-3 text-left">ชั้น</th>
                <th className="px-4 py-3 text-left">ประเภท</th>
                <th className="px-4 py-3 text-left">สถานะ</th>
                <th className="px-4 py-3 text-left">ราคา</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredRooms.map((room) => (
                <React.Fragment key={room.Room_ID}>
                  <tr
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleToggleDetails(room.Room_ID)}
                  >
                    <td className="px-4 py-3 text-blue-600 underline">{room.Room_ID}</td>
                    <td className="px-4 py-3">{room.Floor}</td>
                    <td className="px-4 py-3">{translateRoomType(getRoomTypeName(room.room_type_id))}</td>
                    <td className={`px-4 py-3 rounded ${getStatusColor(room.status)} font-medium`}>
                      {translateStatus(room.status)}
                    </td>
                    <td className="px-4 py-3">{room.Cost} บาท</td>
                  </tr>

                  {openedRoomId === room.Room_ID && (
                    <tr>
                      <td colSpan={5} className="bg-gray-50 p-4">
                        {roomDetails[room.Room_ID] ? (
                          <div className="space-y-2 text-sm text-gray-700">
                            {roomDetails[room.Room_ID].tenant ? (
                              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                <p><strong>👤 ผู้เข้าพัก:</strong> {roomDetails[room.Room_ID].tenant.firstname} {roomDetails[room.Room_ID].tenant.lastname}</p>
                                <p><strong>📧 อีเมล:</strong> {roomDetails[room.Room_ID].tenant.email}</p>
                                <p><strong>📞 เบอร์:</strong> {roomDetails[room.Room_ID].tenant.phone}</p>
                              </div>
                            ) : (
                              <p className="italic text-gray-500">ยังไม่มีผู้เข้าพัก</p>
                            )}

                            <div className="mt-3">
                              <strong>🪑 เฟอร์นิเจอร์ในห้อง:</strong>
                              <ul className="list-disc ml-6 mt-1 text-gray-600">
                                {roomDetails[room.Room_ID].furniture.length > 0 ? (
                                  roomDetails[room.Room_ID].furniture.map((f, idx) => (
                                    <li key={idx}>{f.furniture_name} × {f.quantity}</li>
                                  ))
                                ) : (
                                  <li className="italic">ไม่มีข้อมูลเฟอร์นิเจอร์</li>
                                )}
                              </ul>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">กำลังโหลดข้อมูล...</p>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 mt-6">ไม่มีห้องในชั้นนี้</p>
      )}
    </div>
  )
}

export default RoomList
