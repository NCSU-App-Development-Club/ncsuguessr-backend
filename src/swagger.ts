import swaggerJSDoc from 'swagger-jsdoc'

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
        ImageSubmissionForm: {
          type: 'object',
          required: [
            'latitude',
            'longitude',
            'description',
            'taken-at',
            'location-name',
          ],
          proerties: {
            latitude: {
              type: 'string',
            },
            longitude: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            'taken-at': {
              type: 'string',
            },
            'location-name': {
              type: 'string',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
}

export const swaggerSpec = swaggerJSDoc(options)
