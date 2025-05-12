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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Rooms in Dormitory: {dormitory.Name || 'Loading...'}</h1>

      <div className="mb-6">
        <p><strong>ที่ตั้ง :</strong> {dormitory.Location || 'N/A'}</p>
        <p><strong>จำนวนชั้น :</strong> {dormitory.Floor || 'N/A'}</p>
        <p><strong>จำนวนห้องต่อชั้น :</strong> {dormitory.RoomsPerFloor || 'N/A'}</p>
        <p><strong>ค่าไฟฟ้า/หน่วย :</strong> {dormitory.Electric_bill || 'N/A'} บาท</p>
        <p><strong>ค่าน้ำเหมา/เดือน :</strong> {dormitory.Water_bill || 'N/A'} บาท</p>
      </div>

      <div className="mb-4">
        <label htmlFor="floorFilter" className="block font-medium mb-2">Filter by Floor</label>
        <select
          id="floorFilter"
          value={filterFloor}
          onChange={(e) => setFilterFloor(e.target.value)}
          className="border p-2 rounded w-full md:w-1/3"
        >
          <option value="">All Floors</option>
          {[...new Set(rooms.map((r) => r.Floor))].map((floor) => (
            <option key={floor} value={floor}>ชั้น {floor}</option>
          ))}
        </select>
      </div>

      {filteredRooms.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">เลขห้อง</th>
              <th className="border border-gray-300 px-4 py-2">ชั้น</th>
              <th className="border border-gray-300 px-4 py-2">ประเภทห้อง</th>
              <th className="border border-gray-300 px-4 py-2">สถานะ</th>
              <th className="border border-gray-300 px-4 py-2">ราคา</th>
            </tr>
          </thead>
          <tbody>
            {filteredRooms.map((room) => (
              <React.Fragment key={room.Room_ID}>
                <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => handleToggleDetails(room.Room_ID)}>
                  <td className="border px-4 py-2 text-blue-600 underline">{room.Room_ID}</td>
                  <td className="border px-4 py-2">{room.Floor}</td>
                  <td className="border px-4 py-2">{translateRoomType(getRoomTypeName(room.room_type_id))}</td>
                  <td className={`border px-4 py-2 ${getStatusColor(room.status)}`}>{translateStatus(room.status)}</td>
                  <td className="border px-4 py-2">{room.Cost}</td>
                </tr>

                {openedRoomId === room.Room_ID && (
                  <tr>
                    <td colSpan={5} className="border-t bg-gray-50 p-4">
                      {roomDetails[room.Room_ID] ? (
                        <div>
                          {roomDetails[room.Room_ID].tenant ? (
                            <div className="mb-2">
                              👤 <strong>ผู้เข้าพัก:</strong> {roomDetails[room.Room_ID].tenant.firstname} {roomDetails[room.Room_ID].tenant.lastname} <br />
                              📧 {roomDetails[room.Room_ID].tenant.email} <br />
                              📞 {roomDetails[room.Room_ID].tenant.phone}
                            </div>
                          ) : (
                            <p className="italic text-gray-600">ยังไม่มีผู้เข้าพัก</p>
                          )}

                          <strong>🛋 เฟอร์นิเจอร์ในห้อง:</strong>
                          <ul className="list-disc ml-5 mt-1">
                            {roomDetails[room.Room_ID].furniture.length > 0 ? (
                              roomDetails[room.Room_ID].furniture.map((f, idx) => (
                                <li key={idx}>{f.furniture_name} × {f.quantity}</li>
                              ))
                            ) : (
                              <li className="italic text-gray-600">ไม่มีข้อมูลเฟอร์นิเจอร์</li>
                            )}
                          </ul>
                        </div>
                      ) : (
                        <p>กำลังโหลดข้อมูล...</p>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="mb-6">No rooms available.</p>
      )}
    </div>
  )
}

export default RoomList
