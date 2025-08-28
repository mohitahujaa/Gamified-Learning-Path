#!/usr/bin/env python3
"""
Test script for the enhanced Flask API endpoints
"""

import requests
import json

BASE_URL = "http://127.0.0.1:5000/skills"

def test_enhanced_api():
    """Test the enhanced API endpoints"""
    print("=== Enhanced API Test ===\n")
    
    # Test 1: Get all skills
    print("1. Testing GET /skills")
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Success: {data['success']}")
            print(f"Number of skills: {len(data['skills'])}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    print()
    
    # Test 2: Get unlockable skills for a new user
    print("2. Testing POST /unlockable for new user")
    try:
        response = requests.post(f"{BASE_URL}/unlockable", json={
            "user_id": "test_user_001",
            "completed_skills": []
        })
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Success: {data['success']}")
            print(f"Unlockable skills: {len(data['unlockable'])}")
            for skill in data['unlockable']:
                print(f"  - {skill['name']}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    print()
    
    # Test 3: Mark first skill as completed
    print("3. Testing POST /progress - Mark first skill completed")
    try:
        response = requests.post(f"{BASE_URL}/progress", json={
            "user_id": "test_user_001",
            "skill_id": "basics"
        })
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Success: {data['success']}")
            print(f"Message: {data['message']}")
            print(f"Completed skills: {data['completed_skills']}")
            print(f"New unlockable skills: {len(data['unlockable_skills'])}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    print()
    
    # Test 4: Get user summary
    print("4. Testing GET /user_summary")
    try:
        response = requests.get(f"{BASE_URL}/user_summary/test_user_001")
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Success: {data['success']}")
            print(f"User ID: {data['user_id']}")
            print(f"Completed skills: {data['completed_skills']}")
            print(f"Points: {data['points']}")
            print(f"Progress: {data['progress_percentage']}%")
            print(f"Badges: {len(data['badges'])}")
            for badge in data['badges']:
                print(f"  - {badge['icon']} {badge['name']}: {badge['description']}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    print()
    
    # Test 5: Mark another skill as completed
    print("5. Testing POST /progress - Mark second skill completed")
    try:
        response = requests.post(f"{BASE_URL}/progress", json={
            "user_id": "test_user_001",
            "skill_id": "ms_office"
        })
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Success: {data['success']}")
            print(f"Message: {data['message']}")
            print(f"Completed skills: {data['completed_skills']}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    print()
    
    # Test 6: Try to complete a skill without prerequisites
    print("6. Testing POST /progress - Try to complete skill without prerequisites")
    try:
        response = requests.post(f"{BASE_URL}/progress", json={
            "user_id": "test_user_001",
            "skill_id": "powerbi"
        })
        print(f"Status Code: {response.status_code}")
        if response.status_code == 400:
            data = response.json()
            print(f"Expected error: {data['error']}")
        else:
            print(f"Unexpected success: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    print()
    
    # Test 7: Final user summary
    print("7. Testing final user summary")
    try:
        response = requests.get(f"{BASE_URL}/user_summary/test_user_001")
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Final points: {data['points']}")
            print(f"Final progress: {data['progress_percentage']}%")
            print(f"Final badges: {len(data['badges'])}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    print()

if __name__ == "__main__":
    print("Enhanced API Test Script")
    print("Make sure the Flask server is running on http://127.0.0.1:5000")
    print("=" * 60)
    print()
    
    test_enhanced_api()
