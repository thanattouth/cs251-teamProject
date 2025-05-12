const express = require('express')
const pool = require('../config/connection')
const router = express.Router()

// นับจำนวนพนักงานที่เข้าทำงานในปีนั้น
router.get('/count/:year', async (req, res) => {
  const { year } = req.params
  try {
    const [rows] = await pool.query(
      "SELECT COUNT(*) as count FROM Employee WHERE LEFT(Employee_ID,5) = ?",
      [`M${year}`]
    )
    res.json({ count: rows[0].count })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// ดึงรายชื่อพนักงานทั้งหมด
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT Employee_ID, ID_card_number, firstname, lastname, hire_date, position_type FROM Employee ORDER BY hire_date DESC'
    )
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// ดึงข้อมูล Housekeeper และ Technician
router.get('/extra', async (req, res) => {
  try {
    const [housekeepers] = await pool.query('SELECT Employee_ID, Floor_assigned FROM Housekeeper')
    const [technicians] = await pool.query('SELECT Employee_ID, specialty FROM Technician')
    const [guards] = await pool.query('SELECT Employee_ID, Shift FROM Security_guard')
    const [managers] = await pool.query('SELECT Employee_ID, Department FROM Manager')
    res.json({ housekeepers, technicians, guards, managers })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// เพิ่มพนักงาน
router.post('/', async (req, res) => {
  const { ID_card_number, firstname, lastname, hire_date, position_type } = req.body
  if (!ID_card_number || !firstname || !lastname || !hire_date || !position_type) {
    return res.status(400).json({ error: 'All fields are required' })
  }
  try {
    // สร้าง Employee_ID
    const year = hire_date.slice(0, 4)
    const [rows] = await pool.query(
      "SELECT COUNT(*) as count FROM Employee WHERE LEFT(Employee_ID,5) = ?",
      [`M${year}`]
    )
    const nextSeq = String(rows[0].count + 1).padStart(3, "0")
    const Employee_ID = `M${year}${nextSeq}`

    await pool.query(
      'INSERT INTO Employee (Employee_ID, ID_card_number, firstname, lastname, hire_date, position_type) VALUES (?, ?, ?, ?, ?, ?)',
      [Employee_ID, ID_card_number, firstname, lastname, hire_date, position_type]
    )
    res.status(201).json({ message: 'Employee added', Employee_ID })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// แก้ไขหรือเพิ่ม Floor_assigned ของ Housekeeper
router.put('/housekeeper/:id', async (req, res) => {
  const { id } = req.params
  const { Floor_assigned } = req.body
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Housekeeper WHERE Employee_ID = ?',
      [id]
    )
    if (rows.length > 0) {
      await pool.query(
        'UPDATE Housekeeper SET Floor_assigned = ? WHERE Employee_ID = ?',
        [Floor_assigned, id]
      )
    } else {
      await pool.query(
        'INSERT INTO Housekeeper (Employee_ID, Floor_assigned) VALUES (?, ?)',
        [id, Floor_assigned]
      )
    }
    res.json({ message: 'Saved' })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// แก้ไขหรือเพิ่ม specialty ของ Technician
router.put('/technician/:id', async (req, res) => {
  const { id } = req.params
  const { specialty } = req.body
  try {
    const [rows] = await pool.query(
      'SELECT * FROM Technician WHERE Employee_ID = ?',
      [id]
    )
    if (rows.length > 0) {
      await pool.query(
        'UPDATE Technician SET specialty = ? WHERE Employee_ID = ?',
        [specialty, id]
      )
    } else {
      await pool.query(
        'INSERT INTO Technician (Employee_ID, specialty) VALUES (?, ?)',
        [id, specialty]
      )
    }
    res.json({ message: 'Saved' })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// เพิ่ม/แก้ไข Shift ของ Security guard
router.put('/guard/:id', async (req, res) => {
  const { id } = req.params
  const { Shift } = req.body
  try {
    const [rows] = await pool.query('SELECT * FROM Security_guard WHERE Employee_ID = ?', [id])
    if (rows.length > 0) {
      await pool.query('UPDATE Security_guard SET Shift = ? WHERE Employee_ID = ?', [Shift, id])
    } else {
      await pool.query('INSERT INTO Security_guard (Employee_ID, Shift) VALUES (?, ?)', [id, Shift])
    }
    res.json({ message: 'Saved' })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// เพิ่ม/แก้ไข Department ของ Manager
router.put('/manager/:id', async (req, res) => {
  const { id } = req.params
  const { Department } = req.body
  try {
    const [rows] = await pool.query('SELECT * FROM Manager WHERE Employee_ID = ?', [id])
    if (rows.length > 0) {
      await pool.query('UPDATE Manager SET Department = ? WHERE Employee_ID = ?', [Department, id])
    } else {
      await pool.query('INSERT INTO Manager (Employee_ID, Department) VALUES (?, ?)', [id, Department])
    }
    res.json({ message: 'Saved' })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router