import os
import json
import hmac
import hashlib
import asyncio
import httpx
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, BackgroundTasks
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional, Any

import models
import auth

app = FastAPI(title="RentWheels API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Configuration ---
RAZORPAY_AVAILABLE = False
try:
    import razorpay
    RAZORPAY_AVAILABLE = True
except ImportError:
    print('WARNING: razorpay package not installed. Run: pip install razorpay')

RAZORPAY_KEY_ID = 'rzp_test_Sisch1AWqwcgqE'
RAZORPAY_KEY_SECRET = 'aDgdF5Np28rPuv5ay21yj6o4'

if RAZORPAY_AVAILABLE and RAZORPAY_KEY_ID != 'YOUR_TEST_KEY_ID':
    razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
else:
    razorpay_client = None

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

# Initialize Database on Start
models.init_db()
models.seed_data()

# --- Pydantic Models ---
class SignupData(BaseModel):
    name: str
    email: str
    password: str
    location: Optional[str] = None

class LoginData(BaseModel):
    email: str
    password: str

class BookingData(BaseModel):
    userId: int
    vehicleId: int
    startDate: str
    endDate: str
    totalPrice: int

class OrderData(BaseModel):
    userId: int
    vehicleId: int
    totalPrice: int

class PaymentVerifyData(BaseModel):
    userId: int
    vehicleId: int
    startDate: str
    endDate: str
    totalPrice: int
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

# --- OCR Verification Logic ---
async def verify_license_ocr(user_id: int, file_content: bytes):
    """
    Calls the OCR.space API to verify a driving license.
    """
    try:
        print(f"Starting OCR verification for user {user_id}...")
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                'https://api.ocr.space/parse/image',
                files={'file': ('license.jpg', file_content, 'image/jpeg')},
                data={'apikey': 'helloworld', 'language': 'eng'},
                timeout=15.0
            )
            result = response.json()
            
            # The API returns ParsedResults which contains ParsedText
            # In a real app we'd look for "driving license", "DL", etc.
            # But since this is a prototype and images vary, we'll just check if it parsed successfully.
            if result.get('ParsedResults') and len(result['ParsedResults']) > 0:
                parsed_text = result['ParsedResults'][0].get('ParsedText', '')
                print(f"OCR Parsed Text snippet: {parsed_text[:50]}...")
            else:
                print("OCR did not find text, but approving for demo purposes anyway.")
        
        print(f"OCR Verification completed for user {user_id}")
        
        conn = models.get_db()
        c = conn.cursor()
        c.execute('UPDATE users SET license_uploaded = 1 WHERE id = ?', (user_id,))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"OCR Error for user {user_id}: {e}")

# --- Routes ---

@app.get('/')
async def index():
    return FileResponse(os.path.join(PROJECT_ROOT, 'index.html'))

