from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import models
import auth
import sqlite3

import os

# Use absolute path for project root
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

app = Flask(__name__, static_folder=PROJECT_ROOT, static_url_path='')
CORS(app)

# Initialize Database on Start
with app.app_context():
    models.init_db()
    models.seed_data()

# --- Routes ---

@app.route('/')
def index():
    return send_from_directory(PROJECT_ROOT, 'index.html')

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.get_json()
    conn = models.get_db()
    c = conn.cursor()
    
    try:
        # Simple password storage (hashing recommended for production)
        c.execute('INSERT INTO users (name, email, password, location) VALUES (?, ?, ?, ?)', 
                  (data['name'], data['email'], data['password'], data.get('location')))
        conn.commit()
        user_id = c.lastrowid
        token = auth.encode_auth_token(user_id)
        
        return jsonify({
            'status': 'success',
            'token': token,
            'user': {
                'id': user_id, 
                'name': data['name'], 
                'email': data['email'], 
                'role': 'renter', 
                'licenseUploaded': False,
                'location': data.get('location')
            }
        }), 201
    except sqlite3.IntegrityError:
        return jsonify({'message': 'User already exists.'}), 400
    finally:
        conn.close()

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    conn = models.get_db()
    c = conn.cursor()
    
    c.execute('SELECT * FROM users WHERE email = ? AND password = ?', (data['email'], data['password']))
    user = c.fetchone()
    conn.close()

    if user:
        token = auth.encode_auth_token(user['id'])
        return jsonify({
            'status': 'success',
            'token': token,
            'user': {
                'id': user['id'], 
                'name': user['name'], 
                'email': user['email'], 
                'role': user['role'],
                'licenseUploaded': bool(user['license_uploaded'])
            }
        }), 200
    else:
        return jsonify({'message': 'Invalid credentials.'}), 401

@app.route('/api/vehicles', methods=['GET'])
def get_vehicles():
    conn = models.get_db()
    c = conn.cursor()
    c.execute('SELECT * FROM vehicles')
    rows = c.fetchall()
    conn.close()
    
    vehicles = []
    for r in rows:
        vehicles.append({
            'id': r['id'],
            'make': r['make'],
            'model': r['model'],
            'year': r['year'],
            'price': r['price'],
            'image': r['image'],
            'rating': r['rating'],
            'trips': r['trips'],
            'location': [r['lat'], r['lng']],
            'type': r['type'],
            'city': r['city']
        })
    return jsonify(vehicles)

@app.route('/api/book', methods=['POST'])
def create_booking():
    data = request.get_json()
    conn = models.get_db()
    c = conn.cursor()
    
    c.execute('''
        INSERT INTO bookings (user_id, vehicle_id, start_date, end_date, total_price)
        VALUES (?, ?, ?, ?, ?)
    ''', (data['userId'], data['vehicleId'], data['startDate'], data['endDate'], data['totalPrice']))
    
    conn.commit()
    conn.close()
    
    return jsonify({'status': 'success', 'message': 'Booking confirmed'}), 201

@app.route('/api/my-bookings', methods=['GET'])
def get_my_bookings():
    user_id = request.args.get('userId')
    if not user_id:
        return jsonify({'message': 'Missing userId'}), 400
        
    conn = models.get_db()
    c = conn.cursor()
    
    # improved query to join with vehicles
    c.execute('''
        SELECT b.*, v.make, v.model, v.image 
        FROM bookings b 
        JOIN vehicles v ON b.vehicle_id = v.id 
        WHERE b.user_id = ?
    ''', (user_id,))
    
    rows = c.fetchall()
    conn.close()
    
    bookings = []
    for r in rows:
        bookings.append({
            'id': r['id'],
            'vehicle': {'make': r['make'], 'model': r['model'], 'image': r['image']},
            'startDate': r['start_date'],
            'endDate': r['end_date'],
            'totalPrice': r['total_price'],
            'status': r['status']
        })
        
    return jsonify(bookings)

# License Upload Mock
@app.route('/api/upload-license', methods=['POST'])
def upload_license():
    data = request.get_json()
    user_id = data['userId']
    
    conn = models.get_db()
    c = conn.cursor()
    c.execute('UPDATE users SET license_uploaded = 1 WHERE id = ?', (user_id,))
    conn.commit()
    conn.close()
    
    return jsonify({'status': 'success', 'message': 'License verified'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=3000)
