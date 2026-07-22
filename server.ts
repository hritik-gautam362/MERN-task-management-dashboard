import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { connectDB } from './server/config/db.js';
import authRoutes from './server/routes/authRoutes.js';
import taskRoutes from './server/routes/taskRoutes.js';
import { registerUser, loginUser } from './server/controllers/authController.js';
import { getTasks, createTask, updateTask, deleteTask } from './server/controllers/taskController.js';
import { protect } from './server/middleware/auth.js';

dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

async function startServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Connect to Database
  await connectDB();

  // API Routes - standard /api/ prefix
  app.use('/api/auth', authRoutes);
  app.use('/api/tasks', taskRoutes);

  // Direct root compatibility routes as requested in spec
  // POST /register
  app.post('/register', registerUser);
  app.post('/api/register', registerUser);

  // POST /login
  app.post('/login', loginUser);
  app.post('/api/login', loginUser);

  // Task endpoints without /api prefix
  app.get('/tasks', protect, getTasks);
  app.post('/tasks', protect, createTask);
  app.put('/tasks/:id', protect, updateTask);
  app.delete('/tasks/:id', protect, deleteTask);

  // Healthcheck endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Vite Integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Task Management Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
