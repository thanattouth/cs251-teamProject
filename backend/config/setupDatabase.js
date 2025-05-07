const pool = require('./connection')

async function setupDatabase() {
    const tables = [
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
            name: 'Room',
            sql: `
            CREATE TABLE IF NOT EXISTS Room (
                Room_ID INT AUTO_INCREMENT PRIMARY KEY,
                room_number VARCHAR(10),
                status ENUM('available', 'booked', 'rented') DEFAULT 'available',
                Tenant_ID INT,
                FOREIGN KEY (Tenant_ID) REFERENCES Tenant(Tenant_ID)
            )`
        },
        {
            name: 'Lease',
            sql: `
            CREATE TABLE IF NOT EXISTS Lease (
                Lease_ID INT AUTO_INCREMENT PRIMARY KEY,
                Tenant_ID INT,
                Room_ID INT,
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
                Room_ID INT,
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
                Room_ID INT,
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
                Room_ID INT,
                furniture_ID INT,
                quantity INT,
                PRIMARY KEY (Room_ID, furniture_ID),
                FOREIGN KEY (Room_ID) REFERENCES Room(Room_ID),
                FOREIGN KEY (furniture_ID) REFERENCES Furniture(furniture_ID)
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
}

module.exports = setupDatabase
