const express = require('express')
const router = express.Router()
const pool = require('../config/connection')

// POST /bill/generate
router.post('/generate', async (req, res) => {
  const { month, year } = req.body
  try {
    const [leases] = await pool.query(
      `SELECT l.Lease_ID, l.monthly_rent, l.Tenant_ID, l.Room_ID, d.Electric_bill, d.Water_bill
       FROM Lease l
       JOIN Room r ON l.Room_ID = r.Room_ID
       JOIN Dormitory d ON r.Dormitory_ID = d.Dormitory_ID
       WHERE l.lease_status = 'active'`
    )

    for (const lease of leases) {
      const [[repairCostRows]] = await pool.query(
        `SELECT SUM(m.cost) AS repairCost
         FROM Maintenance m
         WHERE m.Room_ID = ? AND MONTH(m.maintenance_date) = ? AND YEAR(m.maintenance_date) = ?`,
        [lease.Room_ID, month, year]
      )
      const repairCost = repairCostRows.repairCost || 0
      const electricFee = 0
      const total = lease.monthly_rent + lease.Water_bill + repairCost + electricFee

      await pool.query(
        `INSERT INTO Bill (Bill_date, Lease_ID, due_date, rent, water_fee, electric_fee, repair_cost, total_amount, bill_status)
         VALUES (CURDATE(), ?, DATE_ADD(CURDATE(), INTERVAL 7 DAY), ?, ?, ?, ?, ?, 'unpaid')`,
        [lease.Lease_ID, lease.monthly_rent, lease.Water_bill, electricFee, repairCost, total]
      )
    }

    res.status(201).json({ message: 'บิลถูกสร้างเรียบร้อยแล้วสำหรับเดือนที่ระบุ' })
  } catch (err) {
    console.error('Error generating bill:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /bill/manual
router.post('/manual', async (req, res) => {
  const { leaseId, unitUsed } = req.body

  try {
    const [[lease]] = await pool.query(
      `SELECT l.Lease_ID, l.monthly_rent, l.Room_ID, d.Water_bill, d.Electric_bill
       FROM Lease l
       JOIN Room r ON l.Room_ID = r.Room_ID
       JOIN Dormitory d ON r.Dormitory_ID = d.Dormitory_ID
       WHERE l.Lease_ID = ?`,
      [leaseId]
    )

    if (!lease) return res.status(404).json({ error: 'ไม่พบ Lease นี้' })

    const [[repair]] = await pool.query(
      `SELECT SUM(m.cost) AS repairCost
       FROM Maintenance m
       WHERE m.Room_ID = ? AND MONTH(m.maintenance_date) = MONTH(CURDATE()) AND YEAR(m.maintenance_date) = YEAR(CURDATE())`,
      [lease.Room_ID]
    )

    const repairCost = Number(repair.repairCost) || 0
    const electricFee = Number(lease.Electric_bill) * Number(unitUsed)
    const total = Number(lease.monthly_rent) + Number(lease.Water_bill) + electricFee + repairCost

    await pool.query(
      `INSERT INTO Bill (Bill_date, Lease_ID, due_date, rent, water_fee, electric_fee, repair_cost, total_amount, bill_status)
       VALUES (CURDATE(), ?, DATE_ADD(CURDATE(), INTERVAL 7 DAY), ?, ?, ?, ?, ?, 'unpaid')`,
      [leaseId, lease.monthly_rent, lease.Water_bill, electricFee, repairCost, total]
    )

    res.status(201).json({ message: 'สร้างบิลสำเร็จ' })
  } catch (err) {
    console.error('manual bill error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// PUT /bill/update-electric/:billId
router.put('/update-electric/:billId', async (req, res) => {
  const { billId } = req.params
  const { unitUsed } = req.body

  try {
    const [[bill]] = await pool.query(
      `SELECT b.Lease_ID, r.Room_ID, d.Electric_bill, b.rent, b.water_fee, b.repair_cost
       FROM Bill b
       JOIN Lease l ON b.Lease_ID = l.Lease_ID
       JOIN Room r ON l.Room_ID = r.Room_ID
       JOIN Dormitory d ON r.Dormitory_ID = d.Dormitory_ID
       WHERE b.Bill_ID = ?`,
      [billId]
    )

    const electricFee = unitUsed * bill.Electric_bill
    const total = bill.rent + bill.water_fee + (bill.repair_cost || 0) + electricFee

    await pool.query(
      `UPDATE Bill SET electric_fee = ?, total_amount = ? WHERE Bill_ID = ?`,
      [electricFee, total, billId]
    )

    res.json({ message: 'อัปเดตค่าไฟสำเร็จ', electricFee, total })
  } catch (err) {
    console.error('Update electric error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /bill/tenant/:tenantId
router.get('/tenant/:tenantId', async (req, res) => {
  const { tenantId } = req.params
  try {
    const [rows] = await pool.query(
      `SELECT b.*, d.Name AS dorm_name, r.Room_ID
       FROM Bill b
       JOIN Lease l ON b.Lease_ID = l.Lease_ID
       JOIN Room r ON l.Room_ID = r.Room_ID
       JOIN Dormitory d ON r.Dormitory_ID = d.Dormitory_ID
       WHERE l.Tenant_ID = ?
       ORDER BY b.Bill_date DESC`,
      [tenantId]
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /bill/all
router.get('/all', async (req, res) => {
  try {
    const [bills] = await pool.query(
      `SELECT b.*, r.Room_ID, d.Name AS dorm_name
       FROM Bill b
       JOIN Lease l ON b.Lease_ID = l.Lease_ID
       JOIN Room r ON l.Room_ID = r.Room_ID
       JOIN Dormitory d ON r.Dormitory_ID = d.Dormitory_ID
       ORDER BY b.Bill_date DESC`
    )
    res.json(bills)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
