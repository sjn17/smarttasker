from flask import Flask, abort
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func, create_engine
from sqlalchemy.dialects.postgresql import psycopg2
from werkzeug.security import generate_password_hash, check_password_hash
from flask import render_template, redirect, url_for, session, request, jsonify, flash
from flask_login import LoginManager, login_user, logout_user, current_user, UserMixin, login_required
from flask_mail import Mail, Message
import secrets
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime,timedelta
import json
import logging
import os
import tempfile


app = Flask(__name__)
app.config['SECRET_KEY'] = secrets.token_hex(24)  
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ["VERCEL_POSTGRES_URL"]
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

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

from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, DateField, TimeField, IntegerField, TextAreaField, BooleanField
from wtforms.validators import DataRequired, Email, EqualTo

class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Login')
    
class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Register')

class EventForm(FlaskForm):
    task_name = StringField('Task Name', validators=[DataRequired()])
    date = DateField('Date', format='%Y-%m-%d', validators=[DataRequired()])
    time = TimeField('Time', format='%H:%M', validators=[DataRequired()])
    duration = IntegerField('Duration (minutes)', validators=[DataRequired()])
    notes = TextAreaField('Notes')
    completed = IntegerField('Completed', default=0)  # Assuming it's a checkbox or similar
    priority = IntegerField('Priority', default = 5) # 5 is the least prioritised task.
    submit = SubmitField('Submit')

class EmailForm(FlaskForm):
    email_alert = BooleanField('Email Alert', validators = [DataRequired()])
    submit = SubmitField('Submit')
    
class ForgotPasswordForm(FlaskForm):
    username = StringField('username', validators=[DataRequired()])
    email = StringField('Email', validators=[DataRequired(), Email()])
    submit = SubmitField('Send Password Reset Email')

with app.app_context():
    db.create_all()


