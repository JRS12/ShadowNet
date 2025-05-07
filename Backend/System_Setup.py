from flask import Blueprint, jsonify, request
import subprocess
import os
import json
import signal

system_setup_bp = Blueprint('system_setup', __name__)

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
HONEYPOT_SERVER = os.path.join(BASE_DIR, '..', 'Honeypot', 'Backend', 'server.py')
CONTROL_STATUS_FILE = os.path.join(BASE_DIR, '..', 'Database', 'control_status.json')
MONITORING_CONFIG = os.path.join(BASE_DIR, '..', 'Database', 'monitoring_config.json')

server_process = None  

@system_setup_bp.route('/start_server', methods=['POST'])
def start_server():
    global server_process
    if server_process is None:
        print("[INFO] Starting Honeypot server...")
        server_process = subprocess.Popen(['python', HONEYPOT_SERVER])
        return jsonify({"status": "started"})
    return jsonify({"status": "already running"})

@system_setup_bp.route('/stop_server', methods=['POST'])
def stop_server():
    global server_process
    if server_process is not None:
        print("[INFO] Stopping Honeypot server...")
        server_process.terminate()
        server_process.wait()
        server_process = None
        return jsonify({"status": "stopped"})
    return jsonify({"status": "not running"})

@system_setup_bp.route('/toggle_monitoring', methods=['POST'])
def toggle_monitoring():
    data = request.get_json()
    monitor_type = data.get('type')
    enabled = data.get('enabled')

    print(f"[INFO] Toggling {monitor_type} to {enabled}")

    if os.path.exists(MONITORING_CONFIG):
        with open(MONITORING_CONFIG, 'r') as f:
            config = json.load(f)
    else:
        config = {}

    config[monitor_type] = enabled

    with open(MONITORING_CONFIG, 'w') as f:
        json.dump(config, f, indent=4)

    return jsonify({"status": "success", "type": monitor_type, "enabled": enabled})

@system_setup_bp.route('/get_control_status', methods=['GET'])
def get_control_status():
    if os.path.exists(CONTROL_STATUS_FILE):
        with open(CONTROL_STATUS_FILE) as f:
            status = json.load(f)
        return jsonify(status)
    return jsonify({"status": "SAFE"})

