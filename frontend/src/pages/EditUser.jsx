import React, { useState, useEffect } from 'react'
import axios from 'axios'

const EditUser = ({ setAuth }) => {
  const [userData, setUserData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
  })
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user', {
          headers: { 'x-auth-token': localStorage.getItem('token') },
        })
        setUserData(response.data)
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }
    fetchUserData()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setUserData({ ...userData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.put('http://localhost:5000/api/user', userData, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      })

      alert('อัปเดตข้อมูลผู้ใช้สำเร็จ!')

      const updatedUser = {
        ...JSON.parse(localStorage.getItem('user')),
        First_Name: userData.firstname,
        Last_Name: userData.lastname,
        Email: userData.email,
        Phone: userData.phone,
      }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setAuth(true)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating user data:', error)
      alert('ไม่สามารถอัปเดตข้อมูลได้')
    }
  }

  return (
    <div className="flex mt-20 items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">ข้อมูลผู้ใช้</h2>

        {!isEditing ? (
          <div className="space-y-3 text-gray-700 text-sm">
            <p><span className="font-medium">ชื่อ:</span> {userData.firstname}</p>
            <p><span className="font-medium">นามสกุล:</span> {userData.lastname}</p>
            <p><span className="font-medium">อีเมล:</span> {userData.email}</p>
            <p><span className="font-medium">เบอร์โทร:</span> {userData.phone}</p>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              แก้ไขข้อมูล
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            {[
              { label: 'ชื่อ', name: 'firstname' },
              { label: 'นามสกุล', name: 'lastname' },
              { label: 'อีเมล', name: 'email', type: 'email' },
              { label: 'เบอร์โทร', name: 'phone' },
            ].map(({ label, name, type = 'text' }) => (
              <div key={name}>
                <label className="block mb-1 text-gray-600">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={userData[name]}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
            ))}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              บันทึกข้อมูล
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              ยกเลิก
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default EditUser
