/*----- libraries imports -----*/
import { describe, it, expect } from 'vitest';

/*----- internal imports -----*/
import { User } from '../../../entities/User';
import { Note } from '../../../entities/Note';
import { NoteCollaborator } from '../../../entities/NoteCollaborator';

describe('Entities', () => {
  describe('User', () => {
    it('should create a user instance', () => {
      const user = new User();
      user.id = 1;
      user.email = 'test@example.com';
      user.password = 'hashed_password';

      expect(user.id).toBe(1);
      expect(user.email).toBe('test@example.com');
      expect(user.password).toBe('hashed_password');
    });

    it('should have notes and collaborations properties', () => {
      const user = new User();

      expect(user).toHaveProperty('notes');
      expect(user).toHaveProperty('collaborations');
    });
  });

  describe('Note', () => {
    it('should create a note instance', () => {
      const note = new Note();
      note.id = 1;
      note.title = 'Test Note';
      note.content = 'Test Content';
      note.ownerId = 1;

      expect(note.id).toBe(1);
      expect(note.title).toBe('Test Note');
      expect(note.content).toBe('Test Content');
      expect(note.ownerId).toBe(1);
    });

    it('should have owner and collaborators properties', () => {
      const note = new Note();

      expect(note).toHaveProperty('owner');
      expect(note).toHaveProperty('collaborators');
    });

    it('should have timestamps', () => {
      const note = new Note();

      expect(note).toHaveProperty('createdAt');
      expect(note).toHaveProperty('updatedAt');
    });
  });

  describe('NoteCollaborator', () => {
    it('should create a note collaborator instance', () => {
      const collaborator = new NoteCollaborator();
      collaborator.id = 1;
      collaborator.noteId = 1;
      collaborator.userId = 2;

      expect(collaborator.id).toBe(1);
      expect(collaborator.noteId).toBe(1);
      expect(collaborator.userId).toBe(2);
    });

    it('should have note and user properties', () => {
      const collaborator = new NoteCollaborator();

      expect(collaborator).toHaveProperty('note');
      expect(collaborator).toHaveProperty('user');
    });
  });
});
