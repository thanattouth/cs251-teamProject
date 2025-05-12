const express = require('express')
const pool = require('../config/connection')
const router = express.Router()

// เพิ่มสัญญาเช่าแบบ Walk-in (พร้อมเพิ่มผู้เช่าใหม่)
router.post('/walkin', async (req, res) => {
  const {
    firstname, lastname, email, phone,
    ID_card_number, username, password,
    Room_ID, start_date, end_date, security_deposit
  } = req.body

  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()

    // เพิ่มผู้เช่าใหม่
    const [tenantResult] = await conn.query(
      `INSERT INTO Tenant (firstname, lastname, email, phone, ID_card_number, username, password, move_in_date, current_room_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [firstname, lastname, email, phone, ID_card_number, username, password, start_date, Room_ID]
    )
    const Tenant_ID = tenantResult.insertId

    // ดึงค่าเช่าของห้อง
    const [[room]] = await conn.query(
      'SELECT cost FROM Room WHERE Room_ID = ?',
      [Room_ID]
    )
    const monthlyRent = room?.cost || 0

    // เพิ่ม Lease พร้อมค่าเช่าและเงินประกัน
    await conn.query(
      `INSERT INTO Lease (Tenant_ID, Room_ID, start_date, end_date, monthly_rent, security_deposit)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [Tenant_ID, Room_ID, start_date, end_date, monthlyRent, security_deposit || 0]
    )

    // อัปเดตสถานะห้อง
    await conn.query(`UPDATE Room SET status = 'occupied' WHERE Room_ID = ?`, [Room_ID])

    await conn.commit()
    res.status(201).json({ message: 'Walk-in lease created successfully.' })
  } catch (error) {
    await conn.rollback()
    console.error('Walk-in error:', error)
    res.status(500).json({ error: 'Internal server error' })
  } finally {
    conn.release()
  }
})

module.exports = router
