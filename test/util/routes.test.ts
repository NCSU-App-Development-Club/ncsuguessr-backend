import { camelize } from '../../src/util/routes'

describe('converts kebab case to camel case', () => {
  it('should return the correct camel case equivalent of the fiven kebab case string', () => {
    expect(camelize('the-quick-brown-fox-jumps')).toBe('theQuickBrownFoxJumps')
    expect(camelize('over-the-lazy-dog')).toBe('overTheLazyDog')
    expect(camelize('ncsu-app-dev-club')).toBe('ncsuAppDevClub')
  })
})
