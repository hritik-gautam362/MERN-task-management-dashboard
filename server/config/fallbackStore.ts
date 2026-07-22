import bcrypt from 'bcryptjs';

export interface MemoryUser {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface MemoryTask {
  _id: string;
  user: string; // userId
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'Completed';
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

// Initial demo memory store
export const memoryUsers: MemoryUser[] = [];
export const memoryTasks: MemoryTask[] = [];

// Seed demo user and tasks if empty
export const seedFallbackData = async () => {
  if (memoryUsers.length === 0) {
    const demoPasswordHash = await bcrypt.hash('password123', 10);
    const demoUser: MemoryUser = {
      _id: 'demo-user-id-001',
      name: 'Demo Student',
      email: 'demo@example.com',
      passwordHash: demoPasswordHash,
      createdAt: new Date().toISOString(),
    };
    memoryUsers.push(demoUser);

    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    memoryTasks.push(
      {
        _id: 'task-001',
        user: demoUser._id,
        title: 'Complete MERN Stack Internship Submission',
        description: 'Build JWT Authentication, Task CRUD, and Dashboard UI with React & Express.',
        priority: 'High',
        status: 'Completed',
        dueDate: now.toISOString().split('T')[0],
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        _id: 'task-002',
        user: demoUser._id,
        title: 'Write Deployment & README Documentation',
        description: 'Document installation, environment variables, API endpoints, and Render/Vercel deployment guides.',
        priority: 'High',
        status: 'Pending',
        dueDate: tomorrow.toISOString().split('T')[0],
        createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        _id: 'task-003',
        user: demoUser._id,
        title: 'Review System Design & API Performance',
        description: 'Verify MongoDB schema design, indexing, and express middleware flow.',
        priority: 'Medium',
        status: 'Pending',
        dueDate: nextWeek.toISOString().split('T')[0],
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        _id: 'task-004',
        user: demoUser._id,
        title: 'Setup Environment Variables on Vercel',
        description: 'Configure MONGODB_URI and JWT_SECRET on remote platform.',
        priority: 'Low',
        status: 'Pending',
        dueDate: nextWeek.toISOString().split('T')[0],
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      }
    );
  }
};

seedFallbackData();
