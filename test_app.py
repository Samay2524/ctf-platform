#!/usr/bin/env python3
"""
Test script for the CTF application
Tests both backend API and frontend accessibility
"""

import requests
import time
import sys

def test_backend():
    """Test backend API endpoints"""
    print("🔧 Testing Backend API...")
    
    base_url = "http://localhost:5001"
    
    # Test 1: Get all challenges
    try:
        response = requests.get(f"{base_url}/api/challenges")
        if response.status_code == 200:
            data = response.json()
            if data.get('success') and len(data.get('challenges', [])) == 15:
                print("✅ GET /api/challenges - SUCCESS")
            else:
                print("❌ GET /api/challenges - FAILED (wrong data)")
                return False
        else:
            print(f"❌ GET /api/challenges - FAILED (status: {response.status_code})")
            return False
    except Exception as e:
        print(f"❌ GET /api/challenges - ERROR: {e}")
        return False
    
    # Test 2: Get specific challenge
    try:
        response = requests.get(f"{base_url}/api/challenges/1")
        if response.status_code == 200:
            data = response.json()
            if data.get('success') and data.get('challenge', {}).get('id') == 1:
                print("✅ GET /api/challenges/1 - SUCCESS")
            else:
                print("❌ GET /api/challenges/1 - FAILED (wrong data)")
                return False
        else:
            print(f"❌ GET /api/challenges/1 - FAILED (status: {response.status_code})")
            return False
    except Exception as e:
        print(f"❌ GET /api/challenges/1 - ERROR: {e}")
        return False
    
    # Test 3: Submit incorrect flag
    try:
        response = requests.post(
            f"{base_url}/api/challenges/1/submit",
            json={"flag": "flag{wrong_flag}"}
        )
        if response.status_code in (200, 400):
            data = response.json()
            if not data.get('success'):
                print("✅ POST /api/challenges/1/submit (incorrect) - SUCCESS")
            else:
                print("❌ POST /api/challenges/1/submit (incorrect) - FAILED (should be incorrect)")
                return False
        else:
            print(f"❌ POST /api/challenges/1/submit - FAILED (status: {response.status_code})")
            return False
    except Exception as e:
        print(f"❌ POST /api/challenges/1/submit - ERROR: {e}")
        return False
    
    # Test 4: Submit correct flag
    try:
        response = requests.post(
            f"{base_url}/api/challenges/1/submit",
            json={"flag": "flag{gH29XtL8s}"}
        )
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                print("✅ POST /api/challenges/1/submit (correct) - SUCCESS")
            else:
                print("❌ POST /api/challenges/1/submit (correct) - FAILED (should be correct)")
                return False
        else:
            print(f"❌ POST /api/challenges/1/submit - FAILED (status: {response.status_code})")
            return False
    except Exception as e:
        print(f"❌ POST /api/challenges/1/submit - ERROR: {e}")
        return False
    
    return True

def test_frontend():
    """Test frontend accessibility"""
    print("\n🌐 Testing Frontend...")
    
    try:
        response = requests.get("http://localhost:3000", timeout=10)
        if response.status_code == 200:
            if "React App" in response.text:
                print("✅ Frontend - SUCCESS (React app loaded)")
                return True
            else:
                print("❌ Frontend - FAILED (not a React app)")
                return False
        else:
            print(f"❌ Frontend - FAILED (status: {response.status_code})")
            return False
    except Exception as e:
        print(f"❌ Frontend - ERROR: {e}")
        return False

def main():
    """Main test function"""
    print("🚀 CTF Application Test Suite")
    print("=" * 40)
    
    # Wait for services to be ready
    print("⏳ Waiting for services to be ready...")
    time.sleep(5)
    
    # Test backend
    backend_ok = test_backend()
    
    # Test frontend
    frontend_ok = test_frontend()
    
    # Summary
    print("\n" + "=" * 40)
    print("📊 TEST SUMMARY")
    print("=" * 40)
    
    if backend_ok and frontend_ok:
        print("🎉 ALL TESTS PASSED!")
        print("\n✅ Backend API is working correctly")
        print("✅ Frontend is accessible")
        print("\n🌐 You can now access:")
        print("   - Frontend: http://localhost:3000")
        print("   - Backend API: http://localhost:5001")
        print("\n🎯 Next steps:")
        print("   1. Open http://localhost:3000 in your browser")
        print("   2. Click 'Start Challenge' to begin")
        print("   3. Complete challenges in order")
        print("   4. Use the correct flag format: flag{...}")
        return 0
    else:
        print("❌ SOME TESTS FAILED")
        if not backend_ok:
            print("   - Backend API has issues")
        if not frontend_ok:
            print("   - Frontend has issues")
        print("\n🔧 Troubleshooting:")
        print("   1. Check if Docker containers are running: docker-compose ps")
        print("   2. Check container logs: docker-compose logs")
        print("   3. Restart services: docker-compose restart")
        return 1

if __name__ == "__main__":
    sys.exit(main()) 