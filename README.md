# 📝 Task Management Dashboard (MERN Stack)

A simple, modern, full-stack Task Management Application built using the **MERN Stack** (MongoDB, Express.js, React, Node.js) with **JWT Authentication**, **Task CRUD Operations**, **Dashboard Analytics**, **Filtering/Search**, and **Tailwind CSS**.

---

## 🌟 Tech Stack

- **Frontend**: React 19 (Vite), TypeScript, Tailwind CSS, Lucide React Icons, React Router v7, Axios
- **Backend**: Node.js, Express.js, JWT (jsonwebtoken), bcryptjs, CORS
- **Database**: MongoDB (Mongoose ODM) with fallback support for instant live testing
- **Styling**: Tailwind CSS with custom responsive layout & toast notification system

---

## ✨ Features

1. **Authentication**
   - User Registration (`POST /register` & `POST /api/auth/register`)
   - User Login (`POST /login` & `POST /api/auth/login`)
   - Secure JWT Authentication (Bearer token stored in `localStorage`)
   - Logout functionality

2. **Dashboard Overview**
   - **Metrics**: Total Tasks, Completed Tasks, Pending Tasks, High Priority Tasks
   - **Progress Bar**: Visual task completion percentage indicator
   - **Urgent Queue**: Recent pending tasks list with quick status toggle

3. **Task Management (CRUD)**
   - **Create Task**: Title, Description, Priority (Low, Medium, High), Status (Pending, Completed), Due Date
   - **Edit Task**: Update any task field dynamically in a modal dialog
   - **Delete Task**: Delete unwanted tasks with confirmation safeguard
   - **Mark Completed / Pending**: Quick checkbox toggle for task state

4. **Search & Filter Capabilities**
   - Real-time text search across task titles and descriptions
   - Status filtering (`All`, `Pending`, `Completed`)
   - Priority filtering (`All`, `Low`, `Medium`, `High`)
   - Sorting by `Newest`, `Oldest`, or `Due Date`
   - Layout toggle between Grid view and List view

5. **UI & User Experience**
   - Modern Dashboard layout with dark sidebar and responsive mobile drawer
   - Success and error toast notifications
   - Loading spinners and empty state screens
   - Fully responsive across desktop, tablet, and mobile devices

---

## 📁 Folder Structure

```
├── client/ (src/)
│   ├── components/       # Reusable UI components (Sidebar, Navbar, TaskCard, TaskModal, Toast, StatCard)
│   ├── context/          # AuthContext for global user state & toasts
│   ├── pages/            # Page components (Login, Register, Dashboard, Tasks, Profile)
│   ├── services/         # Axios API client & services (authService, taskService)
│   └── types/            # TypeScript models & interface definitions
│
├── server/
│   ├── config/           # Database connection & fallback store
│   ├── controllers/      # Route logic (authController, taskController)
│   ├── middleware/       # Protect middleware for JWT authentication
│   ├── models/           # Mongoose models (User, Task)
│   └── routes/           # Express routers (authRoutes, taskRoutes)
│
├── server.ts             # Main Express server entry point & Vite middleware setup
├── package.json          # Dependencies & build scripts
└── README.md             # Complete project documentation
```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
# Database Connection (MongoDB Atlas)
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/taskmanager?retryWrites=true&w=majority"

# JWT Authentication Secret
JWT_SECRET="super-secret-jwt-key-change-in-production"

# Server Port
PORT=3000
```

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/register` or `/api/auth/register` | Register new user | ❌ |
| `POST` | `/login` or `/api/auth/login` | Authenticate user & receive JWT | ❌ |
| `GET` | `/api/auth/me` | Get authenticated user profile | ✅ |
| `GET` | `/tasks` or `/api/tasks` | Fetch user's tasks (with query params) | ✅ |
| `POST` | `/tasks` or `/api/tasks` | Create a new task | ✅ |
| `PUT` | `/tasks/:id` or `/api/tasks/:id` | Update task details / status | ✅ |
| `DELETE` | `/tasks/:id` or `/api/tasks/:id` | Delete a task by ID | ✅ |

---

## 🚀 Local Installation & Execution

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd task-management-dashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and fill in your MongoDB Atlas URI & JWT secret:
   ```bash
   cp .env.example .env
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:3000`.

5. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

---

## 🌐 Deployment Instructions

### 1. Database (MongoDB Atlas)
- Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- Create a database user and whitelist IP addresses (`0.0.0.0/0` for production hosting).
- Copy the Connection String and set as `MONGODB_URI`.

### 2. Backend Deployment (Render)
- Connect your GitHub repository to [Render](https://render.com).
- Select **Web Service**.
- Set Build Command: `npm install && npm run build`
- Set Start Command: `npm start`
- Add Environment Variables (`MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=production`).

### 3. Frontend Deployment (Vercel)
- Import project to [Vercel](https://vercel.com).
- Framework Preset: **Vite**
- Build Command: `npm run build`
- Output Directory: `dist`

---

## 👤 Author
Developed as a Full-Stack MERN Internship Submission project.
