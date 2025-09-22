import { Hono } from 'hono'

type Bindings = {
  DB: D1Database
  API_SECRET: string
}

export const projectRoutes = new Hono<{ Bindings: Bindings }>()

// Get all published projects
projectRoutes.get('/', async c => {
  try {
    const projects = await c.env.DB.prepare(
      `
      SELECT
        id, title, slug, description, excerpt, thumbnail,
        demoUrl, githubUrl, category, featured, sortOrder,
        views, likes, createdAt, publishedAt
      FROM Project
      WHERE status = 'PUBLISHED'
      ORDER BY sortOrder ASC, publishedAt DESC
    `
    ).all()

    return c.json({ projects: projects.results })
  } catch (error) {
    console.error('Get projects error:', error)
    return c.json({ error: 'Failed to fetch projects' }, 500)
  }
})

// Get featured projects
projectRoutes.get('/featured', async c => {
  try {
    const projects = await c.env.DB.prepare(
      `
      SELECT
        id, title, slug, description, excerpt, thumbnail,
        demoUrl, githubUrl, category, featured, sortOrder,
        views, likes, createdAt, publishedAt
      FROM Project
      WHERE status = 'PUBLISHED' AND featured = 1
      ORDER BY sortOrder ASC
    `
    ).all()

    return c.json({ projects: projects.results })
  } catch (error) {
    console.error('Get featured projects error:', error)
    return c.json({ error: 'Failed to fetch featured projects' }, 500)
  }
})

// Get project by slug
projectRoutes.get('/:slug', async c => {
  try {
    const slug = c.req.param('slug')

    const project = await c.env.DB.prepare(
      `
      SELECT * FROM Project
      WHERE slug = ? AND status = 'PUBLISHED'
    `
    )
      .bind(slug)
      .first()

    if (!project) {
      return c.json({ error: 'Project not found' }, 404)
    }

    // Increment view count
    await c.env.DB.prepare(
      `
      UPDATE Project SET views = views + 1 WHERE id = ?
    `
    )
      .bind(project.id)
      .run()

    return c.json({ project })
  } catch (error) {
    console.error('Get project error:', error)
    return c.json({ error: 'Failed to fetch project' }, 500)
  }
})

// Get project technologies
projectRoutes.get('/:slug/technologies', async c => {
  try {
    const slug = c.req.param('slug')

    const technologies = await c.env.DB.prepare(
      `
      SELECT t.* FROM Technology t
      JOIN _ProjectTechnologies pt ON t.id = pt.B
      JOIN Project p ON p.id = pt.A
      WHERE p.slug = ? AND p.status = 'PUBLISHED'
      ORDER BY t.name
    `
    )
      .bind(slug)
      .all()

    return c.json({ technologies: technologies.results })
  } catch (error) {
    console.error('Get project technologies error:', error)
    return c.json({ error: 'Failed to fetch project technologies' }, 500)
  }
})
