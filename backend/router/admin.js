const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require('../config/connection')
const router = express.Router()

// Admin Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' })
    }

    try {
        const [rows] = await pool.query('SELECT * FROM Admin WHERE username = ?', [username])
        const admin = rows[0]
        if (!admin) {
            return res.status(400).json({ error: 'Invalid credentials' })
        }

        const isMatch = await bcrypt.compare(password, admin.password)
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' })
        }

        const token = jwt.sign({ adminId: admin.Admin_ID, isAdmin: true }, process.env.JWT_SECRET, { expiresIn: '1h' })
        res.status(200).json({ token })
    } catch (error) {
        console.error('Admin login error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

module.exports = router