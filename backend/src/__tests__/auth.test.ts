import { describe, it, expect, beforeAll } from 'vitest';
import supertest from 'supertest';
import { execSync } from 'child_process';
import express from 'express';
import authRoutes from '../routes/auth.routes';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

const request = supertest(app);

describe.sequential('Auth Endpoints', () => {
  
  beforeAll(async () => {
    try {
      execSync('npx prisma migrate reset --force --skip-seed');
    } catch (error) {
      console.error("Fallo en 'prisma migrate reset'. Asegúrate de que la DB de Docker esté corriendo.", error);
      throw error;
    }
  }, 20000);

  it('should FAIL to register if username is missing', async () => {
    const response = await request
      .post('/api/auth/register')
      .send({ password: 'password123', confirmPassword: 'password123' });
    
    expect(response.status).toBe(400);
    expect(response.body.details[0].message).toContain('username');
  });

  it('should FAIL to register if password is missing', async () => {
    const response = await request
      .post('/api/auth/register')
      .send({ username: 'testuser'});
    
    expect(response.status).toBe(400);
    expect(response.body.details[0].message).toContain('password');
  });  

  it('should register a new user successfully', async () => {
    const response = await request
      .post('/api/auth/register')      
      .send({ username: 'testuser', password: 'password123', confirmPassword: 'password123' });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.username).toBe('testuser');
  });

  it('should FAIL to register a user with a duplicate username', async () => {
    const response = await request
      .post('/api/auth/register')
      .send({ username: 'testuser', password: 'password123', confirmPassword: 'password123' }); // Intentamos registrar el mismo usuario
      
    expect(response.status).toBe(409); // Esperamos un error de "Conflicto"
    expect(response.body.error).toBe('Username already taken');
  });

  it('should FAIL to login with incorrect password', async () => {
    const response = await request
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'wrongpassword'});
      
    expect(response.status).toBe(401); // Esperamos "No autorizado"
    expect(response.body.error).toBe('Invalid credentials');
  });

  it('should login the existing user and return a token', async () => {
    const response = await request
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'password123'});
      
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(typeof response.body.token).toBe('string');
  });
});