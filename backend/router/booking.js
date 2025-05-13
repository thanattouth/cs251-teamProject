const express = require('express')
const pool = require('../config/connection')
const router = express.Router()

// เพิ่มการจองใหม่ (จากผู้ใช้)
// สร้าง booking
router.post('/', async (req, res) => {
  const { Tenant_ID, Room_ID, check_in_date, check_out_date } = req.body
  if (!Tenant_ID || !Room_ID || !check_in_date || !check_out_date) {
    return res.status(400).json({ error: 'Missing required fields' })
  }
  try {
    await pool.query(
      `INSERT INTO Booking (Tenant_ID, Room_ID, check_in_date, check_out_date, booking_status, booking_type, booking_date)
       VALUES (?, ?, ?, ?, 'pending', 'advance', CURDATE())`,
      [Tenant_ID, Room_ID, check_in_date, check_out_date]
    )
    res.status(201).json({ message: 'Booking created' })
  } catch (error) {
    console.error('Booking error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})


// ดึง bookings ทั้งหมด หรือ filter ตามสถานะและวันที่
router.get('/', async (req, res) => {
  const { status, check_in_date } = req.query
  try {
    let sql = 'SELECT * FROM Booking'
    let params = []
    const conditions = []

    if (status) {
      conditions.push('booking_status = ?')
      params.push(status)
    }
    if (check_in_date) {
      conditions.push('DATE(check_in_date) = ?')
      params.push(check_in_date)
    }
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ')
    }
    sql += ' ORDER BY Booking_ID DESC'

    const [rows] = await pool.query(sql, params)
    res.json(rows)
  } catch (error) {
    console.error('Get bookings error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// ยืนยัน booking
router.put('/:id/confirm', async (req, res) => {
  try {
    const [[booking]] = await pool.query(
      'SELECT Room_ID FROM Booking WHERE Booking_ID = ?',
      [req.params.id]
    )
    if (!booking) return res.status(404).json({ error: 'Booking not found' })

    await pool.query(
      'UPDATE Booking SET booking_status = "confirmed" WHERE Booking_ID = ?',
      [req.params.id]
    )
    await pool.query(
      'UPDATE Room SET status = "reserved" WHERE Room_ID = ?',
      [booking.Room_ID]
    )

    res.json({ message: 'Booking confirmed and room updated' })
  } catch (error) {
    console.error('Confirm booking error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// ยกเลิก booking และคืนสถานะห้องว่าง
router.put('/:id/cancel', async (req, res) => {
  try {
    const [[booking]] = await pool.query(
      'SELECT Room_ID FROM Booking WHERE Booking_ID = ?',
      [req.params.id]
    )
    if (!booking) return res.status(404).json({ error: 'Booking not found' })

    await pool.query(
      'UPDATE Booking SET booking_status = "cancelled" WHERE Booking_ID = ?',
      [req.params.id]
    )
    await pool.query(
      'UPDATE Room SET status = "empty" WHERE Room_ID = ?',
      [booking.Room_ID]
    )

    res.json({ message: 'Booking cancelled and room set to available' })
  } catch (error) {
    console.error('Cancel booking error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Check-in: สร้าง Lease, Monthly_Rent, อัปเดตสถานะ
router.put('/:id/checkin', async (req, res) => {
  try {
    const [[booking]] = await pool.query(
      'SELECT * FROM Booking WHERE Booking_ID = ?',
      [req.params.id]
    )
    if (!booking || booking.booking_status !== 'confirmed') {
      return res.status(400).json({ error: 'Booking not found or not confirmed' })
    }

    const [[roomRow]] = await pool.query(
      'SELECT cost FROM Room WHERE Room_ID = ?',
      [booking.Room_ID]
    )
    const rentAmount = roomRow?.cost || 0
    const securityDeposit = booking.booking_fee || 0

    await pool.query(
      'INSERT INTO Lease (Tenant_ID, Room_ID, start_date, end_date, monthly_rent, security_deposit) VALUES (?, ?, ?, ?, ?, ?)',
      [booking.Tenant_ID, booking.Room_ID, booking.check_in_date, booking.check_out_date, rentAmount, securityDeposit]
    )

    await pool.query(
      'UPDATE Room SET status = "occupied" WHERE Room_ID = ?',
      [booking.Room_ID]
    )

    await pool.query(
      'UPDATE Booking SET booking_status = "completed" WHERE Booking_ID = ?',
      [req.params.id]
    )

    await pool.query(
      'UPDATE Tenant SET current_room_id = ? WHERE Tenant_ID = ?',
      [booking.Room_ID, booking.Tenant_ID]
    )

    res.json({ message: 'Check-in completed' })
  } catch (error) {
    console.error('Check-in error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// ดึง bookings เฉพาะของ Tenant คนใดคนหนึ่ง
router.get('/tenant/:tenantId', async (req, res) => {
  const { tenantId } = req.params
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Booking WHERE Tenant_ID = ? ORDER BY Booking_ID DESC',
      [tenantId]
    )
    res.json(rows)
  } catch (error) {
    console.error('Get tenant bookings error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})


module.exports = router
