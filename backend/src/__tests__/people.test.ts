import { describe, it, expect, beforeAll } from 'vitest';
import supertest from 'supertest';
import express from 'express';
import { execSync } from 'child_process';

import authRoutes from '../routes/auth.routes';
import companyRoutes from '../routes/company.routes';
import personRoutes from '../routes/person.routes';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/people', personRoutes);

const request = supertest(app);

describe('People and Relationships Endpoints', () => {

  let token: string;
  let testCompanyId: string;
  let testPersonId: string;


  beforeAll(async () => {

    execSync('npx prisma migrate reset --force --skip-seed');
    
    await request
      .post('/api/auth/register')
      .send({ username: 'testuser-people', password: 'password123' });
    
    const loginRes = await request
      .post('/api/auth/login')
      .send({ username: 'testuser-people', password: 'password123' });
    
    token = loginRes.body.token;

    const companyRes = await request
      .post('/api/companies')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Corp', type: 'SOFTWARE_COMPANY' });
    
    testCompanyId = companyRes.body.id;
  }, 20000);

  describe('CRUD for Person', () => {
    it('should create a new person', async () => {
      const response = await request
        .post('/api/people')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'John Doe', email: 'john.doe@testcorp.com' });
        
      expect(response.status).toBe(201);
      expect(response.body.name).toBe('John Doe');
      expect(response.body).toHaveProperty('id');
      
      testPersonId = response.body.id;
    });

    it('should get all people for the user', async () => {
      const response = await request
        .get('/api/people')
        .set('Authorization', `Bearer ${token}`);
        
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(1);
      expect(response.body[0].name).toBe('John Doe');
    });

    // TODO: Add Get by ID, UPDATE y DELETE    
  });

  describe('Company-Person Relationships', () => {
    it('should fail to assign if personId is missing', async () => {
      const response = await request
        .post(`/api/companies/${testCompanyId}/people`)
        .set('Authorization', `Bearer ${token}`)
        .send({ role: 'Developer' });
      
      expect(response.status).toBe(400);
    });
    
    it('should assign a person to a company with a role', async () => {
      expect(testCompanyId).toBeDefined();
      expect(testPersonId).toBeDefined();

      const response = await request
        .post(`/api/companies/${testCompanyId}/people`)
        .set('Authorization', `Bearer ${token}`)
        .send({ personId: testPersonId, role: 'Senior Developer' });

      expect(response.status).toBe(201);
      expect(response.body.companyId).toBe(testCompanyId);
      expect(response.body.personId).toBe(testPersonId);
      expect(response.body.role).toBe('Senior Developer');
    });

    it('should fail to assign the same person to the same company again', async () => {
      const response = await request
        .post(`/api/companies/${testCompanyId}/people`)
        .set('Authorization', `Bearer ${token}`)
        .send({ personId: testPersonId, role: 'Team Lead' });
      
      expect(response.status).toBe(409);
    });

    it('should get all people assigned to a specific company', async () => {
      const response = await request
        .get(`/api/companies/${testCompanyId}/people`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(1);
      expect(response.body[0].name).toBe('John Doe');
      expect(response.body[0].role).toBe('Senior Developer');
    });

    it('should get a company and see the assigned people in the response (from getAllPeople)', async () => {
        const response = await request
            .get('/api/people')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        const person = response.body[0];
        expect(person.companies).toBeInstanceOf(Array);
        expect(person.companies.length).toBe(1);
        expect(person.companies[0].company.name).toBe('Test Corp');
    });
  });
});