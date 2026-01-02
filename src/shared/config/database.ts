/*----- libraries imports -----*/
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

/*----- internal imports -----*/
import { User, Note, NoteCollaborator } from '../../entities/index.js';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432'),
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? 'notes_db',
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Note, NoteCollaborator],
  subscribers: [],
  migrations: [],
});
