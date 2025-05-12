const express = require('express')
const pool = require('../config/connection')
const router = express.Router()

// Add Dormitory and Generate Rooms Automatically
router.post('/', async (req, res) => {
  const {
    Dormitory_ID,
    Name,
    Location,
    Floor,
    Electric_bill,
    Water_bill,
    RoomsPerFloor,
    Cost,
    FurnitureSet // <== array ของ { furniture_id, quantity }
  } = req.body

  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()

    await conn.query(
      'INSERT INTO Dormitory (Dormitory_ID, Name, Location, Floor, Electric_bill, Water_bill, RoomsPerFloor) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [Dormitory_ID, Name, Location, Floor, Electric_bill, Water_bill, RoomsPerFloor]
    )

    for (let floorNum = 1; floorNum <= Floor; floorNum++) {
      for (let roomNum = 1; roomNum <= RoomsPerFloor; roomNum++) {
        const Room_ID = `${Dormitory_ID}${String(floorNum).padStart(2, '0')}${String(roomNum).padStart(2, '0')}`
        const room_type_id = 1
        const Status = 'empty'

        await conn.query(
          'INSERT INTO Room (Room_ID, Dormitory_ID, room_type_id, status, floor, cost, room_number) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [Room_ID, Dormitory_ID, room_type_id, Status, floorNum, Cost, roomNum]
        )

        if (Array.isArray(FurnitureSet)) {
          for (const item of FurnitureSet) {
            await conn.query(
              'INSERT INTO Furniture_Set (Room_ID, Furniture_ID, quantity) VALUES (?, ?, ?)',
              [Room_ID, item.furniture_id, item.quantity]
            )
          }
        }
      }
    }

    // Execute all room insert queries
    await conn.commit()
    res.status(201).json({ message: 'Dormitory, rooms, and furniture added successfully' })
  } catch (error) {
    await conn.rollback()
    console.error('Error adding dormitory with furniture:', error)
    res.status(500).json({ error: 'Internal server error' })
  } finally {
    conn.release()
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