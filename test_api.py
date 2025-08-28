#!/usr/bin/env python3
"""
Test script for the Flask API endpoints
"""

import requests
import json

BASE_URL = "http://localhost:5000"

def test_get_skills():
    """Test GET /skills endpoint"""
    print("=== Testing GET /skills ===")
    try:
        response = requests.get(f"{BASE_URL}/skills")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Success: {data['success']}")
            print(f"Number of skills: {len(data['data'])}")
            
            for skill in data['data']:
                print(f"  - {skill['name']} (ID: {skill['id']})")
                print(f"    Description: {skill['description']}")
                print(f"    Prerequisites: {skill['prerequisites']}")
        else:
            print(f"Error: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to server. Make sure the Flask app is running.")
    except Exception as e:
        print(f"Error: {e}")
    print()

def test_get_unlockable_skills():
    """Test POST /unlockable endpoint"""
    print("=== Testing POST /unlockable ===")
    
    test_cases = [
        {
            "name": "No completed skills",
            "completed_skills": []
        },
        {
            "name": "Completed 'Basics of Computer'",
            "completed_skills": ["basics_computer"]
        },
        {
            "name": "Completed 'Basics of Computer' and 'MS Office'",
            "completed_skills": ["basics_computer", "ms_office"]
        },
        {
            "name": "Completed all except 'AI Tools'",
            "completed_skills": ["basics_computer", "ms_office", "canva", "power_bi"]
        }
    ]
    
    for test_case in test_cases:
        print(f"Test: {test_case['name']}")
        try:
            response = requests.post(
                f"{BASE_URL}/unlockable",
                json={"completed_skills": test_case['completed_skills']},
                headers={"Content-Type": "application/json"}
            )
            
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"Success: {data['success']}")
                print(f"Unlockable skills: {len(data['data'])}")
                
                for skill in data['data']:
                    print(f"  - {skill['name']} (ID: {skill['id']})")
                    print(f"    Description: {skill['description']}")
            else:
                print(f"Error: {response.text}")
                
        except requests.exceptions.ConnectionError:
            print("Error: Could not connect to server. Make sure the Flask app is running.")
            break
        except Exception as e:
            print(f"Error: {e}")
        print()

def test_error_handling():
    """Test error handling"""
    print("=== Testing Error Handling ===")
    
    # Test invalid JSON
    print("Test: Invalid JSON body")
    try:
        response = requests.post(
            f"{BASE_URL}/unlockable",
            data="invalid json",
            headers={"Content-Type": "application/json"}
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    print()
    
    # Test missing field
    print("Test: Missing 'completed_skills' field")
    try:
        response = requests.post(
            f"{BASE_URL}/unlockable",
            json={"wrong_field": []},
            headers={"Content-Type": "application/json"}
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    print()

if __name__ == "__main__":
    print("API Test Script")
    print("Make sure the Flask server is running on http://localhost:5000")
    print("=" * 50)
    print()
    
    test_get_skills()
    test_get_unlockable_skills()
    test_error_handling() 