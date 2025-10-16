import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import { execSync } from 'child_process';
import express from 'express';

import authRoutes from '../routes/auth.routes';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
const request = supertest(app);

describe('Auth Endpoints', () => {
  
  beforeAll(async () => {    
    execSync('npx prisma migrate reset --force --skip-seed');
  }, 20000);

  it('should register a new user successfully', async () => {
    const response = await request
      .post('/api/auth/register')
      .send({ username: 'testuser', password: 'password123' });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.username).toBe('testuser');
  });

  it('should fail to register a user with a duplicate username', async () => {
    const response = await request
      .post('/api/auth/register')
      .send({ username: 'testuser', password: 'password123' });
      
    expect(response.status).toBe(409);
  });

  it('should login an existing user and return a token', async () => {
    const response = await request
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'password123' });
      
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});