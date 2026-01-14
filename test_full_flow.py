import requests
import json
import random

BASE_URL = "http://localhost:8000/api"
print("=" * 60)
print("TESTING XWANAI MVP - COMPLETE FLOW")
print("=" * 60)

# Step 1: Register
email = f"demo{random.randint(1000,9999)}@xwanai.com"
password = "Demo123456"
username = f"DemoUser{random.randint(100,999)}"

print(f"\n[1/5] REGISTRATION")
print(f"Email: {email}")

try:
    response = requests.post(f"{BASE_URL}/auth/register", json={
        "email": email,
        "password": password,
        "username": username
    }, timeout=10)
    
    if response.status_code != 201:
        print(f"FAILED: {response.json()}")
        exit(1)
    
    token = response.json()["access_token"]
    user_id = response.json()["user_id"]
    print(f"SUCCESS - Token received")
    
except Exception as e:
    print(f"FAILED: {str(e)}")
    exit(1)

# Headers for authenticated requests
headers = {"Authorization": f"Bearer {token}"}

# Step 2: Create BaZi Profile
print(f"\n[2/5] CREATE BAZI PROFILE")

try:
    response = requests.post(f"{BASE_URL}/profile/bazi", json={
        "birth_year": 2000,
        "birth_month": 1,
        "birth_day": 15,
        "birth_hour": 14,
        "birth_minute": 30,
        "gender": "male",
        "use_true_solar_time": True
    }, headers=headers, timeout=10)
    
    if response.status_code != 201:
        print(f"FAILED: {response.json()}")
        exit(1)
    
    bazi_profile = response.json()
    print(f"SUCCESS - BaZi: {bazi_profile['bazi_string']}")
    print(f"Day Master: {bazi_profile['day_master']}")
    
except Exception as e:
    print(f"FAILED: {str(e)}")
    exit(1)

# Step 3: Get My BaZi Profile
print(f"\n[3/5] GET MY BAZI PROFILE")

try:
    response = requests.get(f"{BASE_URL}/profile/bazi/me", headers=headers, timeout=10)
    
    if response.status_code != 200:
        print(f"FAILED: {response.json()}")
        exit(1)
    
    profile = response.json()
    print(f"SUCCESS - Retrieved profile for user")
    
except Exception as e:
    print(f"FAILED: {str(e)}")
    exit(1)

# Step 4: Create Character
print(f"\n[4/5] CREATE CHARACTER")

try:
    response = requests.post(f"{BASE_URL}/character/create", json={
        "character_name": "Test Character",
        "creation_mode": "original",
        "description": "A test character for demo",
        "birth_year": 1995,
        "birth_month": 3,
        "birth_day": 20,
        "birth_hour": 10,
        "birth_minute": 0,
        "gender": "female",
        "tags": "gentle,kind",
        "visibility_status": "private"
    }, headers=headers, timeout=15)
    
    if response.status_code != 201:
        print(f"FAILED: {response.json()}")
        exit(1)
    
    character = response.json()
    character_id = character["id"]
    print(f"SUCCESS - Character ID: {character_id}")
    print(f"Character BaZi: {character['bazi_profile']['bazi_string']}")
    
except Exception as e:
    print(f"FAILED: {str(e)}")
    exit(1)

# Step 5: Send Chat Message
print(f"\n[5/5] CHAT WITH CHARACTER")

try:
    response = requests.post(f"{BASE_URL}/chat/send", json={
        "character_id": character_id,
        "message": "Hello! Please introduce yourself."
    }, headers=headers, timeout=20)
    
    if response.status_code != 200:
        print(f"FAILED: {response.json()}")
        exit(1)
    
    chat = response.json()
    print(f"SUCCESS")
    print(f"User: {chat['message']}")
    print(f"Character: {chat['response'][:100]}...")
    
except Exception as e:
    print(f"FAILED: {str(e)}")
    exit(1)

print("\n" + "=" * 60)
print("ALL TESTS PASSED!")
print("=" * 60)
print(f"\nTest Account:")
print(f"  Email: {email}")
print(f"  Password: {password}")
print(f"  Character ID: {character_id}")

