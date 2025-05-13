const express = require('express')
const paymentRouter = express.Router()
const pool = require('../config/connection')

// POST /payment
paymentRouter.post('/', async (req, res) => {
  const { Bill_ID, Employee_ID, amount } = req.body

  try {
    // ดึง Lease_ID จาก Bill_ID แล้วหา Tenant_ID จาก Lease
    const [[billRow]] = await pool.query(
      `SELECT l.Tenant_ID
       FROM Bill b
       JOIN Lease l ON b.Lease_ID = l.Lease_ID
       WHERE b.Bill_ID = ?`,
      [Bill_ID]
    )

    if (!billRow) {
      return res.status(404).json({ error: 'ไม่พบบิลหรือสัญญาเช่าที่เกี่ยวข้อง' })
    }

    const Tenant_ID = billRow.Tenant_ID

    // บันทึกการชำระเงิน
    await pool.query(
      `INSERT INTO Payment (Tenant_ID, Bill_ID, Employee_ID, amount, payment_date)
       VALUES (?, ?, ?, ?, CURDATE())`,
      [Tenant_ID, Bill_ID, Employee_ID, amount]
    )

    await pool.query(
      `UPDATE Bill SET bill_status = 'paid' WHERE Bill_ID = ?`,
      [Bill_ID]
    )

    res.status(201).json({ message: 'บันทึกการชำระเงินเรียบร้อย' })
  } catch (err) {
    console.error('Payment error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /payment/tenant/:tenantId
paymentRouter.get('/tenant/:tenantId', async (req, res) => {
  const { tenantId } = req.params
  try {
    const [rows] = await pool.query(
      `SELECT p.*, b.total_amount, b.Bill_date, b.due_date
       FROM Payment p
       JOIN Bill b ON p.Bill_ID = b.Bill_ID
       WHERE p.Tenant_ID = ?
       ORDER BY p.payment_date DESC`,
      [tenantId]
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = paymentRouter
