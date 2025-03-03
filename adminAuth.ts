// Mock auth middleware
const adminAuth = async (c: any, next: any) => {
    const auth = c.req.header('Authorization')
    if (!auth || !auth.startsWith('Bearer ') || auth.split(' ')[1] !== 'mock-admin-token') {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    await next()
  }

export default adminAuth