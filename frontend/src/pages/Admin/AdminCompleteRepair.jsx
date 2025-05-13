import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const CompleteRepairForm = () => {
  const { requestId } = useParams()
  const [cost, setCost] = useState('')
  const [description, setDescription] = useState('')
  const [repair, setRepair] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    axios.get(`http://localhost:5000/api/repair/all`)
      .then(res => {
        const found = res.data.find(r => r.Request_ID === parseInt(requestId))
        if (found) setRepair(found)
      })
      .catch(err => console.error(err))
  }, [requestId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`http://localhost:5000/api/repair/complete`, {
        requestId,
        cost,
        description,
        employeeId: repair?.technician_id // เพิ่มไว้ล่วงหน้าหากต้องการ
      })
      alert('อัปเดตสำเร็จ')
      navigate('/admin/repairs')
    } catch (err) {
      alert('เกิดข้อผิดพลาด')
    }
  }

  if (!repair) return (
    <div className="text-center text-gray-500 py-10">กำลังโหลดข้อมูล...</div>
  )

  return (
    <div className="max-w-xl mx-auto mt-12 bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        อัปเดตการซ่อม: ห้อง {repair.Room_ID}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ค่าซ่อม (บาท)
          </label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            รายละเอียดเพิ่มเติม
          </label>
          <textarea
            rows="4"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
          >
            ยืนยันซ่อมเสร็จสิ้น
          </button>
        </div>
      </form>
    </div>
  )

}

export default CompleteRepairForm
