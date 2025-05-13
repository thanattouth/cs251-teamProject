import React, { useState, useEffect } from 'react'
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
  const [furnitureOptions, setFurnitureOptions] = useState([])
  const [furnitureQuantities, setFurnitureQuantities] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    axios.get('http://localhost:5000/api/furniture')
      .then(res => setFurnitureOptions(res.data))
      .catch(err => console.error('Error loading furniture:', err))
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleFurnitureQuantityChange = (e, id) => {
    const qty = parseInt(e.target.value)
    setFurnitureQuantities({ ...furnitureQuantities, [id]: isNaN(qty) ? 0 : qty })
  }

  const handleAddDormitory = (e) => {
    e.preventDefault()
    const FurnitureSet = Object.entries(furnitureQuantities)
      .filter(([_, qty]) => qty > 0)
      .map(([id, qty]) => ({ furniture_id: parseInt(id), quantity: qty }))
    const data = { ...formData, FurnitureSet }

    axios.post('http://localhost:5000/api/dormitory', data)
      .then(() => {
        alert('Dormitory added successfully!')
        navigate('/admin/dormitory')
      })
      .catch(error => console.error('Error adding dormitory:', error))
  }

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-2xl shadow-md">
      <h1 className="text-3xl font-semibold text-center mb-8 text-gray-800">เพิ่มข้อมูลหอพัก</h1>
      <form onSubmit={handleAddDormitory} className="space-y-6">

        {/* ข้อมูลทั่วไปของหอพัก */}
        {Object.keys(formData).map((field) => (
          <div key={field}>
            <label className="block text-gray-700 font-medium mb-1 capitalize">
              {field.replace(/_/g, ' ')}
            </label>
            <input
              type={['Floor', 'RoomsPerFloor', 'Electric_bill', 'Water_bill', 'Cost'].includes(field) ? 'number' : 'text'}
              name={field}
              value={formData[field]}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>
        ))}

        {/* เฟอร์นิเจอร์ */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">เฟอร์นิเจอร์พื้นฐานในแต่ละห้อง</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {furnitureOptions.map(f => (
              <div key={f.Furniture_ID} className="flex items-center justify-between border border-gray-200 rounded-lg p-3 bg-gray-50">
                <span className="text-gray-800">{f.furniture_name}</span>
                <input
                  type="number"
                  min="0"
                  value={furnitureQuantities[f.Furniture_ID] || ''}
                  onChange={(e) => handleFurnitureQuantityChange(e, f.Furniture_ID)}
                  className="w-20 px-2 py-1 border border-gray-300 rounded-md text-right"
                />
              </div>
            ))}
          </div>
        </div>


        {/* ปุ่ม */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/admin/dormitory')}
            className="px-5 py-2 rounded-xl border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 transition"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition"
          >
            บันทึก
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddDormitoryForm
