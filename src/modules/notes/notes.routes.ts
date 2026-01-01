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

/**
 * @swagger
 * /notes:
 *   get:
 *     summary: Obtener todas las notas del usuario
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de notas del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 own:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Note'
 *                 shared:
 *                   type: array
 *                   items:
 *                     allOf:
 *                       - $ref: '#/components/schemas/Note'
 *                       - type: object
 *                         properties:
 *                           isShared:
 *                             type: boolean
 *                             example: true
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', getAllNotes);

/**
 * @swagger
 * /notes/{id}:
 *   get:
 *     summary: Obtener una nota por ID
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la nota
 *         example: 1
 *     responses:
 *       200:
 *         description: Nota encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 note:
 *                   $ref: '#/components/schemas/Note'
 *                 isOwner:
 *                   type: boolean
 *                   description: Indica si el usuario es el propietario
 *                   example: true
 *       404:
 *         description: Nota no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado
 */
router.get('/:id', validate(getNoteSchema), getOneNote);

/**
 * @swagger
 * /notes:
 *   post:
 *     summary: Crear una nueva nota
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título de la nota
 *                 example: Mi nota importante
 *               content:
 *                 type: string
 *                 description: Contenido de la nota
 *                 example: Este es el contenido de mi nota
 *     responses:
 *       201:
 *         description: Nota creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
router.post('/', createLimiter, validate(createNoteSchema), createNote);

/**
 * @swagger
 * /notes/{id}:
 *   put:
 *     summary: Actualizar una nota
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la nota
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Nuevo título (opcional)
 *                 example: Título actualizado
 *               content:
 *                 type: string
 *                 description: Nuevo contenido (opcional)
 *                 example: Contenido actualizado
 *     responses:
 *       200:
 *         description: Nota actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       404:
 *         description: Nota no encontrada
 *       401:
 *         description: No autorizado
 */
router.put('/:id', validate(updateNoteSchema), updateNote);

/**
 * @swagger
 * /notes/{id}:
 *   delete:
 *     summary: Eliminar una nota
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la nota a eliminar
 *         example: 1
 *     responses:
 *       200:
 *         description: Nota eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Nota eliminada
 *       403:
 *         description: Solo el propietario puede eliminar la nota
 *       404:
 *         description: Nota no encontrada
 *       401:
 *         description: No autorizado
 */
router.delete('/:id', validate(deleteNoteSchema), deleteNote);

/**
 * @swagger
 * /notes/{id}/share:
 *   post:
 *     summary: Compartir una nota con otro usuario
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la nota a compartir
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email del usuario con quien compartir
 *                 example: colaborador@ejemplo.com
 *     responses:
 *       200:
 *         description: Nota compartida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Nota compartida exitosamente
 *       403:
 *         description: Solo el propietario puede compartir la nota
 *       404:
 *         description: Nota o usuario no encontrado
 *       401:
 *         description: No autorizado
 */
router.post('/:id/share', validate(shareNoteSchema), shareNote);

export default router;
