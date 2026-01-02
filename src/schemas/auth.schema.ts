/*----- libraries imports -----*/
import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.email({
      error: 'Invalid email format',
    }),
    password: z
      .string({
        error: 'Password is required',
      })
      .min(6, 'Password must be at least 6 characters long'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email({
      error: 'Invalid email format',
    }),
    password: z.string({
      error: 'Password is required',
    }),
  }),
});

export const findByIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid note ID'),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
