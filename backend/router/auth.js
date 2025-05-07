const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require('../config/connection')
const router = express.Router()

//Sign Up ------------------------------------------------------------------------------------------------------------------------------------
router.post('/signup', async (req, res) => {
    const { username, password, firstname, lastname, ID_card_number, phone, email } = req.body
    if (!username || !password || !firstname || !lastname || !ID_card_number || !phone || !email) {
        return res.status(400).json({ error: 'All fields are required' })
    }

    try {
        const [existingUser] = await pool.query('SELECT * FROM Tenant WHERE email = ?', [email])
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Email already in use' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        await pool.query(
            'INSERT INTO Tenant (username, password, firstname, lastname, ID_card_number, phone, email) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [username, hashedPassword, firstname, lastname, ID_card_number, phone, email]
        )
        res.status(201).json({ message: 'Tenant registered successfully' })
    } catch (error) {
        console.error('Registration error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

//Sign In ------------------------------------------------------------------------------------------------------------------------------------
router.post('/signin', async (req, res) => {
    const { identifier, password } = req.body
    if (!identifier || !password) {
        return res.status(400).json({ error: 'Username or email and password are required' })
    }

    try {
        // ตรวจหาใน username หรือ email อย่างใดอย่างหนึ่ง
        const [rows] = await pool.query(
            'SELECT * FROM Tenant WHERE username = ? OR email = ?',
            [identifier, identifier]
        )
        const tenant = rows[0]
        if (!tenant) {
            return res.status(400).json({ error: 'Invalid credentials' })
        }

        const isMatch = await bcrypt.compare(password, tenant.password)
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' })
        }

        const token = jwt.sign({ tenantId: tenant.Tenant_ID }, process.env.JWT_SECRET, { expiresIn: '1h' })
        res.status(200).json({
            token,
            user: {
                Tenant_ID: tenant.Tenant_ID,
                First_Name: tenant.firstname,
                Last_Name: tenant.lastname,
                Email: tenant.email,
                Username: tenant.username
            }
        })
    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})


module.exports = router