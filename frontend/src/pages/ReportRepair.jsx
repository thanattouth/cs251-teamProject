import React, { useState } from 'react'
import axios from 'axios'

const ReportRepair = ({ user }) => {
  const [description, setDescription] = useState('')
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:5000/api/repair/request', {
        tenantId: user.Tenant_ID,
        description,
      })
      setSuccess('แจ้งซ่อมเรียบร้อยแล้ว')
      setDescription('')
    } catch (err) {
      setError(err.response?.data?.error || 'เกิดข้อผิดพลาด')
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">แจ้งซ่อมห้องพัก</h2>
      {success && <p className="text-green-600">{success}</p>}
      {error && <p className="text-red-600">{error}</p>}
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full border p-2 mb-4"
          rows="4"
          placeholder="รายละเอียดที่ต้องการแจ้งซ่อม"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
          ส่งแจ้งซ่อม
        </button>
      </form>
    </div>
  )
}

export default ReportRepair
