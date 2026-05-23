import pytest
from fastapi.testclient import TestClient
import os
import sqlite3

# Set environment variable to use an in-memory db or a test db if needed.
# For simplicity, we'll test against the current setup, but ideal tests use a separate db.
from main import app
import models

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_database():
    """Ensure the database is seeded before running tests."""
    models.init_db()
    models.seed_data()
    yield

def test_get_vehicles():
    """Test retrieving vehicles from the API."""
    response = client.get("/api/vehicles")
    assert response.status_code == 200
    vehicles = response.json()
    assert isinstance(vehicles, list)
    assert len(vehicles) > 0
    assert "make" in vehicles[0]

def test_signup_and_login():
    """Test user registration and login."""
    test_email = "testuser_auto@example.com"
    test_password = "password123"
    
    # Clean up before test just in case
    conn = models.get_db()
    c = conn.cursor()
    c.execute('DELETE FROM users WHERE email = ?', (test_email,))
    conn.commit()
    conn.close()

    # 1. Signup
    signup_data = {
        "name": "Test Auto User",
        "email": test_email,
        "password": test_password,
        "location": "Delhi"
    }
    response = client.post("/api/auth/signup", json=signup_data)
    assert response.status_code == 200
    res_data = response.json()
    assert res_data["status"] == "success"
    assert "token" in res_data
    
    # 2. Login
    login_data = {
        "email": test_email,
        "password": test_password
    }
    response = client.post("/api/auth/login", json=login_data)
    assert response.status_code == 200
    res_data = response.json()
    assert res_data["status"] == "success"
    assert "token" in res_data
    assert res_data["user"]["email"] == test_email

def test_upload_license():
    """Test uploading a license image."""
    # We need a user ID. Let's use the admin user seeded by default.
    user_id = 1 
    
    # Create a dummy image file for the test
    dummy_image_content = b"fake image content"
    
    response = client.post(
        "/api/upload-license",
        data={"userId": user_id},
        files={"file": ("test_license.jpg", dummy_image_content, "image/jpeg")}
    )
    
    assert response.status_code == 200
    res_data = response.json()
    assert res_data["status"] == "success"
    assert "OCR verification in progress" in res_data["message"]
