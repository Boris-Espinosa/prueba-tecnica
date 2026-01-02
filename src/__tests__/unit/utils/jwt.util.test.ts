/*----- libraries imports -----*/
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

/*----- internal imports -----*/
import { AppError } from '../../../common/AppError.class';

/*----- utilities -----*/
import { generateToken, verifyToken } from '../../../shared/utils/jwt.util';

describe('JWT Util', () => {
  const originalEnv = process.env.JWT_SECRET;

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret-key';
  });

  afterEach(() => {
    process.env.JWT_SECRET = originalEnv;
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', async () => {
      const payload = { id: 1, email: 'test@example.com' };

      const token = await generateToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3);
    });

    it('should generate token with custom expiration', async () => {
      const payload = { id: 1, email: 'test@example.com' };
      const expiresIn = '1h';

      const token = await generateToken(payload, expiresIn);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });

    it('should throw error if JWT_SECRET is missing', async () => {
      delete process.env.JWT_SECRET;

      const payload = { id: 1, email: 'test@example.com' };

      await expect(generateToken(payload)).rejects.toThrow(AppError);
      await expect(generateToken(payload)).rejects.toThrow(
        'JWT_SECRET is missing'
      );
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', async () => {
      const payload = { id: 1, email: 'test@example.com' };
      const token = await generateToken(payload);

      const decoded = await verifyToken(token);

      expect(decoded).toBeDefined();
      expect(decoded.id).toBe(1);
      expect(decoded.email).toBe('test@example.com');
    });

    it('should throw error for invalid token', async () => {
      const invalidToken = 'invalid.token.here';

      await expect(verifyToken(invalidToken)).rejects.toThrow();
    });

    it('should throw error if JWT_SECRET is missing', async () => {
      delete process.env.JWT_SECRET;

      await expect(verifyToken('some.token.here')).rejects.toThrow(AppError);
      await expect(verifyToken('some.token.here')).rejects.toThrow(
        'JWT_SECRET is missing'
      );
    });
  });
});
