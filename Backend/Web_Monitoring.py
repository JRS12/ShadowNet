from flask import Blueprint, jsonify
import os
import json

web_monitoring_bp = Blueprint('web_monitoring', __name__)

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
WEB_MONITORING_LOG = os.path.join(BASE_DIR, '..', '..', 'Database', 'Logs', 'Web_Monitoring.json')
CONTROL_STATUS_FILE = os.path.join(BASE_DIR, '..', '..', 'Database', 'control_status.json')

@web_monitoring_bp.route('/get_web_logs', methods=['GET'])
def get_web_logs():
    logs = []
    print(f"[DEBUG] Attempting to load file: {WEB_MONITORING_LOG}")
    
    if os.path.exists(WEB_MONITORING_LOG):
        print("[DEBUG] File exists. Reading contents...")
        try:
            with open(WEB_MONITORING_LOG, 'r') as f:
                content = f.read()
                print(f"[DEBUG] File loaded successfully. Content length: {len(content)} bytes")
                
                if content.strip().startswith('['):  # JSON array
                    logs = json.loads(content)
                    print("[DEBUG] JSON parsed as list.")
                else:
                    for line in content.strip().splitlines():
                        try:
                            logs.append(json.loads(line))
                        except json.JSONDecodeError as je:
                            print("[ERROR] JSON decode error in line:", je)
        except Exception as e:
            print("[ERROR] Exception while reading file:", e)
            return jsonify({"error": str(e)}), 500
    else:
        print("[ERROR] File does not exist:", WEB_MONITORING_LOG)

    print(f"[DEBUG] Returning {len(logs)} log entries.")
    return jsonify(logs)


@web_monitoring_bp.route('/control_status.json', methods=['GET'])
def serve_control_status():
    print(f"[DEBUG] Attempting to load: {CONTROL_STATUS_FILE}")

    if os.path.exists(CONTROL_STATUS_FILE):
        try:
            with open(CONTROL_STATUS_FILE) as f:
                data = json.load(f)
                print(f"[DEBUG] control_status.json loaded. Data: {data}")
                return jsonify(data)
        except Exception as e:
            print("[ERROR] Failed to read control_status.json:", e)
            return jsonify({"error": str(e)}), 500
    else:
        print("[ERROR] control_status.json file does not exist.")
        return jsonify({"status": "SAFE"})
