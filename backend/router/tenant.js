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

router.put('/:id/checkout', async (req, res) => {
  const tenantId = req.params.id
  const today = new Date().toISOString().split('T')[0]

  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()

    // 1. อัปเดตสถานะห้องเป็นว่าง
    await conn.query(`
      UPDATE Room
      SET status = 'empty'
      WHERE Room_ID = (SELECT current_room_id FROM Tenant WHERE Tenant_ID = ?)
    `, [tenantId])

    // 2. ล้าง Room_ID ออกจาก Tenant
    await conn.query(`
      UPDATE Tenant
      SET current_room_id = NULL
      WHERE Tenant_ID = ?
    `, [tenantId])

    // 3. อัปเดต Lease เป็น terminated พร้อมใส่ end_date
    await conn.query(`
      UPDATE Lease
      SET lease_status = 'terminated',
          end_date = ?
      WHERE Tenant_ID = ?
        AND lease_status = 'active'
    `, [today, tenantId])

    await conn.commit()
    res.send({ message: 'Checkout successful' })
  } catch (err) {
    await conn.rollback()
    console.error(err)
    res.status(500).send({ error: 'เกิดข้อผิดพลาดในการนำผู้เช่าออก' })
  } finally {
    conn.release()
  }
})

module.exports = router