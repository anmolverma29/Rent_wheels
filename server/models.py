import sqlite3
import json

import os

# On Render, use the persistent disk at /var/data; otherwise use local directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PERSISTENT_DIR = '/var/data' if os.path.exists('/var/data') else BASE_DIR
DB_NAME = os.path.join(PERSISTENT_DIR, 'database.db')


def get_db():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    c = conn.cursor()
    
    # Users Table
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'renter',
            license_uploaded BOOLEAN DEFAULT 0,
            location TEXT
        )
    ''')

    # Migration for existing users table
    try:
        c.execute('ALTER TABLE users ADD COLUMN location TEXT')
    except sqlite3.OperationalError:
        pass # Column likely already exists

    try:
        c.execute('ALTER TABLE users ADD COLUMN license_uploaded BOOLEAN DEFAULT 0')
    except sqlite3.OperationalError:
        pass

    # Vehicles Table
    c.execute('''
        CREATE TABLE IF NOT EXISTS vehicles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            make TEXT NOT NULL,
            model TEXT NOT NULL,
            year INTEGER,
            price INTEGER,
            image TEXT,
            rating REAL,
            trips INTEGER,
            lat REAL,
            lng REAL,
            type TEXT,
            city TEXT
        )
    ''')
    
    # Migration for existing vehicles table
    try:
        c.execute('ALTER TABLE vehicles ADD COLUMN city TEXT')
    except sqlite3.OperationalError:
        pass

    # Bookings Table
    c.execute('''
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            vehicle_id INTEGER,
            start_date TEXT,
            end_date TEXT,
            total_price INTEGER,
            status TEXT DEFAULT 'confirmed',
            payment_order_id TEXT,
            payment_id TEXT,
            payment_signature TEXT,
            FOREIGN KEY(user_id) REFERENCES users(id),
            FOREIGN KEY(vehicle_id) REFERENCES vehicles(id)
        )
    ''')

    # Migration: add payment columns to existing bookings table
    for col in ['payment_order_id TEXT', 'payment_id TEXT', 'payment_signature TEXT']:
        try:
            c.execute(f'ALTER TABLE bookings ADD COLUMN {col}')
        except sqlite3.OperationalError:
            pass  # Column already exists

    conn.commit()
    conn.close()
    print("Database initialized.")

def seed_data():
    conn = get_db()
    c = conn.cursor()

    # FORCE RESET for demo: Clear vehicles to re-seed with cities
    c.execute('DELETE FROM vehicles')
    c.execute('DELETE FROM bookings') # Clear bookings to avoid FK errors
    # In a real app, we wouldn't delete data, but for this proto, we need the structure update.
    
    # Seed Vehicles
    vehicles = [
        # Bangalore
        ('Mahindra', 'Thar 4x4', 2023, 1200, '/assets/vehicles/thar.png', 4.9, 42, 12.9716, 77.5946, 'car', 'Bangalore'),
        ('Tata', 'Nexon EV', 2024, 950, '/assets/vehicles/nexon.png', 4.8, 24, 12.9279, 77.6271, 'zap', 'Bangalore'),
        ('Ather', '450X', 2024, 350, '/assets/vehicles/ather.png', 4.9, 45, 12.9081, 77.6476, 'bike', 'Bangalore'),
        
        # Delhi
        ('Maruti Suzuki', 'Swift', 2022, 800, '/assets/vehicles/swift.png', 4.7, 89, 28.6139, 77.2100, 'car', 'Delhi'),
        ('Royal Enfield', 'Himalayan', 2023, 600, '/assets/vehicles/himalayan.png', 4.8, 30, 28.5244, 77.1855, 'bike', 'Delhi'),
        ('MG', 'ZS EV', 2023, 1500, '/assets/vehicles/zsev.png', 4.9, 15, 28.6328, 77.2197, 'zap', 'Delhi'),
        
        # Mumbai
        ('Hyundai', 'Creta', 2023, 1100, '/assets/vehicles/creta.png', 4.8, 67, 19.0760, 72.8777, 'car', 'Mumbai'),
        ('Honda', 'City', 2023, 1000, '/assets/vehicles/hondacity.png', 4.6, 55, 19.0558, 72.8546, 'car', 'Mumbai'),
        ('Ola', 'S1 Pro', 2024, 300, '/assets/vehicles/ola.png', 4.5, 78, 19.1136, 72.8697, 'zap', 'Mumbai'),
        
        # More Vehicles (Bangalore)
        ('Toyota', 'Fortuner', 2023, 2500, '/assets/vehicles/fortuner.png', 4.9, 15, 12.9352, 77.6245, 'car', 'Bangalore'),
        ('KTM', 'Duke 390', 2023, 800, '/assets/vehicles/duke.png', 4.8, 56, 12.9250, 77.5891, 'bike', 'Bangalore'),

        # More Vehicles (Delhi)
        ('Hyundai', 'Verna', 2023, 1100, '/assets/vehicles/verna.png', 4.7, 34, 28.5355, 77.3910, 'car', 'Delhi'),
        ('Royal Enfield', 'Classic 350', 2022, 700, '/assets/vehicles/classic350.png', 4.6, 92, 28.7041, 77.1025, 'bike', 'Delhi'),

        # More Vehicles (Mumbai)
        ('Mahindra', 'XUV700', 2024, 2200, '/assets/vehicles/xuv700.png', 4.9, 21, 19.2183, 72.9781, 'car', 'Mumbai'),
        ('TVS', 'Apache RR310', 2023, 900, '/assets/vehicles/apache.png', 4.8, 41, 19.0760, 72.8777, 'bike', 'Mumbai')
    ]

    c.executemany('INSERT INTO vehicles (make, model, year, price, image, rating, trips, lat, lng, type, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', vehicles)
    
    # Seed Admin User
    admin_email = 'admin@rentwheels.com'
    c.execute('SELECT id FROM users WHERE email = ?', (admin_email,))
    if not c.fetchone():
        # In a real app, hash this password!
        c.execute('INSERT INTO users (name, email, password, role, location) VALUES (?, ?, ?, ?, ?)', 
                  ('Amit Kumar', admin_email, 'admin123', 'admin', 'Headquarters'))
        print("Admin user created: admin@rentwheels.com / admin123")
    
    conn.commit()
    conn.close()
    print("Database seeded with Indian vehicles.")
