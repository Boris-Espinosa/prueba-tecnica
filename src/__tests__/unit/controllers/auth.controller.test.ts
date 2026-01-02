/*----- libraries imports -----*/
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Request, Response, NextFunction } from 'express';

/*----- mocks -----*/
vi.mock('../../../modules/auth/auth.service', () => ({
  authService: {
    register: vi.fn(),
    login: vi.fn(),
    findById: vi.fn(),
  },
}));

/*----- internal imports -----*/
import {
  register,
  login,
  findById,
} from '../../../modules/auth/auth.controller';
import { authService } from '../../../modules/auth/auth.service';

describe('AuthController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
    };

    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };

    mockNext = vi.fn();
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      const mockToken = 'mock-token';

      mockRequest.body = {
        email: 'test@example.com',
        password: 'password123',
      };

      (authService.register as any).mockResolvedValue({
        user: mockUser,
        token: mockToken,
      });

      await register(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 201,
        user: mockUser,
        token: mockToken,
      });
    });

    it('should call next with error on failure', async () => {
      mockRequest.body = {
        email: 'test@example.com',
        password: 'password123',
      };

      const error = new Error('Registration failed');
      (authService.register as any).mockRejectedValue(error);

      await register(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('login', () => {
    it('should login a user successfully', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      const mockToken = 'mock-token';

      mockRequest.body = {
        email: 'test@example.com',
        password: 'password123',
      };

      (authService.login as any).mockResolvedValue({
        user: mockUser,
        token: mockToken,
      });

      await login(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 200,
        user: mockUser,
        token: mockToken,
      });
    });

    it('should call next with error on failure', async () => {
      mockRequest.body = {
        email: 'test@example.com',
        password: 'wrong',
      };

      const error = new Error('Invalid credentials');
      (authService.login as any).mockRejectedValue(error);

      await login(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('findById', () => {
    it('should get a user by id successfully', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };

      mockRequest.params = { id: '1' };

      (authService.findById as any).mockResolvedValue(mockUser);

      await findById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(authService.findById).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 200,
        ...mockUser,
      });
    });

    it('should call next with error on failure', async () => {
      mockRequest.params = { id: '1' };

      const error = new Error('User not found');
      (authService.findById as any).mockRejectedValue(error);

      await findById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
