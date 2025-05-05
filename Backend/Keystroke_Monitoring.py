from flask import Blueprint, jsonify
import json
from datetime import datetime

keystroke_monitoring = Blueprint('keystroke_monitoring', __name__)

@keystroke_monitoring.route('/get_keystroke_logs')
def get_keystroke_logs():
    try:
        with open('ShadowNet\Database\Logs\keystroke_Monitoring.json', 'r') as f:
            logs = json.load(f)

        with open('ShadowNet\Database\Attack_Keyword.json', 'r') as f:
            keywords = json.load(f)

        attack_detected = False
        attack_type = "None"

        for log in logs:
            keystroke = log.get("keystroke", "").lower()
            for attack, keys in keywords.items():
                for keyword in keys:
                    if keyword.lower() in keystroke:
                        attack_detected = True
                        attack_type = attack
                        log["attack_status"] = "UNDER ATTACK"
                        log["attack_type"] = attack
                        break
                if attack_detected:
                    break
            if not attack_detected:
                log["attack_status"] = "SAFE"
                log["attack_type"] = "None"

        control_status = {
            "status": "UNDER ATTACK" if attack_detected else "SAFE",
            "type": attack_type,
            "last_checked": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        with open('ShadowNet\Database\control_status.json', 'w') as f:
            json.dump(control_status, f, indent=4)

        return jsonify(logs)

    except Exception as e:
        return jsonify({"error": str(e)})
