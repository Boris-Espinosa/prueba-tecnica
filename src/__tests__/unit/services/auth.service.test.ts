import { describe, it, expect, beforeEach, vi } from 'vitest';
import bcrypt from 'bcryptjs';

vi.mock('../../../shared/config/database', () => {
  const mockFindOne = vi.fn();
  const mockCreate = vi.fn();
  const mockSave = vi.fn();

  return {
    AppDataSource: {
      getRepository: vi.fn(() => ({
        findOne: mockFindOne,
        create: mockCreate,
        save: mockSave,
      })),
    },
  };
});

vi.mock('../../../shared/utils/jwt.util', () => ({
  generateToken: vi.fn(() => Promise.resolve('mock-jwt-token')),
}));

import { AuthService } from '../../../modules/auth/auth.service';
import { AppError } from '../../../common/AppError.class';
import { AppDataSource } from '../../../shared/config/database';

describe('AuthService', () => {
  let authService: AuthService;
  let mockRepository: any;

  beforeEach(() => {
    vi.clearAllMocks();
    authService = new AuthService();
    mockRepository = AppDataSource.getRepository('User') as any;
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockImplementation((data: any) => data);
      mockRepository.save.mockImplementation((user: any) => {
        user.id = 1;
        return Promise.resolve(user);
      });

      const result = await authService.register({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toHaveProperty('token', 'mock-jwt-token');
      expect(result).toHaveProperty('user');
      expect(result.user).not.toHaveProperty('password');
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should throw error if email already exists', async () => {
      mockRepository.findOne.mockResolvedValue({
        id: 1,
        email: 'existing@example.com',
      });

      await expect(
        authService.register({
          email: 'existing@example.com',
          password: 'password123',
        })
      ).rejects.toThrow(AppError);

      await expect(
        authService.register({
          email: 'existing@example.com',
          password: 'password123',
        })
      ).rejects.toThrow('El email ya está registrado');
    });

    it('should hash the password before saving', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockImplementation((data: any) => data);
      mockRepository.save.mockImplementation((user: any) => {
        user.id = 1;
        return Promise.resolve(user);
      });

      await authService.register({
        email: 'test@example.com',
        password: 'plainPassword',
      });

      const createCall = mockRepository.create.mock.calls[0][0];
      expect(createCall.password).not.toBe('plainPassword');
    });
  });

  describe('login', () => {
    it('should login user with valid credentials', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: hashedPassword,
        createdAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await authService.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toHaveProperty('token', 'mock-jwt-token');
      expect(result).toHaveProperty('user');
      expect(result.user).not.toHaveProperty('password');
    });

    it('should throw error if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        authService.login({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
      ).rejects.toThrow(AppError);

      await expect(
        authService.login({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
      ).rejects.toThrow('Credenciales inválidas');
    });

    it('should throw error if password is incorrect', async () => {
      const hashedPassword = await bcrypt.hash('correctPassword', 10);
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: hashedPassword,
        createdAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(mockUser);

      await expect(
        authService.login({
          email: 'test@example.com',
          password: 'wrongPassword',
        })
      ).rejects.toThrow(AppError);
    });
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        createdAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await authService.findById(1);

      expect(result).toHaveProperty('email', 'test@example.com');
      expect(result).not.toHaveProperty('password');
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw error if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(authService.findById(999)).rejects.toThrow(AppError);
      await expect(authService.findById(999)).rejects.toThrow(
        'Usuario no encontrado'
      );
    });
  });
});
