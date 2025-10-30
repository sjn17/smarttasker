from flask import Flask, abort
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask import render_template, request, jsonify
from flask_login import LoginManager, login_user, logout_user, current_user, UserMixin, login_required
from flask_mail import Mail, Message
import secrets
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime,timedelta
import json
import logging
import os
from flask_cors import CORS


app = Flask(__name__)
app.config['SECRET_KEY'] = secrets.token_hex(24)  
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ["POSTGRES_URL"]
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app,supports_credentials=True)
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = os.environ["MAIL_ID"] # Replace with your email
app.config['MAIL_PASSWORD'] = os.environ["MAIL_PASSWORD"]  # Replace with your email password
app.config['MAIL_DEFAULT_SENDER'] = os.environ["MAIL_ID"]  # Replace with your email
REMINDER_LEAD_MINUTES = 5
logging.basicConfig(level=logging.DEBUG)

mail = Mail(app)
db = SQLAlchemy(app)

class User(db.Model, UserMixin):
    __tablename__ = 'User'
    id = db.Column(db.Integer, primary_key = True, autoincrement = True)
    name = db.Column(db.String(80), unique = True, nullable = False)
    password = db.Column(db.String(255), nullable = False)
    email = db.Column(db.String(120), nullable = False, unique = True)
    email_alert = db.Column(db.Boolean, default = False)
    

    def __repr__(self):
        return f"User: {self.name}, {self.email}"
    
class Event(db.Model):
    __tablename__ = 'Event'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    task_name = db.Column(db.String, nullable=False)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.Time, nullable=False)
    duration = db.Column(db.Integer, nullable=False)
    notes = db.Column(db.Text)
    completed = db.Column(db.Integer, default=0)
    priority = db.Column(db.Integer, default = 5)
    user_id = db.Column(db.Integer, db.ForeignKey('User.id'), nullable = False)
    reminder_sent = db.Column(db.Boolean,default=False)
    
    def __repr__(self) -> str:
        return f"Event: {self.task_name}, Scheduled at {self.date}, {self.time}"

with app.app_context():
    db.create_all()


#Declaring a Login Manager to take care of our login sessions
login_manager = LoginManager(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


#SignUp 
@app.route("/api/signup", methods=["POST"])
def api_signup():
    data = request.get_json()
    # Check if username or email already exists
    if User.query.filter(User.name.ilike(data["username"])).first():
        return jsonify({"message": "Username already exists"}), 400
    if User.query.filter(User.email.ilike(data["email"])).first():
        return jsonify({"message": "Email already exists"}), 400

    hashed_password = generate_password_hash(data["password"])
    user = User(
        name = data["username"],
        password = hashed_password,
        email = data["email"]
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "Registration successful!"}), 201

# Function to generate a random 8-digit password
def generate_random_password():
    return secrets.token_hex(4)[:8]

# Function to send the password reset email
def send_password_reset_email(username, email, new_password):
    user = User.query.filter(User.name.ilike(username)).first()
    if user:
        user.password = generate_password_hash(new_password)
        db.session.commit()
        print(user)
        subject = 'Password Reset'
        recipients = [email]
        msg = Message(subject, recipients=recipients)
        msg.html = render_template('reset_password.html', new_password=new_password, username = username)
        mail.send(msg)
    else:
        pass # User not found, do nothing
    
# API: Get current user info
@app.route("/api/profile", methods=["GET"])
@login_required
def api_profile():
    user = current_user
    return jsonify({
        "username": user.name,
        "email": user.email,
        "email_alert": user.email_alert
    })

# API: Forgot Password
@app.route("/api/forgot_password", methods=["POST"])
def api_forgot_password():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    # validate and send password
    user = User.query.filter(User.name.ilike(username), User.email.ilike(email)).first()
    if not user:
        return jsonify({"error": "No user found with this username and email"}), 400
    new_password = generate_random_password()
    send_password_reset_email(username, email, new_password)
    return jsonify({"message": "Password reset email sent"})

# API: Update email alert setting
@app.route("/api/profile", methods=["PUT"])
@login_required
def api_update_profile():
    data = request.get_json()
    user = current_user
    if "email_alert" in data:
        user.email_alert = bool(data["email_alert"])
        db.session.commit()
    return jsonify({"message": "Profile updated"})


@app.route("/api/tasks", methods=["GET"])
@login_required
def api_get_tasks():
    events = Event.query.filter_by(user_id=current_user.id).order_by(Event.date, Event.time).all()
    event_list = [{
        "id": event.id,
        "task_name": event.task_name,
        "date": str(event.date),
        "time": str(event.time),
        "duration": event.duration,
        "notes": event.notes,
        "completed": event.completed,
        "priority": event.priority,
        "reminder_sent": event.reminder_sent
    } for event in events]
    return jsonify(event_list)

