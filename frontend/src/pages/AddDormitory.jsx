import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const AddDormitoryForm = () => {
  const [formData, setFormData] = useState({
    Dormitory_ID: '',
    Name: '',
    Location: '',
    Floor: '',
    RoomsPerFloor: '',
    Electric_bill: '',
    Water_bill: '',
    Cost: '',
  })
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleAddDormitory = (e) => {
    e.preventDefault()
    axios
      .post('http://localhost:5000/api/dormitory', formData)
      .then(() => {
        alert('Dormitory added successfully!')
        navigate('/admin/dormitory')
      })
      .catch((error) => console.error('Error adding dormitory:', error))
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add Dormitory</h1>
      <form onSubmit={handleAddDormitory} className="mt-4 space-y-4">
        <div>
          <label className="block font-medium">Dormitory ID</label>
          <input
            type="text"
            name="Dormitory_ID"
            value={formData.Dormitory_ID}
            onChange={handleInputChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block font-medium">ชื่ออาคาร</label>
          <input
            type="text"
            name="Name"
            value={formData.Name}
            onChange={handleInputChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block font-medium">ที่ตั้ง</label>
          <input
            type="text"
            name="Location"
            value={formData.Location}
            onChange={handleInputChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block font-medium">จำนวนชั้น</label>
          <input
            type="number"
            name="Floor"
            value={formData.Floor}
            onChange={handleInputChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block font-medium">จำนวนห้องต่อชั้น</label>
          <input
            type="number"
            name="RoomsPerFloor"
            value={formData.RoomsPerFloor}
            onChange={handleInputChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block font-medium">ค่าไฟฟ้า/หน่วย</label>
          <input
            type="number"
            name="Electric_bill"
            value={formData.Electric_bill}
            onChange={handleInputChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block font-medium">ค่าน้ำเหมา/เดือน</label>
          <input
            type="number"
            name="Water_bill"
            value={formData.Water_bill}
            onChange={handleInputChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block font-medium">ราคาห้อง</label>
          <input
            type="number"
            name="Cost"
            value={formData.Cost}
            onChange={handleInputChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div className="flex space-x-4">
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
            Save
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/dormitory')}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddDormitoryForm