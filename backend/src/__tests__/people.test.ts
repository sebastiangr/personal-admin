// src/__tests__/people.test.ts

import { describe, it, expect, beforeAll } from 'vitest';
import supertest from 'supertest';
import express from 'express';
import { execSync } from 'child_process';
import authRoutes from '../routes/auth.routes';
import companyRoutes from '../routes/company.routes';
import personRoutes from '../routes/person.routes';
import { authenticateToken } from '../middlewares/auth.middleware';

// 1. Crear una instancia de Express con TODAS las rutas necesarias
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/companies', authenticateToken, companyRoutes);
app.use('/api/people', authenticateToken, personRoutes);

const request = supertest(app);

// 2. Usar 'describe.sequential' para el flujo lógico
describe.sequential('People & Relationships Endpoints', () => {
  let token: string;
  let testCompanyId: string;
  let testPersonId: string;

  beforeAll(async () => {
    await request.post('/api/auth/register').send({ username: 'user-ppl', password: 'password' });
    const loginRes = await request.post('/api/auth/login').send({ username: 'user-ppl', password: 'password' });
    token = loginRes.body.token;
    const companyRes = await request.post('/api/companies').set('Authorization', `Bearer ${token}`).send({ name: 'Corp' });
    testCompanyId = companyRes.body.id;
  }, 20000);

  it('should create a new person', async () => {
    const response = await request
      .post('/api/people')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Jane Doe' });
      
    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Jane Doe');
    testPersonId = response.body.id;
  });

  it('should assign the person to the company', async () => {
    const response = await request
      .post(`/api/companies/${testCompanyId}/people`)
      .set('Authorization', `Bearer ${token}`)
      .send({ personId: testPersonId, role: 'CEO' });

    expect(response.status).toBe(201);
    expect(response.body.role).toBe('CEO');
  });

  it('should get the list of people assigned to the company', async () => {
    const response = await request
      .get(`/api/companies/${testCompanyId}/people`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].name).toBe('Jane Doe');
    expect(response.body[0].role).toBe('CEO');
  });
});