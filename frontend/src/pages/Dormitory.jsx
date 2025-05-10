import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Dormitory = () => {
  const [dormitories, setDormitories] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    // Fetch existing dormitories
    axios
      .get('http://localhost:5000/api/dormitory')
      .then((response) => {
        console.log('Dormitories fetched:', response.data) // ตรวจสอบข้อมูลที่ได้รับ
        setDormitories(response.data)
      })
      .catch((error) => console.error('Error fetching dormitories:', error))
  }, [])

  const handleDormitoryClick = (dormitoryId) => {
    navigate(`/admin/dormitory/${dormitoryId}/rooms`)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dormitory Management</h1>

      {/* Display Dormitories */}
      {Array.isArray(dormitories) && dormitories.length > 0 ? (
        <ul className="mb-6">
          {dormitories.map((dorm) => (
            <li
              key={dorm.Dormitory_ID}
              className="border p-2 mb-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleDormitoryClick(dorm.Dormitory_ID)}
            >
              {dorm.Name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-6">No dormitories available.</p>
      )}

      {/* Add Dormitory Button */}
      <button
        onClick={() => navigate('/admin/add-dormitory')}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Dormitory
      </button>
    </div>
  )
}

export default Dormitory