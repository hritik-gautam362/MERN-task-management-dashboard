import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isMongoDBConnected } from '../config/db.js';
import { memoryUsers } from '../config/fallbackStore.js';
import { AuthRequest } from '../middleware/auth.js';

const generateToken = (id: string, email: string, name: string): string => {
  const secret = process.env.JWT_SECRET || 'fallback-super-secret-jwt-key';
  return jwt.sign({ id, email, name }, secret, { expiresIn: '7d' });
};

// @desc    Register a new user
// @route   POST /api/register or POST /register
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: 'Please provide all required fields (name, email, password)' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters long' });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();

    if (isMongoDBConnected) {
      const userExists = await User.findOne({ email: cleanEmail });
      if (userExists) {
        res.status(400).json({ message: 'User already exists with this email' });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email: cleanEmail,
        password: hashedPassword,
      });

      const token = generateToken(user._id.toString(), user.email, user.name);

      res.status(201).json({
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        token,
      });
      return;
    } else {
      // Fallback store
      const existing = memoryUsers.find((u) => u.email === cleanEmail);
      if (existing) {
        res.status(400).json({ message: 'User already exists with this email' });
        return;
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = {
        _id: `user-${Date.now()}`,
        name,
        email: cleanEmail,
        passwordHash,
        createdAt: new Date().toISOString(),
      };

      memoryUsers.push(newUser);

      const token = generateToken(newUser._id, newUser.email, newUser.name);

      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        token,
      });
      return;
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/login or POST /login
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Please provide both email and password' });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();

    if (isMongoDBConnected) {
      const user = await User.findOne({ email: cleanEmail });

      if (user && (await bcrypt.compare(password, user.password as string))) {
        const token = generateToken(user._id.toString(), user.email, user.name);
        res.json({
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          token,
        });
        return;
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
        return;
      }
    } else {
      // Fallback store
      const user = memoryUsers.find((u) => u.email === cleanEmail);

      if (user && (await bcrypt.compare(password, user.passwordHash))) {
        const token = generateToken(user._id, user.email, user.name);
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          token,
        });
        return;
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
        return;
      }
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Get user profile
// @route   GET /api/me or GET /me
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    if (isMongoDBConnected) {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.json(user);
      return;
    } else {
      const user = memoryUsers.find((u) => u._id === req.user?.id);
      if (!user) {
        // Return request user info if fallback
        res.json({
          _id: req.user.id,
          name: req.user.name || 'User',
          email: req.user.email || 'user@example.com',
        });
        return;
      }
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user profile' });
  }
};
