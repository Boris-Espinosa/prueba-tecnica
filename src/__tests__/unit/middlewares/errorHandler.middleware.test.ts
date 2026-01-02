/*----- libraries imports -----*/
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';

/*----- internal imports -----*/
import { errorHandler } from '../../../shared/middlewares/errorHandler.middleware';
import { AppError } from '../../../common/AppError.class';

describe('ErrorHandlerMiddleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {};

    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };

    mockNext = vi.fn();
    vi.clearAllMocks();
  });

  it('should handle AppError with custom status code', () => {
    const error = new AppError('Custom error message', 403);

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 403,
      message: 'Custom error message',
    });
  });

  it('should handle ZodError', () => {
    const error = {
      name: 'ZodError',
      issues: [{ path: ['email'], message: 'Invalid email' }],
    };

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 400,
      message: 'Validation error',
      errors: [{ path: 'email', message: 'Invalid email' }],
    });
  });

  it('should handle QueryFailedError', () => {
    const error = {
      name: 'QueryFailedError',
      message: 'Database query failed',
    };

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 500,
      message: 'Database error',
    });
  });

  it('should handle JsonWebTokenError', () => {
    const error = {
      name: 'JsonWebTokenError',
      message: 'jwt malformed',
    };

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 401,
      message: 'Token inválido',
    });
  });

  it('should handle TokenExpiredError', () => {
    const error = {
      name: 'TokenExpiredError',
      message: 'jwt expired',
    };

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 401,
      message: 'Token expirado',
    });
  });

  it('should handle generic errors with 500 status code', () => {
    const error = new Error('Generic error');

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 500,
      message: 'Generic error',
    });
  });

  it('should handle errors without message', () => {
    const error = new Error();

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalled();
  });

  it('should use AppError status code when present', () => {
    const error = new AppError('Error with status', 400);

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 400,
      message: 'Error with status',
    });
  });
});
