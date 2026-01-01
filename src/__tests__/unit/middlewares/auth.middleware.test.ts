import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../../../shared/middlewares/auth.middleware';
import { verifyToken } from '../../../shared/utils/jwt.util';

vi.mock('../../../shared/utils/jwt.util');

describe('AuthMiddleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };

    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };

    mockNext = vi.fn();
    vi.clearAllMocks();
  });

  it('should call next if token is valid', async () => {
    const mockPayload = { id: 1, email: 'test@example.com' };
    mockRequest.headers = {
      authorization: 'Bearer valid-token',
    };

    (verifyToken as any).mockResolvedValue(mockPayload);

    await authMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(verifyToken).toHaveBeenCalledWith('valid-token');
    expect(mockNext).toHaveBeenCalled();
    expect((mockRequest as any).clientUser).toEqual(mockPayload);
  });

  it('should return 401 if no authorization header', async () => {
    mockRequest.headers = {};

    await authMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Header de autorización invalido',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 if authorization header does not have token', async () => {
    mockRequest.headers = {
      authorization: 'Bearer',
    };

    await authMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Formato de header de autorización invalido',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 500 if token verification fails', async () => {
    mockRequest.headers = {
      authorization: 'Bearer invalid-token',
    };

    (verifyToken as any).mockRejectedValue(new Error('Invalid token'));

    await authMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Internal server error',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
