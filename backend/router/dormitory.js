const express = require('express')
const pool = require('../config/connection')
const router = express.Router()

// Add Dormitory and Generate Rooms Automatically
router.post('/', async (req, res) => {
  const { Dormitory_ID, Name, Location, Floor, Electric_bill, Water_bill, RoomsPerFloor, Cost } = req.body

  try {
    // Insert Dormitory
    await pool.query(
      'INSERT INTO Dormitory (Dormitory_ID, Name, Location, Floor, Electric_bill, Water_bill, RoomsPerFloor) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [Dormitory_ID, Name, Location, Floor, Electric_bill, Water_bill, RoomsPerFloor]
    )

    // Generate Rooms
    const roomInsertPromises = []
    for (let floor = 1; floor <= Floor; floor++) {
      for (let roomNumber = 1; roomNumber <= RoomsPerFloor; roomNumber++) {
        const Room_ID = `${Dormitory_ID}${String(floor).padStart(2, '0')}${String(roomNumber).padStart(2, '0')}` // A00XX
        const Room_type = 'single' // Default room type
        const Status = 'available' // Default status

        roomInsertPromises.push(
          pool.query(
            'INSERT INTO Room (Room_ID, Dormitory_ID, Room_type, Status, Floor, Cost, room_number) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [Room_ID, Dormitory_ID, Room_type, Status, floor, Cost, roomNumber]
          )
        )
      }
    }

    // Execute all room insert queries
    await Promise.all(roomInsertPromises)

    res.status(201).json({ message: 'Dormitory and rooms added successfully' })
  } catch (error) {
    console.error('Error adding dormitory and rooms:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get all dormitories
router.get('/', async (req, res) => {
  try {
    const [dormitories] = await pool.query('SELECT Dormitory_ID, Name FROM Dormitory')
    res.json(dormitories)
  } catch (error) {
    console.error('Error fetching dormitories:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get all rooms for a specific dormitory
router.get('/:Dormitory_ID/rooms', async (req, res) => {
  const { Dormitory_ID } = req.params
  try {
    const [rooms] = await pool.query('SELECT * FROM Room WHERE Dormitory_ID = ?', [Dormitory_ID])
    res.json(rooms)
  } catch (error) {
    console.error('Error fetching rooms:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/:Dormitory_ID', async (req, res) => {
  const { Dormitory_ID } = req.params
  try {
    const [dormitory] = await pool.query(
      'SELECT * FROM Dormitory WHERE Dormitory_ID = ?',
      [Dormitory_ID]
    )
    if (dormitory.length === 0) {
      return res.status(404).json({ error: 'Dormitory not found' })
    }
    res.json(dormitory[0]) // ส่งข้อมูลหอพักกลับไป
  } catch (error) {
    console.error('Error fetching dormitory details:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router