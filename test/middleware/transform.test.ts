import { camelCaseBodyMiddleware } from '../../src/middleware/transform'
import { toCamelCaseBody } from '../../src/util/routes'

// Mock the toCamelCaseBody function
jest.mock('../../src/util/routes')
const mockedToCamelCaseBody = toCamelCaseBody as jest.Mock

describe('camelCaseBodyMiddleware', () => {
  const mockReq = (body: object) => ({ body }) as any
  const mockRes = () => {
    const res = {} as any
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    return res
  }
  const mockNext = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks() // Clear mocks before each test
  })

  it('should convert request body keys to camelCase', async () => {
    // Arrange
    const req = mockReq({ 'user-name': 'Alice', 'user-age': 25 })
    const res = mockRes()

    // Mock the camel case conversion
    mockedToCamelCaseBody.mockReturnValue({
      userName: 'Alice',
      userAge: 25,
    })

    // Act
    await camelCaseBodyMiddleware(req, res, mockNext)

    // Assert
    expect(req.body).toEqual({
      userName: 'Alice',
      userAge: 25,
    })
    expect(mockNext).toHaveBeenCalled()
  })

  it('should call next even if body is empty', async () => {
    const req = mockReq({})
    const res = mockRes()

    mockedToCamelCaseBody.mockReturnValue({}) // Mock empty body conversion

    await camelCaseBodyMiddleware(req, res, mockNext)

    expect(req.body).toEqual({})
    expect(mockNext).toHaveBeenCalled()
  })

  it('should handle nested objects', async () => {
    const req = mockReq({
      'user-info': {
        'user-name': 'Alice',
        'user-age': 25,
      },
    })
    const res = mockRes()

    mockedToCamelCaseBody.mockReturnValue({
      userInfo: {
        userName: 'Alice',
        userAge: 25,
      },
    })

    await camelCaseBodyMiddleware(req, res, mockNext)

    expect(req.body).toEqual({
      userInfo: {
        userName: 'Alice',
        userAge: 25,
      },
    })
    expect(mockNext).toHaveBeenCalled()
  })
})
