# SmartTasker - Todo App with Email Reminders

A full-stack web application for managing tasks with automated email reminders. Built with React, TypeScript, and Flask.

## Features

- **User Authentication**
  - Secure sign up and login
  - Protected routes
  - Session management

- **Task Management**
  - Create, edit, and delete tasks
  - Mark tasks as complete/incomplete
  - View tasks in a clean, organized interface
  - Set due dates and times for tasks

- **Email Reminders**
  - Automated email notifications for upcoming tasks
  - Configurable reminder timing
  - Background processing for reliable delivery

- **Responsive Design**
  - Works on desktop and mobile devices
  - Modern UI with Material-UI components

## Tech Stack

### Frontend
- React 19 with TypeScript
- Material-UI (MUI) for UI components
- React Router for navigation
- Axios for API requests
- Emotion for styling

### Backend
- Python 3.11
- Flask web framework
- SQLAlchemy ORM
- Flask-Login for authentication
- Flask-Mail for email notifications
- APScheduler for background tasks
- PostgreSQL database

## Prerequisites

- Node.js (v18+)
- Python 3.9+
- PostgreSQL
- Git

## Getting Started

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/smarttasker.git
   cd smarttasker
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   FLASK_APP=app.py
   FLASK_ENV=development
   SECRET_KEY=your-secret-key
   DATABASE_URL=postgresql://username:password@localhost:5432/smarttasker
   MAIL_SERVER=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USE_TLS=True
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=your-app-specific-password
   ```

5. Initialize the database:
   ```bash
   python create_db.py
   ```

6. Run the Flask development server:
   ```bash
   flask run
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd smart-tasker-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
smarttasker/
├── .venv/                   # Python virtual environment
├── migrations/              # Database migrations
├── smart-tasker-frontend/   # React frontend
│   ├── public/              # Static files
│   └── src/                 # Source files
│       ├── components/      # Reusable components
│       ├── pages/           # Page components
│       ├── App.tsx          # Main App component
│       └── main.tsx         # Entry point
├── .env.example             # Example environment variables
├── app.py                   # Flask application
├── create_db.py             # Database initialization
├── requirements.txt         # Python dependencies
└── README.md                # This file
```

## API Endpoints

- `POST /api/register` - Register a new user
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/tasks` - Get all tasks for current user
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/<id>` - Update a task
- `DELETE /api/tasks/<id>` - Delete a task

## Email Reminders

The application uses APScheduler to check for upcoming tasks every minute. When a task's due date is within the configured reminder time (default: 30 minutes), an email reminder is sent to the user.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with TypeScript using React and Flask
- Material-UI for beautiful UI components
- Flask-Mail for email notifications
- APScheduler for background task scheduling
