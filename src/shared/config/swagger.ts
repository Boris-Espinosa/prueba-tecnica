import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Notas Colaborativas API',
      version: '1.0.0',
      description: 'API REST para gestión de notas colaborativas',
      license: {
        name: 'ISC',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingresa el token JWT obtenido del login o register',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único del usuario',
              example: 1,
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email del usuario',
              example: 'usuario@ejemplo.com',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación',
            },
          },
        },
        Note: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único de la nota',
              example: 1,
            },
            title: {
              type: 'string',
              description: 'Título de la nota',
              example: 'Mi primera nota',
            },
            content: {
              type: 'string',
              description: 'Contenido de la nota',
              example: 'Este es el contenido de mi nota',
            },
            ownerId: {
              type: 'integer',
              description: 'ID del usuario propietario',
              example: 1,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de última actualización',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Auth',
        description: 'Endpoints de autenticación y registro',
      },
      {
        name: 'Notes',
        description: 'Endpoints de gestión de notas',
      },
    ],
  },
  apis: ['./src/modules/**/*.routes.ts', './src/modules/**/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
