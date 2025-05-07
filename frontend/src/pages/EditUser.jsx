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
    // Fetch user data from the backend
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
      const response = await axios.put('http://localhost:5000/api/user', userData, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      })
      alert('User information updated successfully!')

      // Update localStorage and Navbar state
      const updatedUser = {
        ...JSON.parse(localStorage.getItem('user')),
        First_Name: userData.firstname,
        Last_Name: userData.lastname,
        Email: userData.email,
        Phone: userData.phone,
      }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setAuth(true) // Trigger Navbar to re-render with updated user data

      setIsEditing(false)
    } catch (error) {
      console.error('Error updating user data:', error)
      alert('Failed to update user information.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">User Information</h2>
        {!isEditing ? (
          <div>
            <p><strong>First Name:</strong> {userData.firstname}</p>
            <p><strong>Last Name:</strong> {userData.lastname}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Phone:</strong> {userData.phone}</p>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-900"
            >
              Edit Information
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">First Name</label>
              <input
                type="text"
                name="firstname"
                value={userData.firstname}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastname"
                value={userData.lastname}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Phone</label>
              <input
                type="text"
                name="phone"
                value={userData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-900"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="mt-2 w-full bg-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default EditUser