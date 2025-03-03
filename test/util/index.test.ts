import { camelToSnake, kebabToSnake } from '../../src/util'

describe('converts camel case to snake case', () => {
  it('should return the correct snake case equivalent of the given camel case string', () => {
    expect(camelToSnake('theQuickBrownFoxJumps')).toBe(
      'the_quick_brown_fox_jumps'
    )
    expect(camelToSnake('overTheLazyDog')).toBe('over_the_lazy_dog')
    expect(camelToSnake('ncsuAppDevClub')).toBe('ncsu_app_dev_club')
  })
})

describe('converts kebab case to snake case', () => {
  it('should return the correct snake case equivalent of the given kebab case string', () => {
    expect(kebabToSnake('the-quick-brown-fox-jumps')).toBe(
      'the_quick_brown_fox_jumps'
    )
    expect(kebabToSnake('over-the-lazy-dog')).toBe('over_the_lazy_dog')
    expect(kebabToSnake('ncsu-app-dev-club')).toBe('ncsu_app_dev_club')
  })
})
