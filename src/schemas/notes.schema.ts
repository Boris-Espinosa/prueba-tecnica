import { z } from "zod";

export const createNoteSchema = z.object({
  body: z.object({
    title: z
      .string({
        error: "Title is required",
      })
      .min(1, "Title cannot be empty")
      .max(255, "Title must be at most 255 characters"),
    content: z.string().optional().nullable(),
  }),
});

export const updateNoteSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "Invalid note ID"),
  }),
  body: z.object({
    title: z
      .string()
      .min(1, "Title cannot be empty")
      .max(255, "Title must be at most 255 characters")
      .optional(),
    content: z.string().nullable().optional(),
  }),
});

export const getNoteSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "Invalid note ID"),
  }),
});

export const deleteNoteSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "Invalid note ID"),
  }),
});

export const shareNoteSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "Invalid note ID"),
  }),
  body: z.object({
    email: z.email({
      message: "Invalid email format",
    }),
  }),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>["body"];
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>["body"];
export type ShareNoteInput = z.infer<typeof shareNoteSchema>["body"];
