import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const WalkInForm = () => {
  const navigate = useNavigate()
  const [rooms, setRooms] = useState([])
  const [form, setForm] = useState({
    firstname: '', lastname: '', email: '', phone: '',
    ID_card_number: '', Room_ID: '', start_date: '', end_date: '', security_deposit: ''
  })

  useEffect(() => {
    axios.get('http://localhost:5000/api/room?status=empty')
      .then(res => setRooms(res.data))
      .catch(err => console.error('Error loading rooms:', err))
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...form,
        username: form.ID_card_number,
        password: form.ID_card_number
      }
      await axios.post('http://localhost:5000/api/lease/walkin', payload)
      alert('เพิ่มสัญญาเช่าแบบ Walk-in เรียบร้อยแล้ว')
      navigate('/admin/tenants')
    } catch (err) {
      console.error(err)
      alert('เกิดข้อผิดพลาดในการเพิ่มสัญญา')
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">เพิ่มสัญญาเช่า (Walk-in)</h2>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ข้อมูลผู้เช่า */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">ชื่อจริงของผู้เช่า</label>
            <input name="firstname" className="w-full rounded-xl border-gray-300 p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-300" value={form.firstname} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">นามสกุลของผู้เช่า</label>
            <input name="lastname" className="w-full rounded-xl border-gray-300 p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-300" value={form.lastname} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">อีเมล</label>
            <input type="email" name="email" className="w-full rounded-xl border-gray-300 p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-300" value={form.email} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">เบอร์โทรศัพท์</label>
            <input name="phone" className="w-full rounded-xl border-gray-300 p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-300" value={form.phone} onChange={handleChange} required />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-1">เลขบัตรประชาชน</label>
            <input name="ID_card_number" className="w-full rounded-xl border-gray-300 p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-300" value={form.ID_card_number} onChange={handleChange} required />
          </div>
        </div>

        {/* ห้องและวันที่ */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">เลือกห้อง</label>
            <select name="Room_ID" value={form.Room_ID} onChange={handleChange} required className="w-full rounded-xl border-gray-300 p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-300">
              <option value="">-- เลือกห้อง --</option>
              {rooms.map(room => (
                <option key={room.Room_ID} value={room.Room_ID}>{room.Room_ID}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">วันที่เริ่มต้น</label>
            <input name="start_date" type="date" className="w-full rounded-xl border-gray-300 p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-300" value={form.start_date} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">วันที่สิ้นสุด</label>
            <input name="end_date" type="date" className="w-full rounded-xl border-gray-300 p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-300" value={form.end_date} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">เงินประกัน (บาท)</label>
            <input name="security_deposit" type="number" className="w-full rounded-xl border-gray-300 p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-300" value={form.security_deposit} onChange={handleChange} required />
          </div>
        </div>

        <div className="pt-4">
          <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2 rounded-xl transition duration-200 shadow">
            บันทึกสัญญาเช่า
          </button>
        </div>
      </form>
    </div>
  )
}

export default WalkInForm
