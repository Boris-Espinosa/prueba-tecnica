# API REST de Notas Colaborativas

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Express](https://img.shields.io/badge/Express-5.x-lightgrey)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)
![Docker](https://img.shields.io/badge/Docker-ready-blue)

API REST desarrollada en Node.js con Express para gestionar un sistema de notas colaborativas similar a Google Keep. La aplicación permite a los usuarios crear, editar, compartir y colaborar en notas de forma segura.

## Tabla de Contenidos

- [Características](#-características)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Decisiones Técnicas](#-decisiones-técnicas)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Scripts NPM Disponibles](#-scripts-npm-disponibles)
- [Ejecución](#-ejecución)
- [Uso de la API](#-uso-de-la-api)
- [Testing](#-testing)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Documentación API](#-documentación-api)

## Características

### Autenticación y Usuarios

- Registro de usuarios
- Login con JWT
- Contraseñas encriptadas con bcrypt
- Protección de rutas con middleware de autenticación

### Gestión de Notas

- Crear notas (título, contenido, timestamps)
- Listar notas propias y compartidas
- Ver detalles de una nota
- Editar notas
- Eliminar notas (solo propietario)

### Colaboración

- Compartir notas con otros usuarios
- Los colaboradores pueden leer y editar
- Los colaboradores NO pueden eliminar ni cambiar propietarios
- Control de permisos robusto

### Seguridad

- JWT para autenticación
- Validación de datos con Zod
- Rate limiting para prevenir abuso
- Manejo centralizado de errores
- Logging estructurado con Pino
- Request ID para trazabilidad

## Tecnologías Utilizadas

### Core

- **Node.js** (≥18) - Runtime
- **TypeScript** - Tipado estático
- **Express** (v5) - Framework web
- **PostgreSQL** (v16) - Base de datos
- **TypeORM** - ORM para gestión de base de datos

### Seguridad y Autenticación

- **jsonwebtoken** - Tokens JWT
- **bcryptjs** - Hash de contraseñas
- **express-rate-limit** - Limitación de peticiones
- **zod** - Validación de esquemas

### Calidad de Código

- **ESLint** - Linter
- **Prettier** - Formateo de código
- **TypeScript ESLint** - Reglas específicas para TS

### Testing

- **Vitest** - Framework de testing
- **Supertest** - Testing de endpoints HTTP
- **Coverage V8** - Cobertura de código

### Desarrollo

- **tsx** - Ejecución de TypeScript
- **Docker & Docker Compose** - Containerización
- **pino** - Logging estructurado
- **swagger-ui-express** - Documentación API

## Decisiones Técnicas

### Arquitectura

Se implementó una **arquitectura modular** organizada por dominios (auth, notes) con separación clara de responsabilidades:

- **Controllers**: Manejo de peticiones HTTP
- **Services**: Lógica de negocio
- **Entities**: Modelos de datos con TypeORM
- **Middlewares**: Validación, autenticación, manejo de errores
- **Schemas**: Validación con Zod

### Base de Datos

**PostgreSQL con TypeORM** fue elegido por:

- Soporte robusto de relaciones (usuarios, notas, colaboradores)
- ACID compliance para integridad de datos
- TypeORM proporciona migraciones, decoradores y tipo seguro
- Excelente rendimiento para operaciones complejas

### Autenticación

**JWT (JSON Web Tokens)** para:

- Stateless authentication
- Escalabilidad horizontal
- Tokens con expiración configurable
- Fácil integración con frontend

### Validación

**Zod** sobre otras alternativas por:

- Integración nativa con TypeScript
- Inferencia de tipos automática
- Mensajes de error claros
- Validación en runtime y compile-time

### Testing

**Vitest** como framework principal:

- Velocidad superior a Jest
- Compatibilidad nativa con ESM
- UI integrada para visualización
- Excelente soporte de TypeScript

### Logging

**Pino** para logging estructurado:

- Extremadamente rápido
- Formato JSON para análisis
- Soporte de pretty print en desarrollo
- Niveles de log configurables

### Containerización

**Docker** para:

- Consistencia entre entornos
- Fácil despliegue
- Aislamiento de dependencias
- Configuración reproducible

### Requisitos Previos

**Opción 1: Ejecución con Docker (recomendado)**

- [Docker](https://www.docker.com/get-started) >= 20.x
- [Docker Compose](https://docs.docker.com/compose/install/) >= 2.x

**Opción 2: Ejecución local**

- [Node.js](https://nodejs.org/) >= 18.x
- [PostgreSQL](https://www.postgresql.org/) >= 14.x
- npm

## Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/Boris-Espinosa/prueba-tecnica.git
cd prueba-tecnica
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=notes_db

# JWT Configuration
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRES_IN=86400000

# Application
NODE_ENV=development
PORT=3000
```

**IMPORTANTE**: Cambia `JWT_SECRET` por una clave segura en producción.

### 4. Configurar Base de Datos

#### Opción A: Usando Docker (Recomendado)

```bash
docker-compose up -d postgres
```

#### Opción B: PostgreSQL Local

Asegúrate de tener PostgreSQL instalado y crea la base de datos:

```sql
CREATE DATABASE notes_db;
```

### 5. Sincronizar esquema de base de datos

```bash
npm run db:sync
```

## Scripts NPM Disponibles

| Script                  | Descripción                                          |
| ----------------------- | ---------------------------------------------------- |
| `npm run dev`           | Inicia el servidor en modo desarrollo con hot-reload |
| `npm run build`         | Compila TypeScript a JavaScript en `/dist`           |
| `npm start`             | Ejecuta la aplicación compilada (producción)         |
| `npm run lint`          | Ejecuta ESLint para verificar el código              |
| `npm run lint:fix`      | Ejecuta ESLint y corrige automáticamente             |
| `npm run format`        | Formatea el código con Prettier                      |
| `npm run format:check`  | Verifica el formato sin modificar                    |
| `npm run check`         | Ejecuta format:check y lint juntos                   |
| `npm test`              | Ejecuta todos los tests                              |
| `npm run test:watch`    | Ejecuta tests en modo watch                          |
| `npm run test:coverage` | Ejecuta tests con reporte de cobertura               |
| `npm run test:ui`       | Abre UI de Vitest para visualizar tests              |
| `npm run db:sync`       | Sincroniza el esquema de la base de datos            |

## Ejecución

### En local (Desarrollo)

```bash
# Iniciar en modo desarrollo
npm run dev
```

### En local (Desarrollo)

```bash
# Iniciar en modo produccion
npm ci --omit=dev

npm run build

npm start
```

El servidor estará disponible en `http://localhost:3000`

### Con Docker Compose (Producción)

```bash
# Construir y ejecutar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

### Con Docker Compose (Desarrollo)

```bash
# Usar configuración de desarrollo
docker-compose -f docker-compose.dev.yml up -d
```

## Uso de la API

### Endpoints Disponibles

#### Autenticación

| Método | Endpoint         | Descripción             | Requiere Auth |
| ------ | ---------------- | ----------------------- | ------------- |
| POST   | `/auth/register` | Registrar nuevo usuario | No            |
| POST   | `/auth/login`    | Iniciar sesión          | No            |

#### Notas

| Método | Endpoint           | Descripción                          | Requiere Auth |
| ------ | ------------------ | ------------------------------------ | ------------- |
| GET    | `/notes`           | Listar todas las notas del usuario   | Sí            |
| POST   | `/notes`           | Crear nueva nota                     | Sí            |
| GET    | `/notes/:id`       | Obtener una nota específica          | Sí            |
| PUT    | `/notes/:id`       | Actualizar una nota                  | Sí            |
| DELETE | `/notes/:id`       | Eliminar una nota (solo propietario) | Sí            |
| POST   | `/notes/:id/share` | Compartir nota con otro usuario      | Sí            |

### Ejemplos de Uso

#### Registro de Usuario

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "Password123!",
    "name": "Usuario Ejemplo"
  }'
```

#### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "Password123!"
  }'
```

Respuesta:

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "usuario@ejemplo.com",
      "name": "Usuario Ejemplo"
    }
  }
}
```

#### Crear Nota

```bash
curl -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Mi Primera Nota",
    "content": "Contenido de la nota"
  }'
```

#### Listar Notas

```bash
curl -X GET http://localhost:3000/notes \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Compartir Nota

```bash
curl -X POST http://localhost:3000/notes/1/share \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "email": "colaborador@ejemplo.com"
  }'
```

## Testing

El proyecto incluye testing con diferentes niveles:

### Tests Unitarios

Prueban funciones y componentes de forma aislada:

- Controllers
- Services
- Middlewares
- Utils
- Entities

### Tests de Integración

Prueban flujos completos de la aplicación:

- Flujos de autenticación
- Operaciones CRUD de notas
- Colaboración entre usuarios

### Ejecutar Tests

```bash
# Ejecutar todos los tests
npm test

# Modo watch
npm run test:watch

# Con cobertura de código
npm run test:coverage

# UI interactiva
npm run test:ui
```

### Reporte de Cobertura

Después de ejecutar `npm run test:coverage`, se genera un reporte en `/coverage`:

```bash
# Ver reporte HTML
open coverage/index.html  # macOS
start coverage/index.html # Windows
xdg-open coverage/index.html # Linux
```

## 📁 Estructura del Proyecto

```
prueba-tecnica/
├── .dockerignore
├── .env.docker
├── .env.example
├── .env.test
├── .gitignore
├── .prettierignore
├── .prettierrc
├── docker-compose.dev.yml
├── docker-compose.yml
├── Dockerfile
├── Dockerfile.dev
├── eslint.config.ts
├── package.json
├── package-lock.json
├── README.md
├── server.ts
├── tsconfig.json
├── vitest.config.ts
└── src/
    ├── app.ts
    ├── common/
    │   ├── AppError.class.ts
    │   └── interfaces.ts
    ├── entities/
    │   ├── index.ts
    │   ├── Note.ts
    │   ├── NoteCollaborator.ts
    │   └── User.ts
    ├── modules/
    │   ├── auth/
    │   │   ├── auth.controller.ts
    │   │   ├── auth.routes.ts
    │   │   └── auth.service.ts
    │   └── notes/
    │       ├── notes.controller.ts
    │       ├── notes.routes.ts
    │       └── notes.service.ts
    ├── schemas/
    │   ├── auth.schema.ts
    │   ├── index.ts
    │   └── notes.schema.ts
    ├── shared/
    │   ├── config/
    │   │   ├── database.ts
    │   │   ├── env.validation.ts
    │   │   └── swagger.ts
    │   ├── middlewares/
    │   │   ├── auth.middleware.ts
    │   │   ├── errorHandler.middleware.ts
    │   │   ├── index.ts
    │   │   ├── rate.Limiter.middleware.ts
    │   │   ├── requestId.middleware.ts
    │   │   └── validate.middleware.ts
    │   └── utils/
    │       ├── jwt.util.ts
    │       └── logger.ts
    └── __tests__/
        ├── setup.ts
        ├── integration/
        │   ├── auth.test.ts
        │   └── notes.test.ts
        └── unit/
            ├── controllers/
            │   ├── auth.controller.test.ts
            │   └── notes.controller.test.ts
            ├── entities/
            │   └── entities.test.ts
            ├── middlewares/
            │   ├── auth.middleware.test.ts
            │   ├── errorHandler.middleware.test.ts
            │   └── validate.middleware.test.ts
            ├── services/
            │   ├── auth.service.test.ts
            │   └── notes.service.test.ts
            └── utils/
                └── jwt.util.test.ts
```

## Documentación API

### Swagger UI

Una vez ejecutada la aplicación, la documentación interactiva está disponible en:

```
http://localhost:3000/api-docs
```

Swagger UI permite:

- Ver todos los endpoints disponibles
- Probar requests directamente desde el navegador
- Ver esquemas de request/response
- Autenticación con JWT

### Autenticación en Swagger

1. Hacer login en `/auth/login`
2. Copiar el token de la respuesta
3. Hacer clic en "Authorize" en la esquina superior derecha
4. Introducir: `YOUR_TOKEN_HERE` (Bearer se añade automaticamente)
5. Los endpoints protegidos ahora funcionarán

## Seguridad Implementada

- **Contraseñas hasheadas** con bcrypt (salt rounds: 10)
- **JWT** con expiración configurable
- **Rate limiting** para prevenir ataques de fuerza bruta
- **Validación de datos** con Zod en todos los endpoints
- **Manejo centralizado de errores** sin exponer información sensible
- **CORS** configurado
- **SQL Injection** prevenido por TypeORM (prepared statements)
- **Request ID** para trazabilidad de peticiones
- **Logs estructurados** sin información sensible

## Manejo de Errores

La aplicación implementa un sistema centralizado de manejo de errores:

### AppError Class

Clase personalizada para errores controlados:

```typescript
throw new AppError('Nota no encontrada', 404);
```

### Error Handler Middleware

Procesa todos los errores y devuelve respuestas consistentes:

```json
{
  "success": false,
  "error": {
    "message": "Mensaje del error",
    "status": 404
  }
}
```

### Códigos de Estado Comunes

| Código | Significado           | Ejemplo                    |
| ------ | --------------------- | -------------------------- |
| 200    | OK                    | Operación exitosa          |
| 201    | Created               | Recurso creado             |
| 400    | Bad Request           | Datos de entrada inválidos |
| 401    | Unauthorized          | Token inválido o ausente   |
| 403    | Forbidden             | Sin permisos               |
| 404    | Not Found             | Recurso no encontrado      |
| 429    | Too Many Requests     | Rate limit excedido        |
| 500    | Internal Server Error | Error del servidor         |

## Variables de Entorno

| Variable         | Descripción                   | Ejemplo                      | Requerido |
| ---------------- | ----------------------------- | ---------------------------- | --------- |
| `DB_HOST`        | Host de PostgreSQL            | `localhost`                  | Sí        |
| `DB_PORT`        | Puerto de PostgreSQL          | `5432`                       | Sí        |
| `DB_USER`        | Usuario de PostgreSQL         | `postgres`                   | Sí        |
| `DB_PASSWORD`    | Contraseña de PostgreSQL      | `password`                   | Sí        |
| `DB_NAME`        | Nombre de la base de datos    | `notes_db`                   | Sí        |
| `JWT_SECRET`     | Clave secreta para JWT        | `your_secret_key`            | Sí        |
| `JWT_EXPIRES_IN` | Tiempo de expiración JWT (ms) | `86400000` (24h)             | Sí        |
| `NODE_ENV`       | Entorno de ejecución          | `development` / `production` | No        |
| `PORT`           | Puerto del servidor           | `3000`                       | No        |

## Despliegue

### Despliegue con Docker

```bash
# 1. Construir la imagen
docker build -t notes-api .

# 2. Ejecutar con docker-compose
docker-compose up -d

# 3. Verificar que los servicios están corriendo
docker-compose ps

# 4. Ver logs
docker-compose logs -f app
```

### Despliegue en Cloud

La aplicación está lista para ser desplegada en:

- **Railway**
- **Render**
- **Fly.io**
- **AWS ECS**
- **Google Cloud Run**
- **Azure Container Instances**

Asegúrate de:

1. Configurar las variables de entorno
2. Configurar PostgreSQL (o usar servicio gestionado)
3. Cambiar `JWT_SECRET` por uno seguro
4. Configurar CORS para tu dominio
5. Habilitar HTTPS

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

ISC

## Autor

**Boris Espinosa**

- GitHub: [@Boris-Espinosa](https://github.com/Boris-Espinosa)

## Agradecimientos

Quiero agradecer la oportunidad de participar en este proceso de selección y de desarrollar esta prueba técnica. La realización de este proyecto me permitió profundizar en mis conocimientos y fue una excelente instancia de aprendizaje y desafío profesional. Agradezco el tiempo dedicado a revisar mi trabajo y la consideración de mi postulación para el cargo.

---
