const express = require('express')
const cors = require('cors')
require('dotenv').config()

const pool = require('./config/connection')
const setupDatabase = require('./config/setupDatabase')
const authRoutes = require('./router/auth')

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