import { Request, Response } from 'express';
import prisma from '../lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const registerUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  
  try {
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, password: hashedPassword },
    });

    res.status(201).json({ id: user.id, username: user.username });
  } catch (error) {    
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const tokenPayload = { userId: user.id, username: user.username };
    const userToken = jwt.sign(tokenPayload, JWT_SECRET!, { expiresIn: '8h' });
    
    res.json({ token: userToken });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMe = async (req: Request, res: Response) => {
  res.json({ id: req.user!.userId, username: req.user!.username });
};