export const ImageSubmissionForm = {
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
    latitude: { type: 'string', format: 'number' },
    longitude: { type: 'string', format: 'number' },
    description: { type: 'string' },
    takenAt: { type: 'string', format: 'date' },
    locationName: { type: 'string' },
    image: { type: 'string', format: 'binary' },
  },
}

export const Image = {
  type: 'object',
  required: [
    'id',
    'fileLocation',
    'latitude',
    'longitude',
    'description',
    'takenAt',
    'validated',
    'locationName',
  ],
  properties: {
    id: { type: 'integer' },
    fileLocation: { type: 'string' },
    latitude: { type: 'number' },
    longitude: { type: 'number' },
    description: { type: 'string' },
    takenAt: { type: 'string', format: 'date' },
    validated: { type: 'boolean' },
    locationName: { type: 'string' },
  },
}
