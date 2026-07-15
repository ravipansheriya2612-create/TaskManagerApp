# TaskFlow - Full Stack Task Manager

TaskFlow is a MERN stack task management application built during my Pluto Academy internship.

The application allows users to create an account, log in securely, and manage their personal daily tasks. Each user can only access their own tasks.

## Features

- User registration and login
- Password hashing using bcrypt
- JWT-based authentication
- Protected task routes
- Create, view, update and delete tasks
- Mark tasks as completed or pending
- Search tasks by title or description
- Filter tasks by status and priority
- Task statistics dashboard
- Responsive user interface
- Toast notifications
- Persistent login using localStorage

## Tech Stack

### Frontend

- React.js
- React Router DOM
- Axios
- React Hot Toast
- Lucide React
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token
- bcryptjs
- CORS
- dotenv

## Project Structure

```text
TaskManagerApp/
├── Backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env
│   └── package.json
│
└── README.md

## Environment Variables

Copy the example environment files before running the project.

### Backend

```bash
cp Backend/.env.example Backend/.env
```

### Frontend

```bash
cp Frontend/.env.example Frontend/.env
```

After copying, update the values according to your local setup.