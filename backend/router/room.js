const express = require('express')
const pool = require('../config/connection')
const router = express.Router()

// ดึงห้องว่างทั้งหมด
router.get('/', async (req, res) => {
  const { status } = req.query
  try {
    let sql = 'SELECT * FROM Room'
    let params = []
    if (status) {
      sql += ' WHERE status = ?'
      params.push(status)
    }
    const [rows] = await pool.query(sql, params)
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// ดึงข้อมูลผู้เข้าพักหรือผู้จอง + เฟอร์นิเจอร์
router.get('/:room_id/details', async (req, res) => {
  const { room_id } = req.params
  try {
    let tenant = null

    const [[currentTenant]] = await pool.query(
      'SELECT firstname, lastname, email, phone FROM Tenant WHERE current_room_id = ?',
      [room_id]
    )

    if (currentTenant) {
      tenant = currentTenant
    } else {
      const [[booking]] = await pool.query(
        `SELECT t.firstname, t.lastname, t.email, t.phone
         FROM Booking b
         JOIN Tenant t ON b.Tenant_ID = t.Tenant_ID
         WHERE b.Room_ID = ? AND b.booking_status = 'confirmed'
         ORDER BY b.check_in_date ASC LIMIT 1`,
        [room_id]
      )
      if (booking) tenant = booking
    }

    const [furniture] = await pool.query(
      `SELECT fs.quantity, f.furniture_name 
       FROM Furniture_Set fs
       JOIN Furniture f ON fs.furniture_ID = f.Furniture_ID
       WHERE fs.Room_ID = ?`,
      [room_id]
    )

    res.json({ tenant: tenant || null, furniture })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router