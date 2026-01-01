import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes';
import notesRoutes from './modules/notes/notes.routes';
import { errorHandler } from './shared/middlewares';
import { normalLimiter } from './shared/middlewares/rate.Limiter.middleware';

const app = express();

app.use(express.json());
app.use(cors());

app.use(normalLimiter);

app.use('/auth', authRoutes);
app.use('/notes', notesRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API Notes - TypeORM', status: 'running' });
});

app.use(errorHandler);

export default app;
