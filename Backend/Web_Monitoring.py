from flask import Blueprint, jsonify
import os
import json

web_monitoring_bp = Blueprint('web_monitoring', __name__)
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
WEB_MONITORING_LOG = os.path.join(BASE_DIR, '..', '..', 'Database', 'Logs', 'Web_Monitoring.json')

@web_monitoring_bp.route('/get_web_logs', methods=['GET'])
def get_web_logs():
    logs = []
    if os.path.exists(WEB_MONITORING_LOG):
        with open(WEB_MONITORING_LOG, 'r') as f:
            for line in f:
                try:
                    logs.append(json.loads(line.strip()))
                except json.JSONDecodeError:
                    continue
    return jsonify(logs)
