const express = require('express')
const auth = require('../middleware/auth')
const pool = require('../config/connection')
const router = express.Router()

// Get user information
router.get('/', auth, async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT firstname, lastname, email, phone FROM Tenant WHERE Tenant_ID = ?', [req.user])
      if (rows.length === 0) return res.status(404).json({ error: 'User not found' })
      res.json(rows[0])
    } catch (error) {
      console.error('Error fetching user data:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  })

// Update user information
router.put('/', auth, async (req, res) => {
  const { firstname, lastname, email, phone } = req.body
  try {
    await pool.query(
      'UPDATE Tenant SET firstname = ?, lastname = ?, email = ?, phone = ? WHERE Tenant_ID = ?',
      [firstname, lastname, email, phone, req.user]
    )
    res.json({ message: 'User information updated successfully' })
  } catch (error) {
    console.error('Error updating user data:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router