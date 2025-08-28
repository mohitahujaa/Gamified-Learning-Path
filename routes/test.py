from flask import Blueprint, jsonify

test_bp = Blueprint('test', __name__)

@test_bp.route('/ping', methods=['GET'])
def ping():
    """Test route to verify the server is running"""
    return jsonify({"message": "pong"}) 