import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const positionOptions = [
  { value: 'Manager', label: 'Manager' },
  { value: 'Technician', label: 'Technician' },
  { value: 'Housekeeper', label: 'Housekeeper' },
]

function AddEmployee() {
  const [form, setForm] = useState({
    ID_card_number: '',
    firstname: '',
    lastname: '',
    hire_date: '',
    position_type: '',
  })
  const [employeeId, setEmployeeId] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // เมื่อเลือกวันที่จ้างงาน จะขอ Employee_ID จาก backend
  const handleHireDateChange = async (e) => {
    const hire_date = e.target.value
    setForm({ ...form, hire_date })
    if (hire_date) {
      setLoading(true)
      try {
        const year = hire_date.slice(0, 4)
        const res = await axios.get(`http://localhost:5000/api/employee/count/${year}`)
        const nextSeq = String((res.data.count || 0) + 1).padStart(3, '0')
        setEmployeeId(`M${year}${nextSeq}`)
      } catch {
        setEmployeeId('')
      }
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post('http://localhost:5000/api/employee', form)
      alert(`เพิ่มพนักงานสำเร็จ! รหัสพนักงาน: ${res.data.Employee_ID}`)
      navigate('/admin/dashboard')
    } catch (err) {
      alert('เกิดข้อผิดพลาด')
    }
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">เพิ่มพนักงาน</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>วันที่เริ่มงาน: </label>
          <input
            type="date"
            name="hire_date"
            value={form.hire_date}
            onChange={handleHireDateChange}
            required
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label>รหัสพนักงาน: </label>
          <input
            value={employeeId}
            readOnly
            className="border p-2 w-full bg-gray-100"
          />
          {loading && <span className="text-sm text-gray-500">กำลังสร้างรหัส...</span>}
        </div>
        <div>
          <label>รหัสบัตรประชาชน: </label>
          <input
            name="ID_card_number"
            value={form.ID_card_number}
            onChange={handleChange}
            required
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label>ชื่อ: </label>
          <input
            name="firstname"
            value={form.firstname}
            onChange={handleChange}
            required
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label>นามสกุล: </label>
          <input
            name="lastname"
            value={form.lastname}
            onChange={handleChange}
            required
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label>ตำแหน่ง: </label>
          <select
            name="position_type"
            value={form.position_type}
            onChange={handleChange}
            required
            className="border p-2 w-full"
          >
            <option value="">เลือกตำแหน่ง</option>
            {positionOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          บันทึก
        </button>
      </form>
    </div>
  )
}

export default AddEmployee