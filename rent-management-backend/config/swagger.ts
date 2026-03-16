import swaggerJsdoc from 'swagger-jsdoc'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Rent Management API',
      version: '1.0.0',
      description: 'API de gestion locative — auth, biens, occupants, baux, paiements.',
    },
    servers: [
      { url: 'http://localhost:3333', description: 'Development' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ApiError: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            message: { type: 'string' },
            errors: { type: 'object', description: 'Détails de validation (422/400)' },
            error: { type: 'string', description: 'Message technique (500)' },
          },
        },
        ApiSuccess: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            message: { type: 'string' },
            data: { type: 'object', description: 'Données retournées' },
          },
        },
      },
    },
  },
  apis: [
    path.join(rootDir, 'start/routes.ts'),
    path.join(rootDir, 'app/controllers/**/*.ts'),
    path.join(rootDir, 'documentation/openapi_paths.ts'),
  ],
}

/**
 * Génère la spec OpenAPI à partir des annotations JSDoc @swagger dans le code.
 */
export function getOpenApiSpec(): object {
  return swaggerJsdoc(swaggerOptions) as object
}