#Declaring a Login Manager to take care of our login sessions
login_manager = LoginManager(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()

    if form.validate_on_submit():
        try:
            user = User.query.filter(User.name.ilike(form.username.data)).first()
    
            print('inside user login ')
            print(user)
            print(f'user_id {user.id}')
            if user:
                if check_password_hash(user.password, form.password.data):
                    login_user(user)
                    flash('Login successful!', 'success')
                    return redirect(url_for('index'))
                else:
                    flash('Wrong Password. Please try again..')
            else:
                flash('Invalid Credentials, please try again..')
        except Exception:
            flash('User not Found, Please check if you are entering username and password correctly..')
    return render_template('login.html', form = form)

#Log Out Route 
@app.route('/logout') 
@login_required
def logout():
    logout_user()
    flash('You have been logged out.', 'info')
    return redirect(url_for('login'))

#SignUp 
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    form = RegistrationForm()
    if form.validate_on_submit():
        existing_user = User.query.filter(User.name.ilike(form.username.data)).first()
        if existing_user:
            flash('Username already exists please pick a different one..!!')
            return redirect(url_for('signup'))
        else:
            try:
                user = User(
                    name = form.username.data,
                    password = generate_password_hash(form.password.data),
                    email = form.email.data
                )
                db.session.add(user)
                db.session.commit()
                flash('Registration successful! You can now log in.', 'success')
                return redirect(url_for('login'))
            except Exception as e:
                flash(f'An error occurred: {str(e)}', 'danger')
                return redirect(url_for('signup'))
    return render_template('signup.html', form = form)

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
        flash('Password reset email sent. Check your email for instructions.', 'success')
    else:
        flash('No user found with the provided email address.', 'danger')
        
        
@app.route('/forgot_password', methods = ['GET', 'POST'])
def forgot_password():
    form = ForgotPasswordForm()
    if form.validate_on_submit():
        username = form.username.data
        email = form.email.data
        # Call your function to send the password reset email
        new_password = generate_random_password()
        send_password_reset_email(username, email, new_password)
        return redirect(url_for('login'))

    return render_template('forgot_password.html', form=form)
    
    
#This is the home page and our dashboard page where our tasks scheduled are appeared.. 
@app.route('/', methods = ['GET', 'POST'])
@login_required
def index():
    tasks = Event.query.filter_by(user_id=current_user.id, completed = 0).order_by(Event.date, Event.time).all()
    return render_template('index.html', tasks=tasks, current_user=current_user)

#When we want to add a new task and on clicking Add Event Button this triggers.. 
@app.route('/add_event', methods=['GET', 'POST']) 
@login_required
def add_event():
    form = EventForm()
    if form.validate_on_submit():
        event = Event(
        task_name = form.task_name.data,
        date = form.date.data,
        time = form.time.data,
        duration = form.duration.data,
        notes = form.notes.data,
        completed = form.completed.data,
        priority = form.priority.data,
        user_id=current_user.id
        )
        db.session.add(event)
        db.session.commit()
        
        return redirect(url_for('index'))

    return render_template('add.html', form = form, current_user=current_user)

#When we want to get the details of a task we fetch the information as follows using task_id
@app.route('/get_task_details/<int:task_id>', methods=['GET'])
@login_required
def get_task_details(task_id):
    
    try:
        task_details = Event.query.get_or_404(id=int(task_id))
        
        if task_details:
            # Convert the task details to a dictionary and return as JSON response
            task_dict = {
                "id": task_details.id,
                "name": task_details.task_name,
                "date": task_details.date,
                "time": task_details.time,
                "duration": task_details.duration,
                "notes": task_details.notes,
                "completed": task_details.completed

            }
            return jsonify(task_dict)
        else:
            # Return a 404 error if the task is not found
            return jsonify({"error": "Task not found"}), 404
    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500
  

#When edit task is clicked it gives this function some work to do.. so any new edits are updated.. 
@app.route('/edit_task/<int:task_id>', methods=['GET','POST']) 
@login_required
def edit_task(task_id):
    task = Event.query.get_or_404(task_id)
    form = EventForm(obj=task)

    if form.validate_on_submit():
        form.populate_obj(task)
        db.session.commit()
        flash('Task updated successfully', 'success')
        return redirect(url_for('index'))

    return render_template('edit_task.html', form=form, current_user=current_user, task=task)

    
#Upon clicking completed on the frontend.. the task_id is marked to completed in the backend here.. 
@app.route('/mark_completed/<int:task_id>', methods=['POST']) 
@login_required
def mark_completed(task_id):
    task = Event.query.get_or_404(task_id)
    task.completed = 1
    db.session.commit()
    return redirect(url_for('index'))

@app.route('/completed_tasks', methods = ['GET', 'POST'])
def completed_tasks():
    tasks = Event.query.filter_by(user_id = current_user.id ,completed=1).all()
    return render_template('completed_tasks.html', tasks=tasks, current_user=current_user)

@app.route('/prioritize_schedule', methods = ['GET', 'POST'])
def prioritize_schedule():
    return render_template('index.html')    

@app.route('/prioritize_task/<int:task_id>', methods=['POST']) 
@login_required
def prioritize_task(task_id):
    task = Event.query.get_or_404(task_id)
    # Get the priority from the form data
    priority = int(request.form.get('priority', 5))  # Assuming 5 as the default priority
    # Update the task priority
    task.priority = priority
    db.session.commit()
    return redirect(url_for('index'))

@app.route('/email_alert_settings', methods = ['GET','POST'])
def email_alert_settings():
    return render_template('email_alert.html')

@app.route('/update_email_alert', methods=['POST'])
def update_email_alert():
    # Assuming you have a form with a checkbox named 'email_alert'
    email_alert = bool(request.form.get('email_alert'))

    # Update the email_alert field in the User model for the current user
    current_user.email_alert = email_alert
    db.session.commit()
    print(f'current User: {current_user.email_alert}')
    return redirect(url_for('index'))  # Redirect to the desired page after updating


@app.route('/add_task', methods = ['GET', 'POST'])
def add_task():
    return redirect(url_for('add_event'))

@app.route('/delete_task/<int:task_id>', methods=['GET','POST'])
@login_required
def delete_task(task_id):
    task = Event.query.get_or_404(task_id)

    # Ensure the task belongs to the current user
    if task.user_id != current_user.id:
        abort(403)  # Forbidden

    db.session.delete(task)
    db.session.commit()

    flash('Task deleted successfully', 'success')
    return redirect(url_for('index'))    


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
        app.run(debug=True)
    except Exception as e:
        logging.error(f"An error occurred: {e}")
    finally:
        scheduler.shutdown()
        logging.info("Script terminated.")
        
