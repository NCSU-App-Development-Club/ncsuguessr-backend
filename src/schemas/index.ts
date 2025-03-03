export const Error = {
  type: 'object',
  required: ['error'],
  properties: {
    error: {
      anyOf: [{ type: 'string' }, { type: 'object' }],
    },
  },
}
