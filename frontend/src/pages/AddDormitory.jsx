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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add Dormitory</h1>
      <form onSubmit={handleAddDormitory} className="space-y-4">

        {/* ข้อมูลทั่วไปของหอพัก */}
        {Object.keys(formData).map((field) => (
          <div key={field}>
            <label className="block font-medium capitalize">{field.replace(/_/g, ' ')}</label>
            <input
              type={['Floor', 'RoomsPerFloor', 'Electric_bill', 'Water_bill', 'Cost'].includes(field) ? 'number' : 'text'}
              name={field}
              value={formData[field]}
              onChange={handleInputChange}
              className="border p-2 w-full"
              required
            />
          </div>
        ))}

        {/* ฟอร์มเฟอร์นิเจอร์ */}
        <div>
          <label className="block font-medium mb-1">เฟอร์นิเจอร์พื้นฐานในแต่ละห้อง</label>
          <div className="grid grid-cols-2 gap-2">
            {furnitureOptions.map(f => (
              <div key={f.Furniture_ID} className="flex items-center">
                <span className="w-1/2">{f.furniture_name}</span>
                <input
                  type="number"
                  min="0"
                  className="border p-1 w-20 ml-2"
                  value={furnitureQuantities[f.Furniture_ID] || ''}
                  onChange={(e) => handleFurnitureQuantityChange(e, f.Furniture_ID)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ปุ่ม */}
        <div className="flex space-x-4">
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
          <button type="button" onClick={() => navigate('/admin/dormitory')} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
        </div>
      </form>
    </div>
  )
}

export default AddDormitoryForm
