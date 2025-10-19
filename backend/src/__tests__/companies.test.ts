import { describe, it, expect, beforeAll } from 'vitest';
import supertest from 'supertest';
import express from 'express';
import { execSync } from 'child_process';
import authRoutes from '../routes/auth.routes';
import companyRoutes from '../routes/company.routes';
import { authenticateToken } from '../middlewares/auth.middleware';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/companies', authenticateToken, companyRoutes); 

const request = supertest(app);

describe.sequential('Company Endpoints CRUD Flow', () => {
  let token: string;
  let companyId: string;
  
  beforeAll(async () => {    
    execSync('npx prisma migrate reset --force --skip-seed');
        
    await request
      .post('/api/auth/register')
      .send({ 
        username: 'testuser-companies', 
        password: 'password123', 
        confirmPassword: 'password123'
      });

    const loginRes = await request
      .post('/api/auth/login')
      .send({ username: 'testuser-companies', password: 'password123' });
        
    token = loginRes.body.token;
  }, 20000);


  it('should fail to create a company without a name (400 Bad Request)', async () => {
    const response = await request
      .post('/api/companies')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'BACKLOG' }); // Sin 'name'
      
    expect(response.status).toBe(400);
  });

  it('should start with an empty array of companies', async () => {
    const response = await request
      .get('/api/companies')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should create a new company', async () => {
    const response = await request
      .post('/api/companies')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Innovatech' });
    
    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Innovatech');
    companyId = response.body.id; 
  });

  it('should get the created company by its ID', async () => {
    const response = await request
      .get(`/api/companies/${companyId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(companyId);
  });

  it('should update the company', async () => {
    const response = await request
      .put(`/api/companies/${companyId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'IN_PROGRESS' });
      
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('IN_PROGRESS');
  });

  it('should delete the company', async () => {
    const response = await request
      .delete(`/api/companies/${companyId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(204);
  });

  it('should receive a 404 when trying to fetch the deleted company', async () => {
    const response = await request
      .get(`/api/companies/${companyId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(404);
  });
});