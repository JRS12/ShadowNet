from flask import Blueprint, jsonify
import json
import os

file_forensics = Blueprint('file_forensics', __name__, template_folder='../Frontend/templates', static_folder='../Frontend/static')

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
LOG_PATH = os.path.join(BASE_DIR, '..', 'Database', 'Logs', 'File_Forensics.json')
CONTROL_STATUS_PATH = os.path.join(BASE_DIR, '..', 'Database', 'control_status.json')

@file_forensics.route('/get_file_forensics_data', methods=['GET'])
def get_file_forensics_data():
    try:
        with open(LOG_PATH, 'r') as log_file:
            data = json.load(log_file)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)})

@file_forensics.route('/get_control_status', methods=['GET'])
def get_control_status():
    try:
        with open(CONTROL_STATUS_PATH, 'r') as file:
            status = json.load(file)
        return jsonify(status)
    except Exception as e:
        return jsonify({"error": str(e)})

