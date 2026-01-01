import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../app';
import { AppDataSource } from '../../shared/config/database';

describe.skip('Auth Integration Tests', () => {
  let _authToken: string;
  let userId: number;

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    await AppDataSource.synchronize(true);
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app).post('/auth/register').send({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', 'test@example.com');
      expect(response.body.user).not.toHaveProperty('password');

      _authToken = response.body.token;
      userId = response.body.user.id;
    });

    it('should return 409 if email already exists', async () => {
      const response = await request(app).post('/auth/register').send({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 if email is invalid', async () => {
      const response = await request(app).post('/auth/register').send({
        email: 'invalid-email',
        password: 'password123',
      });

      expect(response.status).toBe(400);
    });

    it('should return 400 if password is too short', async () => {
      const response = await request(app).post('/auth/register').send({
        email: 'new@example.com',
        password: '123',
      });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app).post('/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should return 401 with invalid password', async () => {
      const response = await request(app).post('/auth/login').send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 with non-existent email', async () => {
      const response = await request(app).post('/auth/login').send({
        email: 'nonexistent@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(401);
    });

    it('should return 400 with invalid email format', async () => {
      const response = await request(app).post('/auth/login').send({
        email: 'invalid-email',
        password: 'password123',
      });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /auth/:id', () => {
    it('should get user by id', async () => {
      const response = await request(app).get(`/auth/${userId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('email', 'test@example.com');
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 404 if user not found', async () => {
      const response = await request(app).get('/auth/99999');

      expect(response.status).toBe(404);
    });

    it('should return 400 if id is not a number', async () => {
      const response = await request(app).get('/auth/invalid');

      expect(response.status).toBe(400);
    });
  });
});
