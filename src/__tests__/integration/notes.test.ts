/*----- libraries imports -----*/
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';

/*----- internal imports -----*/
import app from '../../app';
import { AppDataSource } from '../../shared/config/database';

describe.skip('Notes Integration Tests', () => {
  let authToken: string;
  let authToken2: string;
  let _userId: number;
  let _userId2: number;
  let noteId: number;

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    await AppDataSource.synchronize(true);

    const user1Response = await request(app).post('/auth/register').send({
      email: 'user1@example.com',
      password: 'password123',
    });
    authToken = user1Response.body.token;
    _userId = user1Response.body.user.id;

    const user2Response = await request(app).post('/auth/register').send({
      email: 'user2@example.com',
      password: 'password123',
    });
    authToken2 = user2Response.body.token;
    _userId2 = user2Response.body.user.id;
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  describe('POST /notes', () => {
    it('should create a note with authentication', async () => {
      const response = await request(app)
        .post('/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Note',
          content: 'Test Content',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('title', 'Test Note');
      expect(response.body).toHaveProperty('content', 'Test Content');

      noteId = response.body.id;
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app).post('/notes').send({
        title: 'Test Note',
        content: 'Test Content',
      });

      expect(response.status).toBe(401);
    });

    it('should return 400 with invalid data', async () => {
      const response = await request(app)
        .post('/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: '',
          content: 'Test Content',
        });

      expect(response.status).toBe(400);
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .post('/notes')
        .set('Authorization', 'Bearer invalid-token')
        .send({
          title: 'Test Note',
          content: 'Test Content',
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /notes', () => {
    it('should get all notes for authenticated user', async () => {
      const response = await request(app)
        .get('/notes')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('own');
      expect(response.body).toHaveProperty('shared');
      expect(response.body.own).toBeInstanceOf(Array);
      expect(response.body.own.length).toBeGreaterThan(0);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app).get('/notes');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /notes/:id', () => {
    it('should get a specific note if user is owner', async () => {
      const response = await request(app)
        .get(`/notes/${noteId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('note');
      expect(response.body).toHaveProperty('isOwner', true);
    });

    it('should return 403 if user is not owner or collaborator', async () => {
      const response = await request(app)
        .get(`/notes/${noteId}`)
        .set('Authorization', `Bearer ${authToken2}`);

      expect(response.status).toBe(403);
    });

    it('should return 404 if note not found', async () => {
      const response = await request(app)
        .get('/notes/99999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /notes/:id', () => {
    it('should update note if user is owner', async () => {
      const response = await request(app)
        .put(`/notes/${noteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Title',
          content: 'Updated Content',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('title', 'Updated Title');
      expect(response.body).toHaveProperty('content', 'Updated Content');
    });

    it('should return 403 if user is not owner or collaborator', async () => {
      const response = await request(app)
        .put(`/notes/${noteId}`)
        .set('Authorization', `Bearer ${authToken2}`)
        .send({
          title: 'Hacked Title',
        });

      expect(response.status).toBe(403);
    });

    it('should return 400 with invalid data', async () => {
      const response = await request(app)
        .put(`/notes/${noteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: '',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /notes/:id/share', () => {
    it('should share note with another user', async () => {
      const response = await request(app)
        .post(`/notes/${noteId}/share`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          email: 'user2@example.com',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        'message',
        'Nota compartida exitosamente'
      );
    });

    it('should allow collaborator to view shared note', async () => {
      const response = await request(app)
        .get(`/notes/${noteId}`)
        .set('Authorization', `Bearer ${authToken2}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('isOwner', false);
    });

    it('should allow collaborator to edit shared note', async () => {
      const response = await request(app)
        .put(`/notes/${noteId}`)
        .set('Authorization', `Bearer ${authToken2}`)
        .send({
          title: 'Edited by Collaborator',
        });

      expect(response.status).toBe(200);
    });

    it('should return 403 if non-owner tries to share', async () => {
      const response = await request(app)
        .post(`/notes/${noteId}/share`)
        .set('Authorization', `Bearer ${authToken2}`)
        .send({
          email: 'user1@example.com',
        });

      expect(response.status).toBe(403);
    });

    it('should return 404 if collaborator email not found', async () => {
      const response = await request(app)
        .post(`/notes/${noteId}/share`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          email: 'nonexistent@example.com',
        });

      expect(response.status).toBe(404);
    });

    it('should return 400 if sharing with self', async () => {
      const response = await request(app)
        .post(`/notes/${noteId}/share`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          email: 'user1@example.com',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /notes/:id', () => {
    it('should NOT allow collaborator to delete note', async () => {
      const response = await request(app)
        .delete(`/notes/${noteId}`)
        .set('Authorization', `Bearer ${authToken2}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty(
        'message',
        'Solo el propietario puede eliminar la nota'
      );
    });

    it('should allow owner to delete note', async () => {
      const response = await request(app)
        .delete(`/notes/${noteId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Nota eliminada');
    });

    it('should return 404 after note is deleted', async () => {
      const response = await request(app)
        .get(`/notes/${noteId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });
});
