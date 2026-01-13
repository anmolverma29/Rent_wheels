import sqlite3
import json

import os

# Use absolute path for database to avoid issues on PythonAnywhere
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_NAME = os.path.join(BASE_DIR, 'database.db')

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
            FOREIGN KEY(user_id) REFERENCES users(id),
            FOREIGN KEY(vehicle_id) REFERENCES vehicles(id)
        )
    ''')

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
        ('Mahindra', 'Thar 4x4', 2023, 1200, 'https://images.unsplash.com/photo-1669280614830-6d246c764c58?q=80&w=800&auto=format&fit=crop', 4.9, 42, 12.9716, 77.5946, 'car', 'Bangalore'),
        ('Tata', 'Nexon EV', 2024, 950, 'https://images.unsplash.com/photo-1696580436068-0199f7d24248?q=80&w=800&auto=format&fit=crop', 4.8, 24, 12.9279, 77.6271, 'zap', 'Bangalore'),
        ('Ather', '450X', 2024, 350, 'https://images.unsplash.com/photo-1675762695328-8742469d80fe?q=80&w=800&auto=format&fit=crop', 4.9, 45, 12.9081, 77.6476, 'bike', 'Bangalore'),
        
        # Delhi
        ('Maruti Suzuki', 'Swift', 2022, 800, 'https://images.unsplash.com/photo-1549520478-43e5c9cd46df?q=80&w=800&auto=format&fit=crop', 4.7, 89, 28.6139, 77.2090, 'car', 'Delhi'),
        ('Royal Enfield', 'Himalayan', 2023, 600, 'https://images.unsplash.com/photo-1624622791866-e3d6411516f4?q=80&w=800&auto=format&fit=crop', 4.8, 30, 28.5244, 77.1855, 'bike', 'Delhi'),
        ('MG', 'ZS EV', 2023, 1500, 'https://images.unsplash.com/photo-1696580436068-0199f7d24248?q=80&w=800&auto=format&fit=crop', 4.9, 15, 28.6328, 77.2197, 'zap', 'Delhi'),
        
        # Mumbai
        ('Hyundai', 'Creta', 2023, 1100, 'https://images.unsplash.com/photo-1628867341235-98522e861c8a?q=80&w=800&auto=format&fit=crop', 4.8, 67, 19.0760, 72.8777, 'car', 'Mumbai'),
        ('Honda', 'City', 2023, 1000, 'https://images.unsplash.com/photo-1549520478-43e5c9cd46df?q=80&w=800&auto=format&fit=crop', 4.6, 55, 19.0558, 72.8546, 'car', 'Mumbai'),
        ('Ola', 'S1 Pro', 2024, 300, 'https://images.unsplash.com/photo-1675762695328-8742469d80fe?q=80&w=800&auto=format&fit=crop', 4.5, 78, 19.1136, 72.8697, 'zap', 'Mumbai')
    ]

    c.executemany('INSERT INTO vehicles (make, model, year, price, image, rating, trips, lat, lng, type, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', vehicles)
    
    conn.commit()
    conn.close()
    print("Database seeded with Indian vehicles.")
