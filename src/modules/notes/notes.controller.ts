import { NextFunction, Request, Response } from 'express';
import { notesService } from '../notes/notes.service';
import { AuthRequest } from '../../common/interfaces';
import { logger } from '../../shared/utils/logger';

export const createNote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const requestLogger = req.log ?? logger;
    const title = req.body.title;
    const content = req.body.content ?? '';
    const id = (req as AuthRequest).clientUser.id;

    requestLogger.info(
      { action: 'create_note_attempt', userId: id, title },
      'Creating new note'
    );

    const response = await notesService.create({ title, content }, id);

    requestLogger.info(
      { action: 'create_note_success', userId: id, noteId: response.id },
      'Note created successfully'
    );

    return res.status(201).json(response);
  } catch (err: any) {
    const requestLogger = req.log ?? logger;
    requestLogger.error(
      { action: 'create_note_error', error: err.message },
      'Failed to create note'
    );
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
    const id = (req as AuthRequest).clientUser.id;

    requestLogger.info(
      { action: 'get_all_notes_attempt', userId: id },
      'Fetching all notes for user'
    );

    const response = await notesService.findAllByUser(id);

    requestLogger.info(
      {
        action: 'get_all_notes_success',
        userId: id,
        count: response.own.length + response.shared.length,
      },
      'Notes retrieved successfully'
    );

    return res.status(200).json(response);
  } catch (err: any) {
    const requestLogger = req.log ?? logger;
    requestLogger.error(
      { action: 'get_all_notes_error', error: err.message },
      'Failed to fetch notes'
    );
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
    const noteId = parseInt(req.params.id);
    const userId = (req as AuthRequest).clientUser.id;

    requestLogger.info(
      { action: 'get_note_attempt', userId, noteId },
      'Fetching note by ID'
    );

    const response = await notesService.findById(noteId, userId);

    requestLogger.info(
      { action: 'get_note_success', userId, noteId },
      'Note retrieved successfully'
    );

    return res.status(200).json(response);
  } catch (err: any) {
    const requestLogger = req.log ?? logger;
    requestLogger.error(
      { action: 'get_note_error', error: err.message },
      'Failed to fetch note'
    );
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
    const title = req.body.title;
    const content = req.body.content;
    const noteId = parseInt(req.params.id);
    const userId = (req as AuthRequest).clientUser.id;

    requestLogger.info(
      { action: 'update_note_attempt', userId, noteId, title },
      'Updating note'
    );

    const response = await notesService.update(
      { title, content },
      noteId,
      userId
    );

    requestLogger.info(
      { action: 'update_note_success', userId, noteId },
      'Note updated successfully'
    );

    return res.status(200).json(response);
  } catch (err: any) {
    const requestLogger = req.log ?? logger;
    requestLogger.error(
      { action: 'update_note_error', error: err.message },
      'Failed to update note'
    );
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
    const noteId = parseInt(req.params.id);
    const userId = (req as AuthRequest).clientUser.id;

    requestLogger.info(
      { action: 'delete_note_attempt', userId, noteId },
      'Deleting note'
    );

    const response = await notesService.delete(noteId, userId);

    requestLogger.info(
      { action: 'delete_note_success', userId, noteId },
      'Note deleted successfully'
    );

    return res.status(200).json(response);
  } catch (err: any) {
    const requestLogger = req.log ?? logger;
    requestLogger.error(
      { action: 'delete_note_error', error: err.message },
      'Failed to delete note'
    );
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
    const email = req.body.email;

    requestLogger.info(
      { action: 'share_note_attempt', userId, noteId, targetEmail: email },
      'Sharing note with user'
    );

    const response = await notesService.share(noteId, userId, { email });

    requestLogger.info(
      { action: 'share_note_success', userId, noteId, targetEmail: email },
      'Note shared successfully'
    );

    return res.status(200).json(response);
  } catch (err: any) {
    const requestLogger = req.log ?? logger;
    requestLogger.error(
      { action: 'share_note_error', error: err.message },
      'Failed to share note'
    );
    next(err);
  }
};
