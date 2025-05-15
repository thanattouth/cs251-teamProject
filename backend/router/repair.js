// routes/repair.js
const express = require('express')
const pool = require('../config/connection')
const router = express.Router()

// ผู้ใช้แจ้งซ่อม (ต้องมีห้องพัก)
router.post('/request', async (req, res) => {
  const { tenantId, description, maintenanceDate } = req.body

  try {
    const [[tenant]] = await pool.query(
      'SELECT current_room_id FROM Tenant WHERE Tenant_ID = ?',
      [tenantId]
    )
    if (!tenant || !tenant.current_room_id) {
      return res.status(403).json({ error: 'คุณไม่มีห้องพัก ไม่สามารถแจ้งซ่อมได้' })
    }

    const roomId = tenant.current_room_id
    const requestDate = new Date()

    // สร้าง Repair_Request
    const [repairResult] = await pool.query(
      `INSERT INTO Repair_Request (Tenant_ID, Room_ID, Request_date, Description)
       VALUES (?, ?, ?, ?)`,
      [tenantId, roomId, requestDate, description]
    )

    const requestId = repairResult.insertId

    // สร้าง Maintenance พร้อมวันที่ที่ผู้ใช้เลือก
    await pool.query(
      `INSERT INTO Maintenance (Room_ID, Request_ID, maintenance_date)
       VALUES (?, ?, ?)`,
      [roomId, requestId, maintenanceDate]
    )

    res.status(201).json({ message: 'แจ้งซ่อมพร้อมระบุวันเรียบร้อยแล้ว' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


// PUT /repair/accept/:id
router.put('/accept/:requestId', async (req, res) => {
  const { requestId } = req.params
  const { employeeId } = req.body

  try {
    // ตรวจสอบว่า request มีอยู่
    const [[request]] = await pool.query(
      `SELECT Room_ID FROM Repair_Request WHERE Request_ID = ?`,
      [requestId]
    )
    if (!request) return res.status(404).json({ error: 'ไม่พบรายการแจ้งซ่อม' })

    // อัปเดตสถานะ
    await pool.query(
      `UPDATE Repair_Request SET Status = 'in_progress' WHERE Request_ID = ?`,
      [requestId]
    )

    // เช็กว่ามี Maintenance อยู่แล้วหรือยัง
    const [[existingMaintenance]] = await pool.query(
      `SELECT Maintenance_ID FROM Maintenance WHERE Request_ID = ?`,
      [requestId]
    )

    if (existingMaintenance) {
      // มีอยู่แล้ว → อัปเดตช่างซ่อม
      await pool.query(
        `UPDATE Maintenance SET Employee_ID = ? WHERE Request_ID = ?`,
        [employeeId, requestId]
      )
    } else {
      // ยังไม่มี → เพิ่มใหม่
      await pool.query(
        `INSERT INTO Maintenance (Employee_ID, Room_ID, Request_ID, cost, maintenance_date, description)
         VALUES (?, ?, ?, 0, NULL, NULL)`,
        [employeeId, request.Room_ID, requestId]
      )
    }

    res.json({ message: 'รับเรื่องสำเร็จ และอัปเดตช่างเรียบร้อยแล้ว' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})



router.post('/complete', async (req, res) => {
  const { requestId, cost, description } = req.body

  try {
    const [result] = await pool.query(
      `UPDATE Maintenance 
       SET cost = ?, description = ?
       WHERE Request_ID = ?`,
      [cost, description, requestId]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'ไม่พบรายการ Maintenance ที่จะอัปเดต' })
    }

    await pool.query(
      `UPDATE Repair_Request SET Status = 'completed' WHERE Request_ID = ?`,
      [requestId]
    )

    res.json({ message: 'อัปเดตการซ่อมเสร็จสิ้นเรียบร้อยแล้ว' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


// GET /repair/user/:tenantId
router.get('/user/:tenantId', async (req, res) => {
  const { tenantId } = req.params
  try {
    const [requests] = await pool.query(
      `SELECT r.Request_ID, r.Room_ID, r.Request_date, r.Description, r.Status,
              m.maintenance_date, m.cost, m.description AS maintenance_desc,
              CONCAT(e.firstname, ' ', e.lastname) AS technician
       FROM Repair_Request r
       LEFT JOIN Maintenance m ON r.Request_ID = m.Request_ID
       LEFT JOIN Employee e ON m.Employee_ID = e.Employee_ID
       WHERE r.Tenant_ID = ?
       ORDER BY r.Request_date DESC`,
      [tenantId]
    )
    res.json(requests)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /repair/all
router.get('/all', async (req, res) => {
  try {
    const [requests] = await pool.query(
      `SELECT r.Request_ID, r.Tenant_ID, t.firstname, t.lastname,
              r.Room_ID, r.Request_date, r.Description, r.Status,
              m.maintenance_date, m.cost, m.description AS maintenance_desc,
              CONCAT(e.firstname, ' ', e.lastname) AS technician
       FROM Repair_Request r
       JOIN Tenant t ON r.Tenant_ID = t.Tenant_ID
       LEFT JOIN Maintenance m ON r.Request_ID = m.Request_ID
       LEFT JOIN Employee e ON m.Employee_ID = e.Employee_ID
       ORDER BY r.Request_date DESC`
    )
    res.json(requests)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router