/*----- libraries imports -----*/
import { NextFunction, Request, Response } from 'express';

/*----- internal imports -----*/
import { notesService } from '../notes/notes.service.js';
import { AuthRequest } from '../../common/interfaces.js';

/*----- utilities -----*/
import { logger } from '../../shared/utils/logger.js';

export const createNote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const requestLogger = req.log ?? logger;
    const userId = (req as AuthRequest).clientUser.id;
    requestLogger.info(
      { action: 'create_note_attempt', userId, title: req.body.title },
      'Creating new note'
    );

    const response = await notesService.create(
      { title: req.body.title, content: req.body.content ?? '' },
      userId
    );

    requestLogger.info(
      { action: 'create_note_success', userId, noteId: response.id },
      'Note created successfully'
    );

    return res.status(201).json({
      status: 201,
      ...response,
    });
  } catch (err: any) {
    next(err);
  }
};

export const getAllNotes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const requestLogger = req.log ?? logger;
    const userId = (req as AuthRequest).clientUser.id;
    requestLogger.info(
      { action: 'get_all_notes_attempt', userId },
      'Fetching all notes for user'
    );

    const response = await notesService.findAllByUser(userId);

    requestLogger.info(
      {
        action: 'get_all_notes_success',
        userId,
        count: response.own.length + response.shared.length,
      },
      'Notes retrieved successfully'
    );

    return res.status(200).json({
      status: 200,
      ...response,
    });
  } catch (err: any) {
    next(err);
  }
};

export const getOneNote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const requestLogger = req.log ?? logger;
    const userId = (req as AuthRequest).clientUser.id;
    const noteId = parseInt(req.params.id);
    requestLogger.info(
      { action: 'get_note_attempt', userId, noteId },
      'Fetching note by ID'
    );

    const response = await notesService.findById(noteId, userId);

    requestLogger.info(
      { action: 'get_note_success', userId, noteId },
      'Note retrieved successfully'
    );

    return res.status(200).json({
      status: 200,
      ...response,
    });
  } catch (err: any) {
    next(err);
  }
};

export const updateNote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const requestLogger = req.log ?? logger;
    const userId = (req as AuthRequest).clientUser.id;
    const noteId = parseInt(req.params.id);
    requestLogger.info(
      { action: 'update_note_attempt', userId, noteId, title: req.body.title },
      'Updating note'
    );

    const response = await notesService.update(
      { title: req.body.title, content: req.body.content },
      noteId,
      userId
    );

    requestLogger.info(
      { action: 'update_note_success', userId, noteId },
      'Note updated successfully'
    );

    return res.status(200).json({
      status: 200,
      ...response,
    });
  } catch (err: any) {
    next(err);
  }
};

export const deleteNote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const requestLogger = req.log ?? logger;
    const userId = (req as AuthRequest).clientUser.id;
    const noteId = parseInt(req.params.id);
    requestLogger.info(
      { action: 'delete_note_attempt', userId, noteId },
      'Deleting note'
    );

    const response = await notesService.delete(noteId, userId);

    requestLogger.info(
      { action: 'delete_note_success', userId, noteId },
      'Note deleted successfully'
    );

    return res.status(200).json({
      status: 200,
      ...response,
    });
  } catch (err: any) {
    next(err);
  }
};

export const shareNote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const requestLogger = req.log ?? logger;
    const userId = (req as AuthRequest).clientUser.id;
    const noteId = parseInt(req.params.id);
    requestLogger.info(
      {
        action: 'share_note_attempt',
        userId,
        noteId,
        targetEmail: req.body.email,
      },
      'Sharing note with user'
    );

    const response = await notesService.share(noteId, userId, {
      email: req.body.email,
    });

    requestLogger.info(
      {
        action: 'share_note_success',
        userId,
        noteId,
        targetEmail: req.body.email,
      },
      'Note shared successfully'
    );

    return res.status(200).json({
      status: 200,
      ...response,
    });
  } catch (err: any) {
    next(err);
  }
};
