const pool = require('./connection')
const bcrypt = require('bcrypt')

async function setupDatabase() {
    const tables = [
        {
            name: 'Admin',
            sql: `
            CREATE TABLE IF NOT EXISTS Admin (
                Admin_ID INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL
            )`
        },
        {
            name: 'Tenant',
            sql: `
            CREATE TABLE IF NOT EXISTS Tenant (
                Tenant_ID INT AUTO_INCREMENT PRIMARY KEY,
                ID_card_number VARCHAR(20) NOT NULL UNIQUE,
                firstname VARCHAR(50),
                lastname VARCHAR(50),
                phone VARCHAR(15),
                email VARCHAR(100) UNIQUE,
                username VARCHAR(50) UNIQUE,
                password VARCHAR(255)
            )`
        },
        {
            name: 'Employee',
            sql: `
            CREATE TABLE IF NOT EXISTS Employee (
                Employee_ID INT AUTO_INCREMENT PRIMARY KEY,
                ID_card_number VARCHAR(20),
                firstname VARCHAR(50),
                lastname VARCHAR(50),
                hire_date DATE,
                position_type VARCHAR(50)
            )`
        },
        {
            name: 'Dormitory',
                sql: `
                CREATE TABLE IF NOT EXISTS Dormitory (
                    Dormitory_ID CHAR(1) PRIMARY KEY,
                    Name VARCHAR(20),
                    Location VARCHAR(255),
                    Floor INT NOT NULL,
                    RoomsPerFloor INT NOT NULL,
                    Electric_bill INT CHECK (Electric_bill BETWEEN 0 AND 9),
                    Water_bill INT CHECK (Water_bill BETWEEN 0 AND 999)
            )`
        },
        {
            name: 'Room',
            sql: `
            CREATE TABLE IF NOT EXISTS Room (
                Room_ID VARCHAR(10) PRIMARY KEY,
                room_number INT,
                Room_type VARCHAR(10),
                status ENUM('available', 'booked', 'rented') DEFAULT 'available',
                Tenant_ID INT,
                Dormitory_ID CHAR(1),
                Floor INT NOT NULL,
                Cost INT NOT NULL,
                Furniture VARCHAR(20),
                FOREIGN KEY (Tenant_ID) REFERENCES Tenant(Tenant_ID),
                FOREIGN KEY (Dormitory_ID) REFERENCES Dormitory(Dormitory_ID)
            )`
        },
        {
            name: 'Lease',
            sql: `
            CREATE TABLE IF NOT EXISTS Lease (
                Lease_ID INT AUTO_INCREMENT PRIMARY KEY,
                Tenant_ID INT,
                Room_ID VARCHAR(10),
                start_date DATE,
                end_date DATE,
                monthly_rent DECIMAL(10, 2),
                lease_status ENUM('active', 'expired', 'terminated') DEFAULT 'active',
                security_deposit DECIMAL(10, 2),
                FOREIGN KEY (Tenant_ID) REFERENCES Tenant(Tenant_ID),
                FOREIGN KEY (Room_ID) REFERENCES Room(Room_ID)
            )`
        },
        {
            name: 'Bill',
            sql: `
            CREATE TABLE IF NOT EXISTS Bill (
                Bill_date DATE,
                Lease_ID INT,
                due_date DATE,
                amount DECIMAL(10, 2),
                bill_status ENUM('pending', 'paid') DEFAULT 'pending',
                PRIMARY KEY (Bill_date, Lease_ID),
                FOREIGN KEY (Lease_ID) REFERENCES Lease(Lease_ID)
            )`
        },
        {
            name: 'Payment',
            sql: `
            CREATE TABLE IF NOT EXISTS Payment (
                Payment_ID INT AUTO_INCREMENT PRIMARY KEY,
                Tenant_ID INT,
                Bill_date DATE,
                Employee_ID INT,
                amount DECIMAL(10, 2),
                payment_date DATE,
                FOREIGN KEY (Tenant_ID) REFERENCES Tenant(Tenant_ID),
                FOREIGN KEY (Bill_date) REFERENCES Bill(Bill_date),
                FOREIGN KEY (Employee_ID) REFERENCES Employee(Employee_ID)
            )`
        },
        {
            name: 'Booking',
            sql: `
            CREATE TABLE IF NOT EXISTS Booking (
                Booking_ID INT AUTO_INCREMENT PRIMARY KEY,
                Tenant_ID INT,
                Room_ID VARCHAR(10),
                check_in_date DATE,
                check_out_date DATE,
                booking_status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
                booking_date DATE,
                FOREIGN KEY (Tenant_ID) REFERENCES Tenant(Tenant_ID),
                FOREIGN KEY (Room_ID) REFERENCES Room(Room_ID)
            )`
        },
        {
            name: 'Technician',
            sql: `
            CREATE TABLE IF NOT EXISTS Technician (
                employee_ID INT,
                specialty VARCHAR(100),
                PRIMARY KEY (employee_ID),
                FOREIGN KEY (employee_ID) REFERENCES Employee(employee_ID)
            )`
        },
        {
            name: 'Maintenance',
            sql: `
            CREATE TABLE IF NOT EXISTS Maintenance (
                Maintenance_ID INT AUTO_INCREMENT PRIMARY KEY,
                Employee_ID INT,
                Room_ID VARCHAR(10),
                cost DECIMAL(10, 2),
                maintenance_date DATE,
                description TEXT,
                FOREIGN KEY (Employee_ID) REFERENCES Employee(Employee_ID),
                FOREIGN KEY (Room_ID) REFERENCES Room(Room_ID)
            )`
        },
        {
            name: 'Furniture',
            sql: `
            CREATE TABLE IF NOT EXISTS Furniture (
                Furniture_ID INT AUTO_INCREMENT PRIMARY KEY,
                furniture_name VARCHAR(50)
            )`
        },
        {
            name: 'Furniture_Set',
            sql: `
            CREATE TABLE IF NOT EXISTS Furniture_Set (
                Room_ID VARCHAR(10),
                furniture_ID INT,
                quantity INT,
                PRIMARY KEY (Room_ID, furniture_ID),
                FOREIGN KEY (Room_ID) REFERENCES Room(Room_ID),
                FOREIGN KEY (furniture_ID) REFERENCES Furniture(Furniture_ID)
            )`
        }
    ]

    for (const table of tables) {
        try {
            await pool.query(table.sql);
            console.log(`Table '${table.name}' created or already exists`)
        } catch (err) {
            console.error(`Failed to create table '${table.name}':`, err.message)
        }
    }

    // Add default admin
    try {
        const hashedPassword = await bcrypt.hash('admin123', 10)
        await pool.query(
            'INSERT IGNORE INTO Admin (username, password) VALUES (?, ?)',
            ['admin', hashedPassword]
        )
        console.log('Default admin created')
    } catch (err) {
        console.error('Failed to create default admin:', err.message)
    }
}

module.exports = setupDatabase
