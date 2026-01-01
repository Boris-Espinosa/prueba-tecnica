import 'reflect-metadata';
import dotenv from 'dotenv';
import app from './src/app';
import { AppDataSource } from './src/shared/config/database';
import { validateEnv } from './src/shared/config/env.validation';

dotenv.config();
validateEnv();

const PORT = process.env.PORT ?? 3000;

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected successfully');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
    process.exit(1);
  });
