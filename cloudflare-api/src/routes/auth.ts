import { Hono } from 'hono'
import bcrypt from 'bcryptjs'

type Bindings = {
  DB: D1Database
  API_SECRET: string
}

export const authRoutes = new Hono<{ Bindings: Bindings }>()

// Verify admin credentials
authRoutes.post('/verify', async c => {
  try {
    const { email, password } = await c.req.json()

    if (!email || !password) {
      return c.json({ error: 'Email and password required' }, 400)
    }

    // Find user in database
    const user = await c.env.DB.prepare('SELECT * FROM User WHERE email = ?')
      .bind(email)
      .first()

    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    // Check if user is admin
    if (user.role !== 'ADMIN') {
      return c.json({ error: 'Access denied' }, 403)
    }

    return c.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Auth error:', error)
    return c.json({ error: 'Authentication failed' }, 500)
  }
})

// Get user by ID
authRoutes.get('/user/:id', async c => {
  try {
    const id = c.req.param('id')

    const user = await c.env.DB.prepare(
      'SELECT id, email, name, role FROM User WHERE id = ?'
    )
      .bind(id)
      .first()

    if (!user) {
      return c.json({ error: 'User not found' }, 404)
    }

    return c.json({ user })
  } catch (error) {
    console.error('Get user error:', error)
    return c.json({ error: 'Failed to fetch user' }, 500)
  }
})
