import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { authRoutes } from './routes/auth'
import { projectRoutes } from './routes/projects'
import { blogRoutes } from './routes/blog'
import { adminRoutes } from './routes/admin'

type Bindings = {
  DB: D1Database
  CORS_ORIGIN: string
  API_SECRET: string
}

const app = new Hono<{ Bindings: Bindings }>()

// CORS middleware
app.use('*', (c, next) => {
  const corsMiddleware = cors({
    origin: c.env.CORS_ORIGIN || 'http://localhost:3000',
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
  return corsMiddleware(c, next)
})

// Health check
app.get('/', c => {
  return c.json({
    message: 'Portfolio API is running',
    timestamp: new Date().toISOString(),
  })
})

// API routes
app.route('/auth', authRoutes)
app.route('/projects', projectRoutes)
app.route('/blog', blogRoutes)
app.route('/admin', adminRoutes)

// 404 handler
app.notFound(c => {
  return c.json({ error: 'Not Found' }, 404)
})

// Error handler
app.onError((err, c) => {
  console.error('API Error:', err)
  return c.json({ error: 'Internal Server Error' }, 500)
})

export default app
