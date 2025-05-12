import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const WalkInForm = () => {
  const navigate = useNavigate()
  const [rooms, setRooms] = useState([])
  const [form, setForm] = useState({
    firstname: '', lastname: '', email: '', phone: '',
    ID_card_number: '', Room_ID: '', start_date: '', end_date: ''
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
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">เพิ่มสัญญาเช่า (Walk-in)</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ข้อมูลผู้เช่า */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">ชื่อจริงของผู้เช่า</label>
            <input name="firstname" className="border p-2 w-full" value={form.firstname} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">นามสกุลของผู้เช่า</label>
            <input name="lastname" className="border p-2 w-full" value={form.lastname} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">อีเมล เช่น example@mail.com</label>
            <input name="email" className="border p-2 w-full" value={form.email} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">เบอร์โทรศัพท์ เช่น 0812345678</label>
            <input name="phone" className="border p-2 w-full" value={form.phone} onChange={handleChange} required />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">เลขบัตรประชาชน 13 หลัก</label>
            <input name="ID_card_number" className="border p-2 w-full" value={form.ID_card_number} onChange={handleChange} required />
          </div>
        </div>

        {/* ห้องและวันที่ */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">เลือกห้องว่างที่จะเช่า</label>
            <select name="Room_ID" value={form.Room_ID} onChange={handleChange} required className="border p-2 w-full">
              <option value="">-- เลือกห้อง --</option>
              {rooms.map(room => (
                <option key={room.Room_ID} value={room.Room_ID}>{room.Room_ID}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">วันที่เริ่มต้นการเช่า</label>
            <input name="start_date" type="date" className="border p-2 w-full" value={form.start_date} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">วันที่สิ้นสุดการเช่า</label>
            <input name="end_date" type="date" className="border p-2 w-full" value={form.end_date} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">เงินประกัน (บาท)</label>
            <input name="security_deposit" type="number" className="border p-2 w-full" value={form.security_deposit} onChange={handleChange} required />
          </div>
        </div>

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">บันทึกสัญญาเช่า</button>
      </form>
    </div>
  )
}

export default WalkInForm
