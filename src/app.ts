/*----- libraries imports -----*/
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

/*----- internal imports -----*/
import authRoutes from './modules/auth/auth.routes.js';
import notesRoutes from './modules/notes/notes.routes.js';
import {
  errorHandler,
  requestIdMiddleware,
} from './shared/middlewares/index.js';
import { normalLimiter } from './shared/middlewares/rate.Limiter.middleware.js';
import { swaggerSpec } from './shared/config/swagger.js';

/*----- utilities -----*/
import { logger } from './shared/utils/logger.js';

const app = express();
app.disable('x-powered-by');

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

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Notas API - Documentación',
  })
);

app.use(normalLimiter);

app.use('/auth', authRoutes);
app.use('/notes', notesRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'API Notas Colaborativas',
    status: 'running',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
      auth: {
        register: 'POST /auth/register',
        login: 'POST /auth/login',
        getUser: 'GET /auth/:id',
      },
      notes: {
        getAll: 'GET /notes',
        getOne: 'GET /notes/:id',
        create: 'POST /notes',
        update: 'PUT /notes/:id',
        delete: 'DELETE /notes/:id',
        share: 'POST /notes/:id/share',
      },
    },
  });
});

app.use(errorHandler);

export default app;
