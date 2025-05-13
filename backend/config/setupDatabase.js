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
        // =================================================================================
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
            name: 'Room_Type',
            sql: `
            CREATE TABLE IF NOT EXISTS Room_Type (
                Type_ID INT AUTO_INCREMENT PRIMARY KEY,
                Type_name VARCHAR(20) UNIQUE
            )`
        },
        {
            name: 'Room',
            sql: `
            CREATE TABLE IF NOT EXISTS Room (
                Room_ID VARCHAR(10) PRIMARY KEY,
                room_number INT,
                room_type_id INT,
                status ENUM('empty', 'reserved', 'occupied') DEFAULT 'empty',
                Dormitory_ID CHAR(1),
                Floor INT NOT NULL,
                Cost INT NOT NULL,
                FOREIGN KEY (room_type_id) REFERENCES Room_Type(Type_ID),
                FOREIGN KEY (Dormitory_ID) REFERENCES Dormitory(Dormitory_ID)
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
        },
        // =================================================================================
        {
            name: 'Employee',
            sql: `
            CREATE TABLE IF NOT EXISTS Employee (
                Employee_ID VARCHAR(8) PRIMARY KEY,
                ID_card_number VARCHAR(20),
                firstname VARCHAR(50),
                lastname VARCHAR(50),
                hire_date DATE,
                position_type VARCHAR(50)
            )`
        },
        {
            name: 'Technician',
            sql: `
            CREATE TABLE IF NOT EXISTS Technician (
                Employee_ID VARCHAR(8) NOT NULL,
                specialty VARCHAR(100),
                PRIMARY KEY (Employee_ID),
                FOREIGN KEY (Employee_ID) REFERENCES Employee(Employee_ID)
            )`
        },
        {
            name: 'Housekeeper',
            sql: `
            CREATE TABLE IF NOT EXISTS Housekeeper (
                Employee_ID VARCHAR(8) NOT NULL,
                Floor_assigned VARCHAR(20),
                PRIMARY KEY (Employee_ID),
                FOREIGN KEY (Employee_ID) REFERENCES Employee(Employee_ID)
            )`
        },
        {
            name: 'Security_guard',
            sql: `
            CREATE TABLE IF NOT EXISTS Security_Guard (
                Employee_ID VARCHAR(8) PRIMARY KEY,
                Shift VARCHAR(20),
                FOREIGN KEY (Employee_ID) REFERENCES Employee(Employee_ID)
            )`
        },
                {
            name: 'Manager',
            sql: `
            CREATE TABLE IF NOT EXISTS Manager (
                Employee_ID VARCHAR(8) PRIMARY KEY,
                Department VARCHAR(20),
                FOREIGN KEY (Employee_ID) REFERENCES Employee(Employee_ID)
            )`
        },
        // =================================================================================
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
                password VARCHAR(255),
                move_in_date DATE,
                current_room_id VARCHAR(5),
                FOREIGN KEY (current_room_id) REFERENCES Room(Room_ID)
            )`
        },
        // =================================================================================
        {
            name: 'Repair_Request',
            sql: `
            CREATE TABLE IF NOT EXISTS Repair_Request (
                Request_ID INT AUTO_INCREMENT PRIMARY KEY,
                Tenant_ID INT,
                Room_ID VARCHAR(5),
                Request_date DATE,
                Status VARCHAR(20) DEFAULT 'pending',
                Description TEXT,
                FOREIGN KEY (Tenant_ID) REFERENCES Tenant(Tenant_ID),
                FOREIGN KEY (Room_ID) REFERENCES Room(Room_ID)
            )`
        },
        {
            name: 'Maintenance',
            sql: `
            CREATE TABLE IF NOT EXISTS Maintenance (
                Maintenance_ID INT AUTO_INCREMENT PRIMARY KEY,
                Employee_ID VARCHAR(8),
                Room_ID VARCHAR(5),
                Request_ID INT,
                cost INT,
                maintenance_date DATE,
                description VARCHAR(255),
                FOREIGN KEY (Employee_ID) REFERENCES Employee(Employee_ID),
                FOREIGN KEY (Room_ID) REFERENCES Room(Room_ID),
                FOREIGN KEY (Request_ID) REFERENCES Repair_Request(Request_ID)
            )`
        },
        // =================================================================================
        {
            name: 'Booking',
            sql: `
            CREATE TABLE IF NOT EXISTS Booking (
                Booking_ID INT AUTO_INCREMENT PRIMARY KEY,
                Tenant_ID INT,
                Room_ID VARCHAR(10),
                check_in_date DATE,
                check_out_date DATE,
                booking_type ENUM('advance', 'walkin') DEFAULT 'advance',
                booking_status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
                booking_date DATE,
                FOREIGN KEY (Tenant_ID) REFERENCES Tenant(Tenant_ID),
                FOREIGN KEY (Room_ID) REFERENCES Room(Room_ID)
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
                Bill_ID INT AUTO_INCREMENT PRIMARY KEY,
                Bill_date DATE,
                Lease_ID INT,
                due_date DATE,
                rent DECIMAL(10, 2),
                electric_fee DECIMAL(10, 2),
                water_fee DECIMAL(10, 2),
                total_amount DECIMAL(10, 2),
                repair_cost DECIMAL(10,2) DEFAULT 0,
                bill_status ENUM('unpaid', 'paid') DEFAULT 'unpaid',
                FOREIGN KEY (Lease_ID) REFERENCES Lease(Lease_ID)
            )`
        },
        {
            name: 'Payment',
            sql: `
            CREATE TABLE IF NOT EXISTS Payment (
                Payment_ID INT AUTO_INCREMENT PRIMARY KEY,
                Tenant_ID INT,
                Bill_ID INT,
                Employee_ID VARCHAR(8),
                amount DECIMAL(10, 2),
                payment_date DATE,
                FOREIGN KEY (Tenant_ID) REFERENCES Tenant(Tenant_ID),
                FOREIGN KEY (Bill_ID) REFERENCES Bill(Bill_ID),
                FOREIGN KEY (Employee_ID) REFERENCES Employee(Employee_ID)
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

    // Add default room types (single, double)
    try {
        await pool.query(
            'INSERT IGNORE INTO Room_Type (Type_name) VALUES (?), (?)',
            ['single', 'double']
        )
        console.log('Default room types "single" and "double"')
    } catch (err) {
        console.error('Failed to create default room types:', err.message)
    }

    // Add default furniture
    try {
    await pool.query(
        `INSERT IGNORE INTO Furniture (Furniture_ID, furniture_name)
        VALUES 
        (?, ?), (?, ?), (?, ?), (?, ?), 
        (?, ?), (?, ?), (?, ?), (?, ?), 
        (?, ?), (?, ?)`,
        [
        1, 'เตียง',
        2, 'โต๊ะ',
        3, 'เก้าอี้',
        4, 'ตู้เสื้อผ้า',
        5, 'ชั้นวางของ',
        6, 'พัดลม',
        7, 'เครื่องปรับอากาศ',
        8, 'ตู้เย็น',
        9, 'โต๊ะวางทีวี',
        10, 'กระจก'
        ]
    )
    console.log('Default furniture inserted')
    } catch (err) {
    console.error('Failed to insert default furniture:', err.message)
    }

}

module.exports = setupDatabase
