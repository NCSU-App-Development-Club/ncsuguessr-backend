import convert from 'heic-convert'

export const getImageExtension = (mimetype: string) => {
  switch (mimetype) {
    case 'image/jpeg':
      return '.jpg'
    case 'image/jpg':
      return '.jpg'
    case 'image/png':
      return '.png'
    case 'image/heic':
      return '.heic'
    case 'image/heif':
      return '.heif'
    default:
      return null
  }
}

export const convertToJpg = async (buffer: Buffer) => {
  const outputBuffer = await convert({
    buffer,
    format: 'JPEG',
  })

  return outputBuffer
}
