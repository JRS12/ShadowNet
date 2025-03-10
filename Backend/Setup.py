import os
import sys
import hashlib
import json
import secrets
from flask import Flask, render_template, request, redirect, url_for, session

# File paths
CREDENTIALS_FILE = "backend/admin_credentials.json"
SECRET_KEY_FILE = "backend/secret_key.txt"

# Initialize Flask App (Fix static and template folders)
app = Flask(__name__, static_folder="static", template_folder="templates")


# 🔹 Generate Secret Key Per Device 🔹
def generate_secret_key():
    """Generate and store a secure secret key."""
    if not os.path.exists(SECRET_KEY_FILE):
        secret_key = secrets.token_hex(32)
        with open(SECRET_KEY_FILE, "w") as f:
            f.write(secret_key)
    else:
        with open(SECRET_KEY_FILE, "r") as f:
            secret_key = f.read().strip()
    return secret_key


# Set Flask secret key
app.secret_key = generate_secret_key()


# 🔹 Password Hashing Function 🔹
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()


# 🔹 Migrate Function (Future Use) 🔹
def migrate():
    print("[+] Running database migrations...")
    os.makedirs(os.path.dirname(CREDENTIALS_FILE), exist_ok=True)
    if not os.path.exists(CREDENTIALS_FILE):
        with open(CREDENTIALS_FILE, "w") as f:
            json.dump({}, f)
    print("[✔] Migration complete!")


# 🔹 Create Superuser Function 🔹
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


# 🔹 Admin Login Route 🔹
@app.route("/", methods=["GET", "POST"])
def admin_login():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]

        if not os.path.exists(CREDENTIALS_FILE):
            return "Error: No superuser found. Run 'python setup.py createsuperuser' first."

        with open(CREDENTIALS_FILE, "r") as f:
            stored_credentials = json.load(f)

        if username == stored_credentials.get("username") and hash_password(password) == stored_credentials.get(
            "password"
        ):
            session["user"] = username
            return redirect(url_for("admin_dashboard"))
        else:
            return "Invalid username or password. Try again."

    return render_template("admin_login.html")


# 🔹 Dashboard Route 🔹
@app.route("/dashboard")
def admin_dashboard():
    if "user" not in session:
        return redirect(url_for("admin_login"))
    return render_template("admin_dashboard.html")


# 🔹 Setup.py Command Line Interface 🔹
if __name__ == "__main__":
    if len(sys.argv) > 1:
        command = sys.argv[1]
        if command == "migrate":
            migrate()
        elif command == "createsuperuser":
            create_superuser()
        elif command == "runserver":
            app.run(debug=True, host="0.0.0.0", port=8000)
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
