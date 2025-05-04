from flask import Blueprint, jsonify
import os
import json

network_monitoring_bp = Blueprint('network_monitoring', __name__)

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
NETWORK_MONITORING_LOG = os.path.join(BASE_DIR, '..', 'Database', 'Logs', 'Network_Monitoring.json')
CONTROL_STATUS_FILE = os.path.join(BASE_DIR, '..', 'Database', 'control_status.json')

@network_monitoring_bp.route('/get_network_logs', methods=['GET'])
def get_network_logs():
    logs = []
    print(f"[DEBUG] Trying to read: {NETWORK_MONITORING_LOG}")
    if os.path.exists(NETWORK_MONITORING_LOG):
        try:
            with open(NETWORK_MONITORING_LOG, 'r') as f:
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

@network_monitoring_bp.route('/control_status.json', methods=['GET'])
def serve_control_status():
    if os.path.exists(CONTROL_STATUS_FILE):
        try:
            with open(CONTROL_STATUS_FILE) as f:
                data = json.load(f)
                return jsonify(data)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    return jsonify({"status": "SAFE"})
