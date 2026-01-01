import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './modules/auth/auth.routes';
import notesRoutes from './modules/notes/notes.routes';
import { errorHandler, requestIdMiddleware } from './shared/middlewares';
import { normalLimiter } from './shared/middlewares/rate.Limiter.middleware';
import { logger } from './shared/utils/logger';

const app = express();

app.use(express.json());
app.use(cors());

app.use(requestIdMiddleware);

app.use(
  morgan(':method :url :status :response-time ms', {
    stream: {
      write: (message: string) => {
        logger.info(message.trim());
      },
    },
  })
);

app.use(normalLimiter);

app.use('/auth', authRoutes);
app.use('/notes', notesRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API Notes - TypeORM', status: 'running' });
});

app.use(errorHandler);

export default app;
