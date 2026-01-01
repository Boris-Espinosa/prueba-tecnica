import { AppError } from '../../common/AppError.class.js';
import { AppDataSource } from '../../shared/config/database.js';
import { Note, NoteCollaborator, User } from '../../entities/index.js';
import {
  CreateNoteInput,
  ShareNoteInput,
  UpdateNoteInput,
} from '../../schemas/notes.schema.js';

const noteRepository = AppDataSource.getRepository(Note);
const collaboratorRepository = AppDataSource.getRepository(NoteCollaborator);
const userRepository = AppDataSource.getRepository(User);

export class NotesService {
  async create({ title, content }: CreateNoteInput, ownerId: number) {
    const note = noteRepository.create({
      title,
      content,
      ownerId,
    });

    return await noteRepository.save(note);
  }

  async findAllByUser(userId: number) {
    const ownNotes = await noteRepository.find({
      where: { ownerId: userId },
      order: { updatedAt: 'DESC' },
    });

    const sharedNotes = await collaboratorRepository.find({
      where: { userId },
      relations: {
        note: true,
      },
    });
    const sharedNotesData = sharedNotes.map((c) => ({
      ...c.note,
      isShared: true,
    }));
    return {
      own: ownNotes,
      shared: sharedNotesData,
    };
  }

  async findById(id: number, userId: number) {
    const note = await noteRepository.findOne({
      where: { id },
      relations: ['owner', 'collaborators', 'collaborators.user'],
    });

    if (!note) throw new AppError('Nota no encontrada', 404);

    const isOwner = note.ownerId === userId;
    const isCollaborator = note.collaborators.some((c) => c.userId === userId);

    if (!isOwner && !isCollaborator)
      throw new AppError('No tienes permisos para ver esta nota', 403);

    return { note, isOwner };
  }

  async update(
    { title, content }: UpdateNoteInput,
    id: number,
    userId: number
  ) {
    const { note } = await this.findById(id, userId);

    note.title = title ?? note.title;
    note.content = content ?? note.content;

    return await noteRepository.save(note);
  }

  async delete(id: number, userId: number) {
    const { note, isOwner } = await this.findById(id, userId);

    if (!isOwner)
      throw new AppError('Solo el propietario puede eliminar la nota', 403);

    await noteRepository.remove(note);
    return { message: 'Nota eliminada' };
  }

  async share(
    noteId: number,
    userId: number,
    { email: collaboratorEmail }: ShareNoteInput
  ) {
    const { note, isOwner } = await this.findById(noteId, userId);

    if (!note) throw new AppError('Nota no encontrada', 404);

    if (!isOwner)
      throw new AppError('Solo el propietario puede compartir la nota', 403);

    const collaborator = await userRepository.findOne({
      where: { email: collaboratorEmail },
    });

    if (!collaborator)
      throw new AppError('Usuario colaborador no encontrado', 404);

    if (collaborator.id === userId)
      throw new AppError('No puedes compartir una nota contigo mismo', 400);

    const existing = await collaboratorRepository.findOne({
      where: { noteId, userId: collaborator.id },
    });

    if (existing) throw new AppError('Este usuario ya es colaborador', 400);

    const noteCollaborator = collaboratorRepository.create({
      noteId,
      userId: collaborator.id,
    });

    await collaboratorRepository.save(noteCollaborator);

    return { message: 'Nota compartida exitosamente' };
  }
}

export const notesService = new NotesService();
