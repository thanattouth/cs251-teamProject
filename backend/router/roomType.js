const express = require('express')
const pool = require('../config/connection')
const router = express.Router()

// GET all room types
router.get('/', async (req, res) => {
  try {
    const [roomTypes] = await pool.query('SELECT * FROM Room_Type')
    res.json(roomTypes)
  } catch (error) {
    console.error('Error fetching room types:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router