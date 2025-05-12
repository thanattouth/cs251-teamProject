const express = require('express')
const pool = require('../config/connection')
const router = express.Router()

// ดึงประเภทเฟอร์นิเจอร์ทั้งหมด
router.get('/furniture', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Furniture')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ดึงเฟอร์นิเจอร์ในห้อง
router.get('/furniture-set/:room_id', async (req, res) => {
  const { room_id } = req.params
  try {
    const [rows] = await pool.query(
      `SELECT fs.*, f.furniture_name 
       FROM Furniture_Set fs 
       JOIN Furniture f ON fs.furniture_ID = f.Furniture_ID 
       WHERE fs.Room_ID = ?`,
      [room_id]
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router