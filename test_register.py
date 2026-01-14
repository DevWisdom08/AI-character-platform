import requests
import json
import random

# Generate unique email
email = f"test{random.randint(1000,9999)}@xwanai.com"
print(f"Testing registration with email: {email}")

# Test registration
url = "http://localhost:8000/api/auth/register"
data = {
    "email": email,
    "password": "Test123456",
    "username": f"TestUser{random.randint(100,999)}"
}

print(f"\n1. Testing Registration...")
print(f"   URL: {url}")
print(f"   Data: {json.dumps(data, indent=2)}")

try:
    response = requests.post(url, json=data, timeout=10)
    print(f"\n   Status Code: {response.status_code}")
    print(f"   Response: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code == 201:
        print("\n✅ REGISTRATION SUCCESS!")
        token = response.json().get("access_token")
        
        # Test authenticated endpoint
        print(f"\n2. Testing Authenticated Endpoint...")
        headers = {"Authorization": f"Bearer {token}"}
        me_response = requests.get("http://localhost:8000/api/auth/me", headers=headers)
        print(f"   Status Code: {me_response.status_code}")
        print(f"   Response: {json.dumps(me_response.json(), indent=2)}")
        
        if me_response.status_code == 200:
            print("\n✅ AUTHENTICATION WORKS!")
        else:
            print("\n❌ Authentication failed")
    else:
        print(f"\n❌ REGISTRATION FAILED")
        
except Exception as e:
    print(f"\n❌ ERROR: {str(e)}")

