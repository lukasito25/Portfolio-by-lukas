import { Hono } from 'hono'

type Bindings = {
  DB: D1Database
  API_SECRET: string
}

export const adminRoutes = new Hono<{ Bindings: Bindings }>()

// Middleware to check API secret
const requireAuth = async (c: any, next: any) => {
  const authHeader = c.req.header('Authorization')
  const apiSecret = c.env.API_SECRET

  if (!authHeader || authHeader !== `Bearer ${apiSecret}`) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  await next()
}

// Apply auth middleware to all admin routes
adminRoutes.use('*', requireAuth)

// Get all projects (including drafts)
adminRoutes.get('/projects', async c => {
  try {
    const projects = await c.env.DB.prepare(
      `
      SELECT * FROM Project
      ORDER BY createdAt DESC
    `
    ).all()

    return c.json({ projects: projects.results })
  } catch (error) {
    console.error('Get admin projects error:', error)
    return c.json({ error: 'Failed to fetch projects' }, 500)
  }
})

// Create new project
adminRoutes.post('/projects', async c => {
  try {
    const data = await c.req.json()

    const result = await c.env.DB.prepare(
      `
      INSERT INTO Project (
        title, slug, description, content, excerpt,
        thumbnail, demoUrl, githubUrl, category, status,
        featured, sortOrder, metaTitle, metaDescription,
        authorId, publishedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
    )
      .bind(
        data.title,
        data.slug,
        data.description,
        data.content,
        data.excerpt,
        data.thumbnail,
        data.demoUrl,
        data.githubUrl,
        data.category,
        data.status,
        data.featured ? 1 : 0,
        data.sortOrder,
        data.metaTitle,
        data.metaDescription,
        data.authorId,
        data.publishedAt
      )
      .run()

    return c.json({
      success: true,
      projectId: result.meta.last_row_id,
    })
  } catch (error) {
    console.error('Create project error:', error)
    return c.json({ error: 'Failed to create project' }, 500)
  }
})

// Update project
adminRoutes.put('/projects/:id', async c => {
  try {
    const id = c.req.param('id')
    const data = await c.req.json()

    await c.env.DB.prepare(
      `
      UPDATE Project SET
        title = ?, slug = ?, description = ?, content = ?,
        excerpt = ?, thumbnail = ?, demoUrl = ?, githubUrl = ?,
        category = ?, status = ?, featured = ?, sortOrder = ?,
        metaTitle = ?, metaDescription = ?, publishedAt = ?
      WHERE id = ?
    `
    )
      .bind(
        data.title,
        data.slug,
        data.description,
        data.content,
        data.excerpt,
        data.thumbnail,
        data.demoUrl,
        data.githubUrl,
        data.category,
        data.status,
        data.featured ? 1 : 0,
        data.sortOrder,
        data.metaTitle,
        data.metaDescription,
        data.publishedAt,
        id
      )
      .run()

    return c.json({ success: true })
  } catch (error) {
    console.error('Update project error:', error)
    return c.json({ error: 'Failed to update project' }, 500)
  }
})

// Delete project
adminRoutes.delete('/projects/:id', async c => {
  try {
    const id = c.req.param('id')

    await c.env.DB.prepare('DELETE FROM Project WHERE id = ?').bind(id).run()

    return c.json({ success: true })
  } catch (error) {
    console.error('Delete project error:', error)
    return c.json({ error: 'Failed to delete project' }, 500)
  }
})

// Similar routes for blog posts...
adminRoutes.get('/blog', async c => {
  try {
    const posts = await c.env.DB.prepare(
      `
      SELECT * FROM BlogPost
      ORDER BY createdAt DESC
    `
    ).all()

    return c.json({ posts: posts.results })
  } catch (error) {
    console.error('Get admin blog posts error:', error)
    return c.json({ error: 'Failed to fetch blog posts' }, 500)
  }
})
