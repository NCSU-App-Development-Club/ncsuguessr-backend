export const camelize = (s: string): string => {
  return s.replace(/-./g, (x) => x[1].toUpperCase())
}

export const toCamelCaseBody = (body: Record<string, any>) => {
  const newObj: Record<string, any> = {}
  for (const [key, value] of Object.entries(body)) {
    if (typeof value === 'object')
      newObj[camelize(key)] = toCamelCaseBody(value)
    else newObj[camelize(key)] = value
  }
  return newObj
}
