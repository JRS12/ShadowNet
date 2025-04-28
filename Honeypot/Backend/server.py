from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import os
import json
from datetime import datetime
import requests
import subprocess
import time
from werkzeug.utils import secure_filename
from uuid import uuid4
from datetime import timedelta

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__),))

app = Flask(__name__, template_folder=os.path.join('..', 'Frontend', 'Templates'),
            static_folder=os.path.join('..', 'Frontend', 'Static'))

app.secret_key = os.getenv('FLASK_SECRET_KEY', '$h@D0WN3t#3003')  

USER_ID_COUNTER = 0
user_request_times = {}

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
ATTACKERS_DB_PATH = os.path.join(PROJECT_ROOT, 'Database', 'Special_User' , 'Special_User.db' )
UPLOAD_FOLDER = os.path.join(PROJECT_ROOT, 'Database', 'File_Uploads')
KEYSTROKE_LOG_PATH = os.path.join(PROJECT_ROOT, 'Database', 'Logs', 'keystroke_Monitoring.log')
FILE_FORENSICS_PATH = os.path.join(PROJECT_ROOT, 'Database', 'Logs', 'File_Forensics.json')
IMAGE_ANALYSIS_PATH = os.path.join(PROJECT_ROOT, 'Database', 'Logs', 'Image_Analysis.json')
WEB_MONITORING_LOG = os.path.join(PROJECT_ROOT, 'Database', 'Logs', 'Web_Monitoring.log')
NETWORK_MONITORING_LOG = os.path.join(PROJECT_ROOT, 'Database', 'Logs', 'Network_Monitoring.log')
VIRUS_TOTAL_API_KEY = os.getenv('VIRUS_TOTAL_API_KEY', '2fcbb9571c50d7632b33d1f040115275a1ebcf37e8c7b0455f52b8ec6bc19143')

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.permanent_session_lifetime = timedelta(minutes=30) 

os.makedirs(os.path.dirname(ATTACKERS_DB_PATH), exist_ok=True)
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(os.path.dirname(KEYSTROKE_LOG_PATH), exist_ok=True)
os.makedirs(os.path.dirname(NETWORK_MONITORING_LOG), exist_ok=True)
os.makedirs(os.path.dirname(WEB_MONITORING_LOG), exist_ok=True)
os.makedirs(os.path.dirname(IMAGE_ANALYSIS_PATH), exist_ok=True)
os.makedirs(os.path.dirname(FILE_FORENSICS_PATH), exist_ok=True)

def load_attackers():
    if os.path.exists(ATTACKERS_DB_PATH):
        with open(ATTACKERS_DB_PATH, 'r') as file:
            try:
                content = file.read().strip()
                if not content:
                    return {}  
                return json.loads(content)
            except json.JSONDecodeError:
                return {}  
    return {}


def save_attackers(users):
    with open(ATTACKERS_DB_PATH, 'w') as file:
        json.dump(users, file, indent=4)

def is_monitoring_enabled(monitor_type):
    config_path = os.path.join(PROJECT_ROOT, 'Database', 'monitoring_config.json')
    if os.path.exists(config_path):
        with open(config_path, 'r') as f:
            config = json.load(f)
        return config.get(monitor_type, False)
    return False

@app.route('/')
def home():
    if 'username' not in session:
        return redirect(url_for('login'))

    images = [img for img in os.listdir(UPLOAD_FOLDER)
              if img.lower().endswith(('.jpg', '.jpeg', '.png', '.exe', '.zip', '.pdf', '.txt', '.docx'))]
    return render_template('Website.html', username=session['username'], photos=images)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user_id = verify_user(username, password)
        if user_id:
            session['username'] = username
            session['user_id'] = user_id
            return redirect(url_for('home'))
        else:
            return render_template('login.html', error="Invalid credentials")
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        if register_user(username, email, password):
            return redirect(url_for('login'))
        else:
            return render_template('register.html', error="Username already exists")
    return render_template('register.html')

def register_user(username, email, password):
    attackers = load_attackers()
    if username in attackers:
        return False

    user_id = str(uuid4())
    attackers[username] = {
        "email": email,
        "password": password,
        "user_id": user_id
    }

    save_attackers(attackers)
    return True

def verify_user(username, password):
    attackers = load_attackers()
    user = attackers.get(username)
    if user and user['password'] == password:
        return user['user_id']
    return None

