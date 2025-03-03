import swaggerJSDoc from 'swagger-jsdoc'

import { ImageSubmissionForm, Image } from './schemas/image'
import { CreateGame, Game } from './schemas/game'
import { Error } from './schemas'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NCSUGuessr Backend',
      version: '1.0.0',
      description: "API documentation for NCSUGuessr's backend.",
    },
    tags: [
      {
        name: 'Images',
        description: 'Image related endpoints',
      },
      {
        name: 'Games',
        description: 'Game related endpoints',
      },
    ],

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
        CreateGame,
        Game,
      },
    },
  },
  apis: ['./src/routes/*.ts'],
}

export const swaggerSpec = swaggerJSDoc(options)
