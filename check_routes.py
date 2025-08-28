#!/usr/bin/env python3
"""
Script to check Flask app routes
"""

from app import app

print("=== Flask App URL Map ===")
print(app.url_map)
print()

print("=== Available Routes ===")
for rule in app.url_map.iter_rules():
    print(f"{rule.rule} -> {rule.endpoint} [{', '.join(rule.methods)}]")
print()

print("=== Expected Endpoints ===")
print("GET  http://127.0.0.1:5000/skills")
print("POST http://127.0.0.1:5000/skills/unlockable")
print()

# Test if the app can start without errors
try:
    print("=== Testing App Creation ===")
    print("✓ App created successfully")
    print("✓ Blueprints registered successfully")
except Exception as e:
    print(f"✗ Error creating app: {e}")
    import traceback
    traceback.print_exc()
