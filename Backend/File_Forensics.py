from flask import Blueprint, jsonify
import os
import json

file_forensics_bp = Blueprint('file_forensics', __name__)

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
FILE_FORENSICS_LOG = os.path.join(BASE_DIR, '..', 'Database', 'Logs', 'File_Forensics.json')
CONTROL_STATUS_FILE = os.path.join(BASE_DIR, '..', 'Database', 'control_status.json')

@file_forensics_bp.route('/get_file_logs', methods=['GET'])
def get_file_logs():
    logs = []
    print(f"[DEBUG] Reading: {FILE_FORENSICS_LOG}")
    if os.path.exists(FILE_FORENSICS_LOG):
        try:
            with open(FILE_FORENSICS_LOG, 'r') as f:
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

@file_forensics_bp.route('/control_status.json', methods=['GET'])
def serve_control_status_file_forensics():
    if os.path.exists(CONTROL_STATUS_FILE):
        try:
            with open(CONTROL_STATUS_FILE) as f:
                data = json.load(f)
                return jsonify(data)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    return jsonify({"status": "SAFE"})
