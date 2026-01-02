/*----- libraries imports -----*/
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

/*----- internal imports -----*/
import { validate } from '../../../shared/middlewares/validate.middleware';

describe('ValidateMiddleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
      query: {},
    };

    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };

    mockNext = vi.fn();
    vi.clearAllMocks();
  });

  it('should call next if validation passes', async () => {
    const schema = z.object({
      body: z.object({
        email: z.email(),
        password: z.string().min(6),
      }),
    });

    mockRequest.body = {
      email: 'test@example.com',
      password: 'password123',
    };

    const middleware = validate(schema);
    await middleware(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalledWith();
  });

  it('should return 400 if validation fails', async () => {
    const schema = z.object({
      body: z.object({
        email: z.email(),
        password: z.string().min(6),
      }),
    });

    mockRequest.body = {
      email: 'invalid-email',
      password: '123',
    };

    const middleware = validate(schema);
    await middleware(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalled();
    const callArgs = (mockResponse.json as any).mock.calls[0][0];
    expect(callArgs).toHaveProperty('message');
    expect(callArgs).toHaveProperty('errors');
  });

  it('should include validation error details', async () => {
    const schema = z.object({
      body: z.object({
        email: z.email(),
      }),
    });

    mockRequest.body = {
      email: 'not-an-email',
    };

    const middleware = validate(schema);
    await middleware(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    const callArgs = (mockResponse.json as any).mock.calls[0][0];
    expect(callArgs.errors).toBeDefined();
    expect(Array.isArray(callArgs.errors)).toBe(true);
  });
});