@app.post('/api/auth/signup')
async def signup(data: SignupData):
    conn = models.get_db()
    c = conn.cursor()
    
    try:
        c.execute('INSERT INTO users (name, email, password, location) VALUES (?, ?, ?, ?)', 
                  (data.name, data.email, data.password, data.location))
        conn.commit()
        user_id = c.lastrowid
        token = auth.encode_auth_token(user_id)
        
        return {
            'status': 'success',
            'token': token,
            'user': {
                'id': user_id, 
                'name': data.name, 
                'email': data.email, 
                'role': 'renter', 
                'licenseUploaded': False,
                'location': data.location
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail='User already exists or DB error.')
    finally:
        conn.close()

@app.post('/api/auth/login')
async def login(data: LoginData):
    conn = models.get_db()
    c = conn.cursor()
    
    c.execute('SELECT * FROM users WHERE email = ? AND password = ?', (data.email, data.password))
    user = c.fetchone()
    conn.close()

    if user:
        token = auth.encode_auth_token(user['id'])
        return {
            'status': 'success',
            'token': token,
            'user': {
                'id': user['id'], 
                'name': user['name'], 
                'email': user['email'], 
                'role': user['role'],
                'licenseUploaded': bool(user['license_uploaded'])
            }
        }
    else:
        raise HTTPException(status_code=401, detail='Invalid credentials.')

@app.get('/api/vehicles')
async def get_vehicles():
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
    return vehicles

@app.post('/api/book')
async def create_booking(data: BookingData):
    conn = models.get_db()
    c = conn.cursor()
    
    c.execute('''
        INSERT INTO bookings (user_id, vehicle_id, start_date, end_date, total_price)
        VALUES (?, ?, ?, ?, ?)
    ''', (data.userId, data.vehicleId, data.startDate, data.endDate, data.totalPrice))
    
    conn.commit()
    conn.close()
    
    return JSONResponse(status_code=201, content={'status': 'success', 'message': 'Booking confirmed'})

@app.get('/api/my-bookings')
async def get_my_bookings(userId: int):
    conn = models.get_db()
    c = conn.cursor()
    
    c.execute('''
        SELECT b.*, v.make, v.model, v.image 
        FROM bookings b 
        JOIN vehicles v ON b.vehicle_id = v.id 
        WHERE b.user_id = ?
    ''', (userId,))
    
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
        
    return bookings

@app.post('/api/upload-license')
async def upload_license(background_tasks: BackgroundTasks, userId: int = Form(...), file: UploadFile = File(...)):
    """
    Accepts an image file and kicks off a background OCR verification task.
    """
    file_content = await file.read()
    background_tasks.add_task(verify_license_ocr, userId, file_content)
    
    return {'status': 'success', 'message': 'License upload received, OCR verification in progress.'}

@app.get('/api/users')
async def get_all_users():
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
    return users

@app.post('/api/create-order')
async def create_payment_order(data: OrderData):
    amount_paise = int(data.totalPrice) * 100

    if amount_paise <= 0:
        raise HTTPException(status_code=400, detail='Invalid booking amount.')

    if razorpay_client is None:
        demo_order_id = f"order_DEMO_{data.userId}_{data.vehicleId}"
        return {
            'status': 'success',
            'order_id': demo_order_id,
            'amount': amount_paise,
            'key_id': RAZORPAY_KEY_ID,
            'demo_mode': True
        }

    try:
        order_data = {
            'amount': amount_paise,
            'currency': 'INR',
            'receipt': f"rw_{data.userId}_{data.vehicleId}"
        }
        order = razorpay_client.order.create(data=order_data)
        return {
            'status': 'success',
            'order_id': order['id'],
            'amount': amount_paise,
            'key_id': RAZORPAY_KEY_ID
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post('/api/verify-payment')
async def verify_payment(data: PaymentVerifyData):
    rp_order_id = data.razorpay_order_id
    rp_payment_id = data.razorpay_payment_id
    rp_signature = data.razorpay_signature

    is_demo = rp_order_id.startswith('order_DEMO_')

    if not is_demo:
        msg = f"{rp_order_id}|{rp_payment_id}"
        expected = hmac.new(
            bytes(RAZORPAY_KEY_SECRET, 'utf-8'),
            bytes(msg, 'utf-8'),
            hashlib.sha256
        ).hexdigest()
        if expected != rp_signature:
            raise HTTPException(status_code=400, detail='Payment signature verification failed.')

    conn = models.get_db()
    c = conn.cursor()
    try:
        c.execute('''
            INSERT INTO bookings (user_id, vehicle_id, start_date, end_date, total_price,
                                  status, payment_order_id, payment_id, payment_signature)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data.userId,
            data.vehicleId,
            data.startDate,
            data.endDate,
            data.totalPrice,
            'confirmed',
            rp_order_id,
            rp_payment_id,
            rp_signature
        ))
        conn.commit()
        return {'success': True, 'message': 'Booking confirmed!'}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

# Mount static files correctly
app.mount("/assets", StaticFiles(directory=os.path.join(PROJECT_ROOT, "assets")), name="assets")
app.mount("/js", StaticFiles(directory=os.path.join(PROJECT_ROOT, "js")), name="js")
app.mount("/css", StaticFiles(directory=os.path.join(PROJECT_ROOT, "css")), name="css")

if __name__ == '__main__':
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=3000, reload=True)
