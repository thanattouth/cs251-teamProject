import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const ReportRepair = ({ user }) => {
  const [description, setDescription] = useState('')
  const [maintenanceDate, setMaintenanceDate] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:5000/api/repair/request', {
        tenantId: user.Tenant_ID,
        description,
        maintenanceDate,
      })
      alert('แจ้งซ่อมสำเร็จ')
      navigate('/my-repairs')
    } catch (err) {
      setError(err.response?.data?.error || 'เกิดข้อผิดพลาดในการแจ้งซ่อม')
    }
  }

  return (
    <div className="max-w-lg mx-auto mt-20 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">แจ้งซ่อมห้องพัก</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">รายละเอียด</label>
          <textarea
            className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows="4"
            placeholder="รายละเอียดที่ต้องการแจ้งซ่อม"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">วันที่ต้องการซ่อม</label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={maintenanceDate}
            onChange={(e) => setMaintenanceDate(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
        >
          ส่งแจ้งซ่อม
        </button>
      </form>
    </div>
  )
}

export default ReportRepair
