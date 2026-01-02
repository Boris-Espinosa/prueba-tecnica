/*----- libraries imports -----*/
import pino from 'pino';

const isDevelopment = process.env.NODE_ENV !== 'production';

export const logger = pino({
  name: 'prueba-tecnica',
  level: process.env.LOG_LEVEL ?? 'info',
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  ...(isDevelopment && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
        singleLine: false,
        messageFormat: '{msg}',
      },
    },
  }),
});

export const createRequestLogger = (requestId?: string) => {
  if (requestId) {
    return logger.child({ requestId });
  }
  return logger;
};
