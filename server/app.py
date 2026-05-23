from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import models
import auth
import sqlite3
import os
import hmac
import hashlib
import json

try:
    import razorpay
    RAZORPAY_AVAILABLE = True
except ImportError:
    RAZORPAY_AVAILABLE = False
    print('WARNING: razorpay package not installed. Run: pip install razorpay')

# --- Razorpay Configuration ---
# Replace these with your actual Razorpay TEST keys from https://dashboard.razorpay.com/
RAZORPAY_KEY_ID = 'rzp_test_Sisch1AWqwcgqE'
RAZORPAY_KEY_SECRET = 'aDgdF5Np28rPuv5ay21yj6o4'

if RAZORPAY_AVAILABLE and RAZORPAY_KEY_ID != 'YOUR_TEST_KEY_ID':
    razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
else:
    razorpay_client = None

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

@app.route('/api/users', methods=['GET'])
def get_all_users():
    conn = models.get_db()
    c = conn.cursor()
    c.execute('SELECT id, name, email, role, location, license_uploaded FROM users')
    rows = c.fetchall()
    conn.close()
    
    users = []
    for r in rows:
        users.append({
            'id': r['id'],
            'name': r['name'],
            'email': r['email'],
            'role': r['role'],
            'location': r['location'],
            'licenseUploaded': bool(r['license_uploaded'])
        })
    return jsonify(users)


@app.route('/api/create-order', methods=['POST'])
def create_payment_order():
    data = request.get_json()
    amount_paise = int(data.get('totalPrice', 0)) * 100  # Convert INR to paise

    if amount_paise <= 0:
        return jsonify({'status': 'error', 'message': 'Invalid booking amount.'}), 400

    # If no real Razorpay keys, return a demo order so the UI can still be tested
    if razorpay_client is None:
        demo_order_id = f"order_DEMO_{data.get('userId', 'x')}_{data.get('vehicleId', 'x')}"
        return jsonify({
            'status': 'success',
            'order_id': demo_order_id,
            'amount': amount_paise,
            'key_id': RAZORPAY_KEY_ID,
            'demo_mode': True
        }), 200

    try:
        order_data = {
            'amount': amount_paise,
            'currency': 'INR',
            'receipt': f"rw_{data.get('userId', 'x')}_{data.get('vehicleId', 'x')}"
        }
        order = razorpay_client.order.create(data=order_data)
        return jsonify({
            'status': 'success',
            'order_id': order['id'],
            'amount': amount_paise,
            'key_id': RAZORPAY_KEY_ID
        }), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


@app.route('/api/verify-payment', methods=['POST'])
def verify_payment():
    data = request.get_json()

    rp_order_id  = data.get('razorpay_order_id', '')
    rp_payment_id = data.get('razorpay_payment_id', '')
    rp_signature  = data.get('razorpay_signature', '')

    # Demo mode: order id starts with 'order_DEMO_', skip real verification
    is_demo = rp_order_id.startswith('order_DEMO_')

    if not is_demo:
        # Verify HMAC-SHA256 signature
        msg = f"{rp_order_id}|{rp_payment_id}"
        expected = hmac.new(
            bytes(RAZORPAY_KEY_SECRET, 'utf-8'),
            bytes(msg, 'utf-8'),
            hashlib.sha256
        ).hexdigest()
        if expected != rp_signature:
            return jsonify({'success': False, 'message': 'Payment signature verification failed.'}), 400

    # Save booking to DB
    conn = models.get_db()
    c = conn.cursor()
    try:
        c.execute('''
            INSERT INTO bookings (user_id, vehicle_id, start_date, end_date, total_price,
                                  status, payment_order_id, payment_id, payment_signature)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data.get('userId'),
            data.get('vehicleId'),
            data.get('startDate'),
            data.get('endDate'),
            data.get('totalPrice'),
            'confirmed',
            rp_order_id,
            rp_payment_id,
            rp_signature
        ))
        conn.commit()
        return jsonify({'success': True, 'message': 'Booking confirmed!'}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
    finally:
        conn.close()


if __name__ == '__main__':
    app.run(debug=True, port=3000)
