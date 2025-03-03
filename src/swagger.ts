import swaggerJSDoc from 'swagger-jsdoc'

import { ImageSubmissionForm, Image } from './schemas/image'
import { Error } from './schemas'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My Express API',
      version: '1.0.0',
      description: 'API documentation for my Express app',
    },

    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
        },
      },
      schemas: {
        ImageSubmissionForm,
        Image,
        Error,
      },
    },
  },
  apis: ['./src/routes/*.ts'],
}

export const swaggerSpec = swaggerJSDoc(options)
