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
    <div className="p-8 max-w-xl mx-auto bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">เพิ่มพนักงานใหม่</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">วันที่เริ่มงาน</label>
          <input
            type="date"
            name="hire_date"
            value={form.hire_date}
            onChange={handleHireDateChange}
            required
            className="w-full rounded-lg border-gray-300 p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">รหัสพนักงาน</label>
          <input
            value={employeeId}
            readOnly
            className="w-full bg-gray-100 rounded-lg border border-gray-300 p-2 text-gray-600"
          />
          {loading && <p className="text-sm text-gray-400 mt-1">กำลังสร้างรหัส...</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">เลขบัตรประชาชน</label>
          <input
            name="ID_card_number"
            value={form.ID_card_number}
            onChange={handleChange}
            required
            className="w-full rounded-lg border-gray-300 p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ</label>
          <input
            name="firstname"
            value={form.firstname}
            onChange={handleChange}
            required
            className="w-full rounded-lg border-gray-300 p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">นามสกุล</label>
          <input
            name="lastname"
            value={form.lastname}
            onChange={handleChange}
            required
            className="w-full rounded-lg border-gray-300 p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ตำแหน่ง</label>
          <select
            name="position_type"
            value={form.position_type}
            onChange={handleChange}
            required
            className="w-full rounded-lg border-gray-300 p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
          >
            <option value="">เลือกตำแหน่ง</option>
            {positionOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white px-6 py-2 rounded-xl font-medium shadow-md transition"
          >
            บันทึกข้อมูลพนักงาน
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddEmployee
