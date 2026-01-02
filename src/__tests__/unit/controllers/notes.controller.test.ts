/*----- libraries imports -----*/
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Request, Response, NextFunction } from 'express';

/*----- mocks -----*/
vi.mock('../../../modules/notes/notes.service', () => ({
  notesService: {
    create: vi.fn(),
    findAllByUser: vi.fn(),
    findById: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    share: vi.fn(),
  },
}));

/*----- internal imports -----*/
import {
  createNote,
  getAllNotes,
  getOneNote,
  updateNote,
  deleteNote,
  shareNote,
} from '../../../modules/notes/notes.controller';
import { notesService } from '../../../modules/notes/notes.service';

describe('NotesController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
      // @ts-expect-error - mock clientUser for AuthRequest
      clientUser: { id: 1, email: 'test@example.com' },
    };

    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };

    mockNext = vi.fn();
    vi.clearAllMocks();
  });

  describe('createNote', () => {
    it('should create a note successfully', async () => {
      const mockNote = {
        id: 1,
        title: 'Test Note',
        content: 'Test Content',
        ownerId: 1,
      };

      mockRequest.body = {
        title: 'Test Note',
        content: 'Test Content',
      };

      (notesService.create as any).mockResolvedValue(mockNote);

      await createNote(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockNote);
    });

    it('should call next with error on failure', async () => {
      mockRequest.body = { title: 'Test' };

      const error = new Error('Create failed');
      (notesService.create as any).mockRejectedValue(error);

      await createNote(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getAllNotes', () => {
    it('should get all notes for user', async () => {
      const mockNotes = {
        own: [
          { id: 1, title: 'Note 1', content: 'Content 1', ownerId: 1 },
          { id: 2, title: 'Note 2', content: 'Content 2', ownerId: 1 },
        ],
        shared: [],
      };

      (notesService.findAllByUser as any).mockResolvedValue(mockNotes);

      await getAllNotes(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockNotes);
    });

    it('should call next with error on failure', async () => {
      const error = new Error('Fetch failed');
      (notesService.findAllByUser as any).mockRejectedValue(error);

      await getAllNotes(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getOneNote', () => {
    it('should get a note by id', async () => {
      const mockNote = {
        id: 1,
        title: 'Test Note',
        content: 'Test Content',
        ownerId: 1,
      };

      mockRequest.params = { id: '1' };

      (notesService.findById as any).mockResolvedValue(mockNote);

      await getOneNote(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockNote);
    });

    it('should call next with error on failure', async () => {
      mockRequest.params = { id: '1' };

      const error = new Error('Note not found');
      (notesService.findById as any).mockRejectedValue(error);

      await getOneNote(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('updateNote', () => {
    it('should update a note', async () => {
      const mockNote = {
        id: 1,
        title: 'Updated Note',
        content: 'Updated Content',
        ownerId: 1,
      };

      mockRequest.params = { id: '1' };
      mockRequest.body = {
        title: 'Updated Note',
        content: 'Updated Content',
      };

      (notesService.update as any).mockResolvedValue(mockNote);

      await updateNote(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockNote);
    });

    it('should call next with error on failure', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { title: 'Updated' };

      const error = new Error('Update failed');
      (notesService.update as any).mockRejectedValue(error);

      await updateNote(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteNote', () => {
    it('should delete a note', async () => {
      const serviceResponse = { message: 'Nota eliminada' };
      mockRequest.params = { id: '1' };

      (notesService.delete as any).mockResolvedValue(serviceResponse);

      await deleteNote(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(serviceResponse);
    });

    it('should call next with error on failure', async () => {
      mockRequest.params = { id: '1' };

      const error = new Error('Delete failed');
      (notesService.delete as any).mockRejectedValue(error);

      await deleteNote(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('shareNote', () => {
    it('should share a note with another user', async () => {
      const mockCollaborator = {
        id: 1,
        noteId: 1,
        userId: 2,
      };

      mockRequest.params = { id: '1' };
      mockRequest.body = { userEmail: 'collaborator@example.com' };

      (notesService.share as any).mockResolvedValue(mockCollaborator);

      await shareNote(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockCollaborator);
    });

    it('should call next with error on failure', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { userEmail: 'test@example.com' };

      const error = new Error('Share failed');
      (notesService.share as any).mockRejectedValue(error);

      await shareNote(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
