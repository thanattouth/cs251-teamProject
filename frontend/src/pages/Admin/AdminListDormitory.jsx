import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const AdminListDormitory = () => {
  const [dormitories, setDormitories] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/dormitory')
      .then((response) => {
        setDormitories(response.data)
      })
      .catch((error) => console.error('Error fetching dormitories:', error))
  }, [])

  const handleDormitoryClick = (dormitoryId) => {
    navigate(`/admin/dormitory/${dormitoryId}/rooms`)
  }

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded-2xl shadow-md">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">จัดการหอพักทั้งหมด</h1>

      {/* รายการหอพัก */}
      {Array.isArray(dormitories) && dormitories.length > 0 ? (
        <ul className="space-y-4 mb-6">
          {dormitories.map((dorm) => (
            <li
              key={dorm.Dormitory_ID}
              onClick={() => handleDormitoryClick(dorm.Dormitory_ID)}
              className="p-4 border border-gray-200 rounded-xl shadow-sm bg-gray-50 hover:bg-gray-100 cursor-pointer transition"
            >
              <span className="text-gray-800 font-medium text-lg">{dorm.Name}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 mb-6">ไม่มีข้อมูลหอพัก</p>
      )}

      {/* ปุ่มเพิ่มหอพัก */}
      <button
        onClick={() => navigate('/admin/add-dormitory')}
        className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-xl transition shadow"
      >
        เพิ่มหอพักใหม่
      </button>
    </div>
  )
}

export default AdminListDormitory
