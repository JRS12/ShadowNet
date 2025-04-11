from flask import Flask, render_template, request, redirect, url_for, session
import os
import sqlite3
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'honeypot_secret'  # Make it secure later

# Log keystrokes
def log_keystroke(data):
    with open("../../../database/keystroke_logs.txt", "a") as log:
        log.write(f"{datetime.now()} | {data}\n")

# Connect to DB
def get_db_connection():
    conn = sqlite3.connect('../../../database/attackers.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/')
def index():
    return render_template('website.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        conn = get_db_connection()
        user = conn.execute('SELECT * FROM attackers WHERE username=? AND password=?', (username, password)).fetchone()
        conn.close()
        if user:
            session['user'] = username
            return redirect('/')
        return 'Invalid credentials'
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        photo = request.files['photo']
        filename = f"uploads/{photo.filename}"
        photo.save(f"./static/{filename}")

        conn = get_db_connection()
        conn.execute("INSERT INTO attackers (username, email, password, photo) VALUES (?, ?, ?, ?)",
                     (username, email, password, filename))
        conn.commit()
        conn.close()

        # Optionally send to image + file forensics modules
        return redirect('/login')
    return render_template('register.html')

@app.route('/log_keystroke', methods=['POST'])
def log_keystroke_endpoint():
    data = request.json
    log_keystroke(f"{session.get('user', 'Anonymous')} | {data.get('key')}")
    return '', 204

@app.route('/logout')
def logout():
    session.clear()
    return redirect('/login')

if __name__ == '__main__':
    app.run(host='12.12.12.12', port=8080, debug=True)
