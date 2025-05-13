import React, { useState, useEffect } from 'react'
import axios from 'axios'

function FurnitureList() {
  const [furnitures, setFurnitures] = useState([])
  const [roomId, setRoomId] = useState('')
  const [furnitureSet, setFurnitureSet] = useState([])

  useEffect(() => {
    axios.get('/api/booking/furniture').then(res => setFurnitures(res.data))
  }, [])

  const handleRoomIdChange = (e) => {
    setRoomId(e.target.value)
    if (e.target.value) {
      axios.get(`/api/booking/furniture-set/${e.target.value}`)
        .then(res => setFurnitureSet(res.data))
        .catch(() => setFurnitureSet([]))
    } else {
      setFurnitureSet([])
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">รายการเฟอร์นิเจอร์</h1>
      <h2 className="text-lg font-semibold mb-2">ประเภทเฟอร์นิเจอร์ทั้งหมด</h2>
      <ul className="mb-6">
        {furnitures.map(f => (
          <li key={f.Furniture_ID}>{f.furniture_name}</li>
        ))}
      </ul>
      <div className="mb-4">
        <label>ดูเฟอร์นิเจอร์ในห้อง: </label>
        <input
          type="text"
          placeholder="Room ID"
          value={roomId}
          onChange={handleRoomIdChange}
          className="border p-2 ml-2"
        />
      </div>
      {furnitureSet.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-2">เฟอร์นิเจอร์ในห้อง {roomId}</h2>
          <ul>
            {furnitureSet.map(item => (
              <li key={item.furniture_ID}>
                {item.furniture_name} : {item.quantity} ชิ้น
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default FurnitureList