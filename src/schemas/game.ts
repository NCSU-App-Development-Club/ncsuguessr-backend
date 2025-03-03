export const CreateGame = {
  type: 'object',
  required: ['imageId', 'date'],
  properties: {
    imageId: {
      type: 'string',
      format: 'number',
    },
    date: {
      type: 'string',
      format: 'date',
    },
  },
}

export const Game = {
  type: 'object',
  required: ['imageId', 'date', 'id', 'plays', 'totalDist'],
  properties: {
    imageId: {
      type: 'integer',
    },
    date: {
      type: 'string',
      format: 'date',
    },
    id: {
      type: 'integer',
    },
    plays: {
      type: 'integer',
    },
    totalDist: {
      type: 'number',
    },
  },
}
