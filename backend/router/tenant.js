const express = require('express')
const pool = require('../config/connection')
const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT Tenant_ID, firstname, lastname, email, phone, move_in_date, current_room_id 
       FROM Tenant ORDER BY Tenant_ID ASC`
    )
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})


module.exports = router