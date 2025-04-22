from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import os
import json
from datetime import datetime
from werkzeug.utils import secure_filename

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__, template_folder=os.path.join('..', 'Frontend', 'Templates'))
app.secret_key = '$h@D0WN3t#3003'

ATTACKERS_DB_PATH = os.path.join(BASE_DIR, 'Database', 'Special_User', 'Special_User.db')     
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'Honeypot', 'Frontend', 'Static', 'Images')    
KEYSTROKE_LOG_PATH = os.path.join(BASE_DIR, 'Database', 'Logs', 'keystroke_Monitoring.log')           
FILE_FORENSICS_PATH = os.path.join(BASE_DIR, 'Database', 'Logs', 'File_Forensics.json')
IMAGE_ANALYSIS_PATH = os.path.join(BASE_DIR, 'Database', 'Logs', 'Image_Analysis.json')
WEB_MONITORING_LOG = os.path.join(BASE_DIR, 'Database', 'Logs', 'Web_Monitoring.log')
NETWORK_MONITORING_LOG = os.path.join(BASE_DIR, 'Database', 'Logs', 'Network_Monitoring.log')


app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


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
            return json.load(file)
    return {}

def save_attackers(users):
    with open(ATTACKERS_DB_PATH, 'w') as file:
        json.dump(users, file, indent=4)

def is_monitoring_enabled(monitor_type):
    config_path = os.path.join(BASE_DIR, 'Database', 'monitoring_config.json')
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
        data = request.form
        users = load_attackers()
        username = data.get('username')
        password = data.get('password')
        if username in users and users[username]['password'] == password:
            session['username'] = username
            return redirect(url_for('home'))
        return 'Invalid credentials', 401
    return render_template('Login.html')


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        data = request.form
        file = request.files['photo']
        users = load_attackers()

        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if username in users:
            return 'User already exists', 400

        filename = secure_filename(file.filename)
        file.save(os.path.join(UPLOAD_FOLDER, filename))

        users[username] = {
            'email': email,
            'password': password,
            'profile_pic': filename
        }
        save_attackers(users)
        return redirect(url_for('login'))

    return render_template('Register.html')


@app.route('/upload', methods=['POST'])
def upload():
    if 'username' not in session:
        return redirect(url_for('login'))

    image = request.files['image']
    caption = request.form.get('caption')
    filename = secure_filename(image.filename)
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    image.save(file_path)

    with open(os.path.join(BASE_DIR, 'Database', 'Logs', 'File_Forensics.json'), 'a') as f:
        f.write(f"[{datetime.now()}] Uploaded file: {filename} by {session['username']}\n")

    if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
        os.system(f"exiftool \"{file_path}\" >> \"{os.path.join(BASE_DIR, 'Database', 'Logs', 'Image_Analysis.json')}\"")

    if is_monitoring_enabled("web_monitoring"):
        with open(os.path.join(BASE_DIR, 'Database', 'Logs', 'Web_Monitoring.log'), 'a') as f:
            f.write(f"[{datetime.now()}] {session['username']} uploaded {filename}\n")
    
    if is_monitoring_enabled("network_monitoring"):
         with open(NETWORK_MONITORING_LOG, 'a') as f:
            f.write(f"[{datetime.now()}] Network activity triggered by {session['username']} during upload of {filename}\n")
        return redirect(url_for('home'))


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


@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(host='12.12.12.12', port=8080, debug=True)
