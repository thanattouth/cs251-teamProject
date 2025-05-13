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

  if (!repair) return <p>กำลังโหลด...</p>

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-10">
      <h2 className="text-xl font-bold mb-4">อัปเดตการซ่อม: ห้อง {repair.Room_ID}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">ค่าซ่อม (บาท)</label>
          <input
            type="number"
            className="w-full border p-2"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">รายละเอียดเพิ่มเติม</label>
          <textarea
            className="w-full border p-2"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit">
          ยืนยันซ่อมเสร็จสิ้น
        </button>
      </form>
    </div>
  )
}

export default CompleteRepairForm
