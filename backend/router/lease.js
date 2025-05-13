const express = require('express')
const pool = require('../config/connection')
const bcrypt = require('bcrypt')
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
    const hashedPassword = await bcrypt.hash(ID_card_number, 10)

    // เพิ่มผู้เช่าใหม่
    const [tenantResult] = await conn.query(
      `INSERT INTO Tenant (firstname, lastname, email, phone, ID_card_number, username, password, move_in_date, current_room_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [firstname, lastname, email, phone, ID_card_number, username, hashedPassword, start_date, Room_ID]
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

// GET /lease/active
router.get('/active', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
        l.Lease_ID, l.Room_ID, l.Tenant_ID, l.monthly_rent,
        t.firstname, t.lastname,
        d.Water_bill, d.Electric_bill,
        SUM(m.cost) AS repairCost
      FROM Lease l
      JOIN Tenant t ON l.Tenant_ID = t.Tenant_ID
      JOIN Room r ON l.Room_ID = r.Room_ID
      JOIN Dormitory d ON r.Dormitory_ID = d.Dormitory_ID
      LEFT JOIN Maintenance m 
        ON m.Room_ID = r.Room_ID AND MONTH(m.maintenance_date) = MONTH(CURDATE()) AND YEAR(m.maintenance_date) = YEAR(CURDATE())
      WHERE l.lease_status = 'active'
      GROUP BY l.Lease_ID
      ORDER BY l.Lease_ID DESC`
    )
    res.json(rows)
  } catch (err) {
    console.error('Error fetching active leases:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
