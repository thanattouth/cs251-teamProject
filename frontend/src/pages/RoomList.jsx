import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

const RoomList = () => {
  const { Dormitory_ID } = useParams()
  const [rooms, setRooms] = useState([])
  const [dormitory, setDormitory] = useState({}) // เก็บข้อมูล Dormitory
  const [filterFloor, setFilterFloor] = useState('') // สถานะการกรองชั้น

  useEffect(() => {
    // Fetch dormitory details
    axios
      .get(`http://localhost:5000/api/dormitory/${Dormitory_ID}`)
      .then((response) => setDormitory(response.data))
      .catch((error) => console.error('Error fetching dormitory details:', error))

    // Fetch rooms for the selected dormitory
    axios
      .get(`http://localhost:5000/api/dormitory/${Dormitory_ID}/rooms`)
      .then((response) => setRooms(response.data))
      .catch((error) => console.error('Error fetching rooms:', error))
  }, [Dormitory_ID])

  // Function to determine background color based on room status
  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100'
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800'
      case 'booked':
        return 'bg-blue-100 text-blue-800'
      case 'rented':
      case 'unavailable':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Function to translate status to Thai
  const translateStatus = (status) => {
    if (!status) return 'ไม่ทราบสถานะ'
    switch (status.toLowerCase()) {
      case 'available':
        return 'ว่าง'
      case 'booked':
        return 'จอง'
      case 'rented':
        return 'มีผู้พักอาศัย'
      case 'unavailable':
        return 'ไม่พร้อมใช้งาน'
      default:
        return 'ไม่ทราบสถานะ'
    }
  }

  // Function to translate room type to Thai
  const translateRoomType = (roomType) => {
    if (!roomType) return 'ไม่ทราบประเภท'
    switch (roomType.toLowerCase().trim()) {
      case 'single':
        return 'ห้องเดี่ยว'
      case 'double':
        return 'ห้องคู่'
      default:
        return 'ไม่ทราบประเภท'
    }
  }

  // Filter rooms by floor
  const filteredRooms = filterFloor
    ? rooms.filter((room) => room.Floor === parseInt(filterFloor))
    : rooms

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Rooms in Dormitory: {dormitory.Name || 'Loading...'}</h1>

      {/* Dormitory Details */}
      <div className="mb-6">
        <p><strong>ที่ตั้ง :</strong> {dormitory.Location || 'N/A'}</p>
        <p><strong>จำนวนชั้น :</strong> {dormitory.Floor || 'N/A'}</p>
        <p><strong>จำนวนห้องต่อชั้น :</strong> {dormitory.RoomsPerFloor || 'N/A'}</p>
        <p><strong>ค่าไฟฟ้า/หน่วย :</strong> {dormitory.Electric_bill || 'N/A'} บาท/หน่วย</p>
        <p><strong>ค่าน้ำเหมา/เดือน :</strong> {dormitory.Water_bill || 'N/A'} บาท/หน่วย</p>
      </div>

      {/* Filter by Floor */}
      <div className="mb-4">
        <label htmlFor="floorFilter" className="block font-medium mb-2">
          Filter by Floor
        </label>
        <select
          id="floorFilter"
          value={filterFloor}
          onChange={(e) => setFilterFloor(e.target.value)}
          className="border p-2 rounded w-full md:w-1/3"
        >
          <option value="">All Floors</option>
          {[...new Set(rooms.map((room) => room.Floor))].map((floor) => (
            <option key={floor} value={floor}>
              Floor {floor}
            </option>
          ))}
        </select>
      </div>

      {Array.isArray(filteredRooms) && filteredRooms.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">เลขห้อง</th>
              <th className="border border-gray-300 px-4 py-2">ชั้น</th>
              {/* <th className="border border-gray-300 px-4 py-2">ห้องที่</th> */}
              <th className="border border-gray-300 px-4 py-2">ประเภทห้อง</th>
              <th className="border border-gray-300 px-4 py-2">สถานะ</th>
              <th className="border border-gray-300 px-4 py-2">ราคา</th>
            </tr>
          </thead>
          <tbody>
            {filteredRooms.map((room) => (
              <tr key={room.Room_ID} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{room.Room_ID}</td>
                <td className="border border-gray-300 px-4 py-2">{room.Floor}</td>
                {/* <td className="border border-gray-300 px-4 py-2">{room.room_number}</td> */}
                <td className="border border-gray-300 px-4 py-2">{translateRoomType(room.Room_type)}</td>
                <td
                  className={`border border-gray-300 px-4 py-2 ${getStatusColor(room.status)}`}
                >
                  {translateStatus(room.status)}
                </td>
                <td className="border border-gray-300 px-4 py-2">{room.Cost}</td>
              </tr>
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