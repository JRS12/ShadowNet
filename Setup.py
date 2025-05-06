import os
import sys
import hashlib
import json
import secrets
from flask import Flask, render_template, request, redirect, url_for, session
from datetime import timedelta
from Backend.Web_Monitoring import web_monitoring_bp
from Backend.Network_Monitoring import network_monitoring_bp 
from Backend.File_Forensics import file_forensics_bp
from Backend.Keystroke_Monitoring import keystroke_monitoring_bp

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


CREDENTIALS_FILE = os.path.join(BASE_DIR, 'Database', 'Super_User', 'Super_User.db')
SECRET_KEY_FILE = os.path.join(BASE_DIR, 'Backend', 'secret_key.txt')
TEMPLATES_DIR = os.path.join(BASE_DIR, 'Frontend', 'Templates')
STATIC_DIR = os.path.join(BASE_DIR, 'Frontend', 'static' )

app = Flask(__name__,  static_folder = STATIC_DIR ,
                       template_folder = TEMPLATES_DIR )
app.register_blueprint(web_monitoring_bp, url_prefix='/web_monitoring') 
app.register_blueprint(network_monitoring_bp, url_prefix='/network_monitoring')
app.register_blueprint(file_forensics_bp, url_prefix='/file_forensics')
app.register_blueprint(keystroke_monitoring_bp, url_prefix='/keystroke')

def generate_secret_key():
    os.makedirs(os.path.dirname(SECRET_KEY_FILE), exist_ok=True) 
    if not os.path.exists(SECRET_KEY_FILE):
        secret_key = secrets.token_hex(32)
        with open(SECRET_KEY_FILE, "w") as f:
            f.write(secret_key)
    else:
        with open(SECRET_KEY_FILE, "r") as f:
            secret_key = f.read().strip()
    return secret_key

app.secret_key = generate_secret_key()  

app.permanent_session_lifetime = timedelta(minutes=30)

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()
 
def migrate():
    print("[+] Running database migrations...")
    os.makedirs(os.path.dirname(CREDENTIALS_FILE), exist_ok=True)
    if not os.path.exists(CREDENTIALS_FILE):
        with open(CREDENTIALS_FILE, "w") as f:
            json.dump({}, f)
    print("[✔] Migration complete!")

def create_superuser():
    username = input("Enter admin username: ")
    password = input("Enter admin password: ")
    confirm_password = input("Re-enter password: ")

    if password != confirm_password:
        print("[!] Passwords do not match. Try again.")
        return

    credentials = {"username": username, "password": hash_password(password)}

    os.makedirs(os.path.dirname(CREDENTIALS_FILE), exist_ok=True)
    with open(CREDENTIALS_FILE, "w") as f:
        json.dump(credentials, f)

    print("[+] Admin user created successfully!")

@app.route("/", methods=["GET", "POST"])
def admin_login():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]

        if not os.path.exists(CREDENTIALS_FILE):
            return "Error: No superuser found. Run 'python setup.py createsuperuser' first."

        try:
            with open(CREDENTIALS_FILE, "r") as f:
                stored_credentials = json.load(f)
        except json.JSONDecodeError:
            return "Error: Corrupt credentials file. Delete and recreate it."

        if username == stored_credentials.get("username") and hash_password(password) == stored_credentials.get(
            "password"
        ):
            session["user"] = username
            session.permanent = True  
            return redirect(url_for("admin_dashboard"))  
        else:
            return "Invalid username or password. Try again."
    if not os.path.exists(os.path.join(app.template_folder, "Admin-Panel.html")):
        return "Error: Missing Admin-Panel.html template file."

    return render_template("Admin-Panel.html")


@app.route("/dashboard")
def admin_dashboard():
    if "user" not in session:
        return redirect(url_for("admin_login"))  
    if not os.path.exists(os.path.join(app.template_folder, "Control_Panel.html")):
        return "Error: Missing Control_Panel.html template file."

    return render_template("Control_Panel.html")

@app.route('/system_setup')
def system_setup():
    return render_template("System_Setup.html")

@app.route('/web_monitoring')
def web_monitoring():
    return render_template("Web_Monitoring.html")

@app.route('/network_monitoring')
def network_monitoring():
    return render_template("Network_Monitoring.html")

@app.route('/file_forensics')
def file_forensics():
    return render_template("File_Forensics.html")

@app.route('/image_analysis')
def image_analysis():
    return render_template("Image_Analysis.html")

@app.route('/keystroke_monitoring')
def keystroke_monitoring():
    return render_template("Keystroke_Monitoring.html")
 

if __name__ == "__main__":
    if len(sys.argv) > 1:
        command = sys.argv[1]
        if command == "migrate":
            migrate()
        elif command == "createsuperuser":
            create_superuser()
        elif command == "runserver":
            app.run(debug=True, host="127.0.0.1", port=8000)
        else:
            print("Unknown command. Use:")
            print("  python setup.py migrate           # Run database setup")
            print("  python setup.py createsuperuser   # Create admin user")
            print("  python setup.py runserver         # Start the server")
    else:
        print("Usage:")
        print("  python setup.py migrate           # Run database setup")
        print("  python setup.py createsuperuser   # Create admin user")
        print("  python setup.py runserver         # Start the server")


