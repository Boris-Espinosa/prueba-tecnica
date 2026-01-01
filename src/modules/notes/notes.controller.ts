import { NextFunction, Request, Response } from 'express';
import { notesService } from '../notes/notes.service';
import { AuthRequest } from '../../common/interfaces';

export const createNote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const title = req.body.title;
    const content = req.body.content ?? '';
    const id = (req as AuthRequest).clientUser.id;
    const response = await notesService.create({ title, content }, id);
    return res.status(201).json(response);
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
    const id = (req as AuthRequest).clientUser.id;
    const response = await notesService.findAllByUser(id);
    return res.status(200).json(response);
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
    const noteId = parseInt(req.params.id);
    const userId = (req as AuthRequest).clientUser.id;
    const response = await notesService.findById(noteId, userId);
    return res.status(200).json(response);
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
    const title = req.body.title;
    const content = req.body.content;
    const noteId = parseInt(req.params.id);
    const userId = (req as AuthRequest).clientUser.id;
    const response = await notesService.update(
      { title, content },
      noteId,
      userId
    );
    return res.status(200).json(response);
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
    const noteId = parseInt(req.params.id);
    const userId = (req as AuthRequest).clientUser.id;
    const response = await notesService.delete(noteId, userId);
    return res.status(200).json(response);
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
    const userId = (req as AuthRequest).clientUser.id;
    const noteId = parseInt(req.params.id);
    const email = req.body.email;
    const response = await notesService.share(noteId, userId, { email });
    return res.status(200).json(response);
  } catch (err: any) {
    next(err);
  }
};
