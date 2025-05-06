from flask import Blueprint, jsonify
import os
import json
from datetime import datetime

keystroke_monitoring_bp = Blueprint('keystroke', __name__)

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
KEYSTROKE_LOG = os.path.join(BASE_DIR, '..', 'Database', 'Logs', 'Keystroke_Monitoring.json')
CONTROL_STATUS = os.path.join(BASE_DIR, '..', 'Database', 'control_status.json')
KEYWORD_DB = os.path.join(BASE_DIR, '..', 'Database', 'Attack_Keywords.json')

@keystroke_monitoring_bp.route('/get_keystroke_logs')
def get_keystroke_logs():
    logs = []
    try:
        if os.path.exists(KEYSTROKE_LOG):
            with open(KEYSTROKE_LOG, 'r') as f:
                content = json.load(f)
                for entry in content:
                    logs.append({
                        "username": entry.get("user"),
                        "ip_address": entry.get("ip", "N/A"),
                        "date": entry.get("timestamp", "").split(" ")[0],
                        "time": entry.get("timestamp", "").split(" ")[1] if " " in entry.get("timestamp", "") else "",
                        "keystroke": entry.get("key"),
                        "attack_type": entry.get("attack_type", "")
                    })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    return jsonify(logs)

@keystroke_monitoring_bp.route('/control_status.json')
def serve_control_status():
    try:
        if os.path.exists(CONTROL_STATUS):
            with open(CONTROL_STATUS) as f:
                return jsonify(json.load(f))
    except Exception as e:
        return jsonify({"status": "SAFE", "error": str(e)})
    return jsonify({"status": "SAFE"})