@app.route("/api/task", methods=["POST"])
@login_required
def api_add_task():
    data = request.get_json()
    event = Event(
        task_name = data["task_name"],
        date = datetime.strptime(data["date"], "%Y-%m-%d").date(),
        time = datetime.strptime(data["time"], "%H:%M").time(),
        duration = int(data.get("duration", 0)),
        notes = data.get("notes", ""),
        completed = 0,
        priority = int(data.get("priority", 5)),
        user_id = current_user.id
    )
    db.session.add(event)
    db.session.commit()
    return jsonify({"message": "Task added!", "id": event.id}), 201

@app.route("/api/task/<int:task_id>", methods=["PUT"])
@login_required
def api_edit_task(task_id):
    task = Event.query.get_or_404(task_id)
    if task.user_id != current_user.id:
        abort(403)
    data = request.get_json()
    for field in ["task_name", "date", "time", "duration", "notes", "priority", "completed"]:
        if field in data:
            if field == "date":
                setattr(task, field, datetime.strptime(data[field], "%Y-%m-%d").date())
            elif field == "time":
                time_str = data[field]
                try:
                    setattr(task, field, datetime.strptime(data[field], "%H:%M").time())
                except ValueError:
                    setattr(task, field, datetime.strptime(data[field], "%H:%M:%S").time())        
            else:
                setattr(task, field, data[field])
    db.session.commit()
    return jsonify({"message": "Task updated successfully."})

@app.route("/api/task/<int:task_id>", methods=["DELETE"])
@login_required
def api_delete_task(task_id):
    task = Event.query.get_or_404(task_id)
    if task.user_id != current_user.id:
        abort(403)
    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Task deleted!"})

@app.route("/api/task/<int:task_id>/complete", methods=["POST"])
@login_required
def api_complete_task(task_id):
    task = Event.query.get_or_404(task_id)
    if task.user_id != current_user.id:
        abort(403)
    task.completed = 1
    db.session.commit()
    return jsonify({"message": "Task marked completed."})

@app.route("/api/login", methods=["POST"])
def api_login():
    data = request.get_json()
    user = User.query.filter(User.name.ilike(data["username"])).first()
    if user and check_password_hash(user.password, data["password"]):
        login_user(user)
        return jsonify({"message": "Login successful."})
    else:
        return jsonify({"error": "Invalid credentials."}), 401

@app.route("/api/logout", methods=["POST"])
@login_required
def api_logout():
    logout_user()
    return jsonify({"message": "Logged out."})

# Flask backend: add an endpoint to update password
@app.route("/api/reset_password", methods=["POST"])
@login_required
def api_reset_password():
    data = request.get_json()
    old_password = data.get("old_password")
    new_password = data.get("new_password")
    user = current_user
    if not check_password_hash(user.password, old_password):
        return jsonify({"error": "Old password is incorrect"}), 400
    user.password = generate_password_hash(new_password)
    db.session.commit()
    return jsonify({"message": "Password updated"})



def send_email(user_email, event):
    subject = 'Task Reminder'
    recipients = [user_email]

    # Convert the Event object to a dictionary
    event_dict = {
        "id": event.id,
        "task_name": event.task_name,
        "date": str(event.date),
        "time": str(event.time),
        "duration": event.duration,
        "notes": event.notes,
        "completed": event.completed,
        "priority": event.priority,
        "user_id": event.user_id
    }

    msg = Message(subject, recipients=recipients)
    msg.html = render_template('email_template.html', event=event_dict)
    msg.attach("event_record.json", "application/json", json.dumps(event_dict))

    mail.send(msg)

def check_and_send_reminders():
    with app.app_context():
        now = datetime.now()
        window_end = now + timedelta(minutes=REMINDER_LEAD_MINUTES)
        events = Event.query.filter(
            Event.completed == 0,
            Event.reminder_sent == False
        ).all()
        for event in events:
            event_dt = datetime.combine(event.date, event.time)
            if now < event_dt <= window_end:
                user = User.query.get(event.user_id)
                if user and user.email_alert:
                    try:
                        send_email(user.email, event)
                        event.reminder_sent = True
                        db.session.commit()
                    except Exception as e:
                        logging.error(f"failed to send reminder:{e}")

if __name__ == '__main__':
    scheduler = BackgroundScheduler()
    scheduler.add_job(check_and_send_reminders, 'interval', minutes=1)
    scheduler.start()
    logging.info("Script started.")
    try:
        print(app.url_map)
        app.run(debug=True)
    except Exception as e:
        logging.error(f"An error occurred: {e}")
    finally:
        scheduler.shutdown()
        logging.info("Script terminated.")
        
