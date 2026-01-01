import express from 'express';
import {
  createNote,
  getAllNotes,
  getOneNote,
  updateNote,
  deleteNote,
  shareNote,
} from './/notes.controller';
import { validate } from '../../shared/middlewares/validate.middleware';
import {
  createNoteSchema,
  updateNoteSchema,
  getNoteSchema,
  deleteNoteSchema,
  shareNoteSchema,
} from '../../schemas/notes.schema';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';
import { createLimiter } from '../../shared/middlewares/rate.Limiter.middleware';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getAllNotes);
router.get('/:id', validate(getNoteSchema), getOneNote);
router.post('/', createLimiter, validate(createNoteSchema), createNote);
router.put('/:id', validate(updateNoteSchema), updateNote);
router.delete('/:id', validate(deleteNoteSchema), deleteNote);
router.post('/:id/share', validate(shareNoteSchema), shareNote);

export default router;
