const express = require('express')
const cors = require('cors')
require('dotenv').config()

const pool = require('./config/connection')
const setupDatabase = require('./config/setupDatabase')
const authRoutes = require('./router/auth')
const userRoutes = require('./router/user')
const dormitoryRoutes = require('./router/dormitory')
const adminRoutes = require('./router/admin')
const employeeRoutes = require('./router/employee')
const tenantRoutes = require('./router/tenant')
const roomTypeRouter = require('./router/roomType')
const bookingRoutes = require('./router/booking')
const furnitureRoutes = require('./router/furniture')
const roomRouter = require('./router/room')
const leaseRouter = require('./router/lease')

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

//port running
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

//Connect to database
pool.getConnection()
    .then((connection) => {
        console.log('Connected to MySQL database')
        connection.release()
    })
    .catch((error) => {
        console.error('Error connecting to MySQL database:', error)
    })

//Create Tables
setupDatabase()
    .then(() => {
        console.log('Database setup complete')
    })
    .catch((error) => {
        console.error('Error setting up database:', error)
    })

//Routes 
app.use('/api/auth',authRoutes)
app.use('/api/user', userRoutes)

// Admin routes
app.use('/api/admin', adminRoutes)
app.use('/api/dormitory', dormitoryRoutes)
app.use('/api/employee', employeeRoutes)
app.use('/api/tenant', tenantRoutes)

app.use('/api/room-types', roomTypeRouter)
app.use('/api/booking', bookingRoutes)
app.use('/api', furnitureRoutes)
app.use('/api/room', roomRouter)
app.use('/api/lease', leaseRouter)