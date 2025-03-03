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
            'takenAt',
            'locationName',
            'image',
          ],
          properties: {
            latitude: {
              type: 'string',
            },
            longitude: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            takenAt: {
              type: 'string',
            },
            locationName: {
              type: 'string',
            },
            image: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
}

export const swaggerSpec = swaggerJSDoc(options)
