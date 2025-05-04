from flask import Blueprint, jsonify
import os
import json

web_monitoring_bp = Blueprint('web_monitoring', __name__)

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
WEB_MONITORING_LOG = os.path.join(BASE_DIR, '..', 'Database', 'Logs', 'Web_Monitoring.json')
CONTROL_STATUS_FILE = os.path.join(BASE_DIR, '..', 'Database', 'control_status.json')

@web_monitoring_bp.route('/get_web_logs', methods=['GET'])
def get_web_logs():
    logs = []
    print(f"[DEBUG] Attempting to load file: {WEB_MONITORING_LOG}")
    
    if os.path.exists(WEB_MONITORING_LOG):
        try:
            with open(WEB_MONITORING_LOG, 'r') as f:
                content = f.read()
                if content.strip().startswith('['):
                    logs = json.loads(content)
                else:
                    for line in content.strip().splitlines():
                        try:
                            logs.append(json.loads(line))
                        except json.JSONDecodeError:
                            continue
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    return jsonify(logs)

@web_monitoring_bp.route('/control_status.json', methods=['GET'])
def serve_control_status():
    if os.path.exists(CONTROL_STATUS_FILE):
        try:
            with open(CONTROL_STATUS_FILE) as f:
                data = json.load(f)
                return jsonify(data)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    return jsonify({"status": "SAFE"})
