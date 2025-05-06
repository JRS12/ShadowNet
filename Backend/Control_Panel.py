from flask import Blueprint, jsonify
import os
import json

control_status_bp = Blueprint('control_status', __name__)
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
CONTROL_STATUS_PATH = os.path.join(BASE_DIR, '..', 'Database', 'control_status.json')

@control_status_bp.route('/get_control_status', methods=['GET'])
def get_control_status():
    if os.path.exists(CONTROL_STATUS_PATH):
        try:
            with open(CONTROL_STATUS_PATH, 'r') as f:
                data = json.load(f)
            return jsonify(data)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    else:
        return jsonify({
            "status": "SAFE",
            "attack_type": "None",
            "severity_score": 0,
            "threat_score": 0,
            "last_updated": "N/A"
        })
