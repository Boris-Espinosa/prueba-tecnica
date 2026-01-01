import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NotesService } from '../../../modules/notes/notes.service';
import { AppError } from '../../../common/AppError.class';

const { mockNoteRepository, mockCollaboratorRepository, mockUserRepository } =
  vi.hoisted(() => ({
    mockNoteRepository: {
      create: vi.fn(),
      save: vi.fn(),
      find: vi.fn(),
      findOne: vi.fn(),
      remove: vi.fn(),
    },
    mockCollaboratorRepository: {
      find: vi.fn(),
      findOne: vi.fn(),
      create: vi.fn(),
      save: vi.fn(),
    },
    mockUserRepository: {
      findOne: vi.fn(),
    },
  }));

vi.mock('../../../shared/config/database', () => ({
  AppDataSource: {
    getRepository: vi.fn((entity) => {
      if (entity.name === 'Note') return mockNoteRepository;
      if (entity.name === 'NoteCollaborator') return mockCollaboratorRepository;
      if (entity.name === 'User') return mockUserRepository;
      return {};
    }),
  },
}));

describe('NotesService', () => {
  let notesService: NotesService;

  beforeEach(() => {
    vi.clearAllMocks();
    notesService = new NotesService();
  });

  describe('create', () => {
    it('should create a new note successfully', async () => {
      const mockNote = {
        id: 1,
        title: 'Test Note',
        content: 'Test Content',
        ownerId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockNoteRepository.create.mockReturnValue(mockNote);
      mockNoteRepository.save.mockResolvedValue(mockNote);

      const result = await notesService.create(
        { title: 'Test Note', content: 'Test Content' },
        1
      );

      expect(result).toEqual(mockNote);
      expect(mockNoteRepository.create).toHaveBeenCalledWith({
        title: 'Test Note',
        content: 'Test Content',
        ownerId: 1,
      });
    });
  });

  describe('findAllByUser', () => {
    it('should return own and shared notes', async () => {
      const ownNotes = [
        { id: 1, title: 'Own Note', ownerId: 1 },
        { id: 2, title: 'Own Note 2', ownerId: 1 },
      ];

      const sharedNotes = [
        {
          userId: 1,
          note: { id: 3, title: 'Shared Note', ownerId: 2 },
        },
      ];

      mockNoteRepository.find.mockResolvedValue(ownNotes);
      mockCollaboratorRepository.find.mockResolvedValue(sharedNotes);

      const result = await notesService.findAllByUser(1);

      expect(result.own).toHaveLength(2);
      expect(result.shared).toHaveLength(1);
      expect(result.shared[0]).toHaveProperty('isShared', true);
    });
  });

  describe('findById', () => {
    it('should return note if user is owner', async () => {
      const mockNote = {
        id: 1,
        title: 'Test Note',
        ownerId: 1,
        collaborators: [],
      };

      mockNoteRepository.findOne.mockResolvedValue(mockNote);

      const result = await notesService.findById(1, 1);

      expect(result.note).toEqual(mockNote);
      expect(result.isOwner).toBe(true);
    });

    it('should return note if user is collaborator', async () => {
      const mockNote = {
        id: 1,
        title: 'Test Note',
        ownerId: 2,
        collaborators: [{ userId: 1 }],
      };

      mockNoteRepository.findOne.mockResolvedValue(mockNote);

      const result = await notesService.findById(1, 1);

      expect(result.note).toEqual(mockNote);
      expect(result.isOwner).toBe(false);
    });

    it('should throw error if note not found', async () => {
      mockNoteRepository.findOne.mockResolvedValue(null);

      await expect(notesService.findById(999, 1)).rejects.toThrow(AppError);
      await expect(notesService.findById(999, 1)).rejects.toThrow(
        'Nota no encontrada'
      );
    });

    it('should throw error if user has no permissions', async () => {
      const mockNote = {
        id: 1,
        title: 'Test Note',
        ownerId: 2,
        collaborators: [],
      };

      mockNoteRepository.findOne.mockResolvedValue(mockNote);

      await expect(notesService.findById(1, 1)).rejects.toThrow(AppError);
      await expect(notesService.findById(1, 1)).rejects.toThrow(
        'No tienes permisos para ver esta nota'
      );
    });
  });

  describe('update', () => {
    it('should update note successfully', async () => {
      const mockNote = {
        id: 1,
        title: 'Old Title',
        content: 'Old Content',
        ownerId: 1,
        collaborators: [],
      };

      const updatedNote = {
        ...mockNote,
        title: 'New Title',
        content: 'New Content',
      };

      mockNoteRepository.findOne.mockResolvedValue(mockNote);
      mockNoteRepository.save.mockResolvedValue(updatedNote);

      const result = await notesService.update(
        { title: 'New Title', content: 'New Content' },
        1,
        1
      );

      expect(result.title).toBe('New Title');
      expect(result.content).toBe('New Content');
    });
  });

  describe('delete', () => {
    it('should delete note if user is owner', async () => {
      const mockNote = {
        id: 1,
        title: 'Test Note',
        ownerId: 1,
        collaborators: [],
      };

      mockNoteRepository.findOne.mockResolvedValue(mockNote);
      mockNoteRepository.remove.mockResolvedValue(mockNote);

      const result = await notesService.delete(1, 1);

      expect(result).toHaveProperty('message', 'Nota eliminada');
      expect(mockNoteRepository.remove).toHaveBeenCalledWith(mockNote);
    });

    it('should throw error if user is not owner', async () => {
      const mockNote = {
        id: 1,
        title: 'Test Note',
        ownerId: 2,
        collaborators: [{ userId: 1 }],
      };

      mockNoteRepository.findOne.mockResolvedValue(mockNote);

      await expect(notesService.delete(1, 1)).rejects.toThrow(AppError);
      await expect(notesService.delete(1, 1)).rejects.toThrow(
        'Solo el propietario puede eliminar la nota'
      );
    });
  });

  describe('share', () => {
    it('should share note successfully', async () => {
      const mockNote = {
        id: 1,
        title: 'Test Note',
        ownerId: 1,
        collaborators: [],
      };

      const mockCollaborator = {
        id: 2,
        email: 'collaborator@example.com',
      };

      const mockNoteCollaborator = {
        noteId: 1,
        userId: 2,
      };

      mockNoteRepository.findOne.mockResolvedValue(mockNote);
      mockUserRepository.findOne.mockResolvedValue(mockCollaborator);
      mockCollaboratorRepository.findOne.mockResolvedValue(null);
      mockCollaboratorRepository.create.mockReturnValue(mockNoteCollaborator);
      mockCollaboratorRepository.save.mockResolvedValue(mockNoteCollaborator);

      const result = await notesService.share(1, 1, {
        email: 'collaborator@example.com',
      });

      expect(result).toHaveProperty('message', 'Nota compartida exitosamente');
    });

    it('should throw error if user is not owner', async () => {
      const mockNote = {
        id: 1,
        title: 'Test Note',
        ownerId: 2,
        collaborators: [{ userId: 1 }],
      };

      mockNoteRepository.findOne.mockResolvedValue(mockNote);

      await expect(
        notesService.share(1, 1, { email: 'test@example.com' })
      ).rejects.toThrow('Solo el propietario puede compartir la nota');
    });

    it('should throw error if collaborator not found', async () => {
      const mockNote = {
        id: 1,
        title: 'Test Note',
        ownerId: 1,
        collaborators: [],
      };

      mockNoteRepository.findOne.mockResolvedValue(mockNote);
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        notesService.share(1, 1, { email: 'nonexistent@example.com' })
      ).rejects.toThrow('Usuario colaborador no encontrado');
    });

    it('should throw error if sharing with self', async () => {
      const mockNote = {
        id: 1,
        title: 'Test Note',
        ownerId: 1,
        collaborators: [],
      };

      const mockUser = {
        id: 1,
        email: 'owner@example.com',
      };

      mockNoteRepository.findOne.mockResolvedValue(mockNote);
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await expect(
        notesService.share(1, 1, { email: 'owner@example.com' })
      ).rejects.toThrow('No puedes compartir una nota contigo mismo');
    });

    it('should throw error if user is already a collaborator', async () => {
      const mockNote = {
        id: 1,
        title: 'Test Note',
        ownerId: 1,
        collaborators: [],
      };

      const mockCollaborator = {
        id: 2,
        email: 'collaborator@example.com',
      };

      mockNoteRepository.findOne.mockResolvedValue(mockNote);
      mockUserRepository.findOne.mockResolvedValue(mockCollaborator);
      mockCollaboratorRepository.findOne.mockResolvedValue({
        noteId: 1,
        userId: 2,
      });

      await expect(
        notesService.share(1, 1, { email: 'collaborator@example.com' })
      ).rejects.toThrow('Este usuario ya es colaborador');
    });
  });
});