def allowed_file(filename):
    allowed_extensions = {'jpg', 'jpeg', 'png', 'exe', 'zip', 'pdf', 'txt', 'docx'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

@app.route('/log_keystroke', methods=['POST'])
def log_keystroke():
    data = request.get_json()
    key = data.get('key')
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    log_entry = {
        'user': session.get('username', 'Anonymous'),
        'key': key,
        'timestamp': timestamp
    }

    logs = []
    if os.path.exists(KEYSTROKE_LOG_PATH):
        with open(KEYSTROKE_LOG_PATH, 'r') as f:
            logs = json.load(f)

    logs.append(log_entry)

    with open(KEYSTROKE_LOG_PATH, 'w') as f:
        json.dump(logs, f, indent=4)

    return jsonify({'status': 'success'})

def log_web_monitoring(request, username):
    if is_monitoring_enabled("web_monitoring"):
        entry = {
            "IP Address": request.remote_addr,
            "Date": datetime.now().strftime('%Y-%m-%d'),
            "Time": datetime.now().strftime('%H:%M:%S'),
            "User ID": username,
            "User Agent": request.headers.get('User-Agent'),
            "Path Visited": request.path,
            "Request Method": request.method,
            "Response Code": 200,
            "Session ID": session.get('_id', str(uuid4()))
        }
        with open(WEB_MONITORING_LOG, 'a') as f:
            f.write(json.dumps(entry) + "\n")

def log_network_monitoring(ip, username, message, status="Success"):
    if is_monitoring_enabled("network_monitoring"):
        entry = {
            "IP Address": ip,
            "Username": username,
            "Timestamp": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            "Message": message,
            "Protocol": "HTTP",
            "Port": 8080,
            "Status": status
        }
        with open(NETWORK_MONITORING_LOG, 'a') as f:
            f.write(json.dumps(entry) + "\n")

def is_image(filename):
    return filename.lower().endswith(('.jpg', '.jpeg', '.png'))

def analyze_image_with_exiftool(file_path):
    exiftool_path = get_exiftool_path()
    result = subprocess.run([exiftool_path, file_path], capture_output=True, text=True)

    if result.returncode == 0:
        metadata = result.stdout.strip().split('\n')
        parsed_metadata = {
            "filename": os.path.basename(file_path),
            "analyzed_by": session.get('username', 'Anonymous'),
            "timestamp": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            "metadata": metadata
        }

        logs = []
        if os.path.exists(IMAGE_ANALYSIS_PATH):
            with open(IMAGE_ANALYSIS_PATH, 'r') as f:
                try:
                    logs = json.load(f)
                except json.JSONDecodeError:
                    logs = []

        logs.append(parsed_metadata)

        with open(IMAGE_ANALYSIS_PATH, 'w') as f:
            json.dump(logs, f, indent=4)

def scan_file_with_virustotal(file_path, username):
    if not can_request_virustotal(username):
        return jsonify({'error': 'Request limit exceeded. Please wait before trying again.'}), 429

    with open(file_path, 'rb') as file:
        file_data = file.read()

    url = "https://www.virustotal.com/api/v3/files"
    headers = {
        "x-apikey": VIRUS_TOTAL_API_KEY
    }
    files = {'file': (os.path.basename(file_path), file_data)}
    response = requests.post(url, headers=headers, files=files)

    if response.status_code == 200:
        scan_result = response.json()
        with open(FILE_FORENSICS_PATH, 'a') as f:
            f.write(f"[{datetime.now()}] VirusTotal Result: {json.dumps(scan_result)}\n")
        return jsonify({'status': 'success', 'message': 'File scanned successfully'})
    else:
        return jsonify({'error': 'Error scanning file with VirusTotal'}), 500

def can_request_virustotal(username):
    global user_request_times
    now = time.time()
    window = 60 
    limit = 4    

    if username not in user_request_times:
        user_request_times[username] = []

    user_request_times[username] = [t for t in user_request_times[username] if now - t < window]

    if len(user_request_times[username]) >= limit:
        return False

    user_request_times[username].append(now)
    return True

@app.route('/update_profile', methods=['POST'])
def update_profile():
    if 'username' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    data = request.get_json()
    attackers = load_attackers()

    username = session['username']
    user = attackers.get(username)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    old_password = data.get('oldPassword')
    new_password = data.get('newPassword')
    email = data.get('email')

    if old_password and old_password != user['password']:
        return jsonify({'error': 'Old password incorrect'}), 400

    if new_password:
        user['password'] = new_password
    if email:
        user['email'] = email

    save_attackers(attackers)
    return jsonify({'message': 'Profile updated successfully'})

@app.route('/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return "No file part", 400
    file = request.files['file']
    caption = request.form.get('caption', '')

    if file.filename == '':
        return "No selected file", 400

    if 'username' not in session:
        return redirect(url_for('login'))

    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(file_path)

    file_entry = {
        "filename": filename,
        "uploaded_by": session['username'],
        "timestamp": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        "path": file_path
    }
    with open(FILE_FORENSICS_PATH, 'a') as f:
        f.write(json.dumps(file_entry) + "\n")

    if is_image(filename):
        analyze_image_with_exiftool(file_path)

    scan_file_with_virustotal(file_path, session['username'])

    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return jsonify({'filename': filename, 'caption': caption})

    return jsonify({'status': 'success', 'message': 'File uploaded successfully'})



@app.route('/logout', methods=['GET', 'POST'])
def logout():
    session.pop('user_id', None)
    session.pop('username', None)
    return redirect(url_for('login'))


if __name__ == '__main__': 
    app.run(host='0.0.0.0', port=8080, debug=True)

