import { Hono } from 'hono'

type Bindings = {
  DB: D1Database
  API_SECRET: string
}

export const blogRoutes = new Hono<{ Bindings: Bindings }>()

// Get all published blog posts
blogRoutes.get('/', async c => {
  try {
    const posts = await c.env.DB.prepare(
      `
      SELECT
        id, title, slug, excerpt, thumbnail, category,
        featured, readTime, views, likes, createdAt, publishedAt
      FROM BlogPost
      WHERE status = 'PUBLISHED'
      ORDER BY publishedAt DESC
    `
    ).all()

    return c.json({ posts: posts.results })
  } catch (error) {
    console.error('Get blog posts error:', error)
    return c.json({ error: 'Failed to fetch blog posts' }, 500)
  }
})

// Get featured blog posts
blogRoutes.get('/featured', async c => {
  try {
    const posts = await c.env.DB.prepare(
      `
      SELECT
        id, title, slug, excerpt, thumbnail, category,
        featured, readTime, views, likes, createdAt, publishedAt
      FROM BlogPost
      WHERE status = 'PUBLISHED' AND featured = 1
      ORDER BY publishedAt DESC
      LIMIT 3
    `
    ).all()

    return c.json({ posts: posts.results })
  } catch (error) {
    console.error('Get featured blog posts error:', error)
    return c.json({ error: 'Failed to fetch featured blog posts' }, 500)
  }
})

// Get blog post by slug
blogRoutes.get('/:slug', async c => {
  try {
    const slug = c.req.param('slug')

    const post = await c.env.DB.prepare(
      `
      SELECT * FROM BlogPost
      WHERE slug = ? AND status = 'PUBLISHED'
    `
    )
      .bind(slug)
      .first()

    if (!post) {
      return c.json({ error: 'Blog post not found' }, 404)
    }

    // Increment view count
    await c.env.DB.prepare(
      `
      UPDATE BlogPost SET views = views + 1 WHERE id = ?
    `
    )
      .bind(post.id)
      .run()

    return c.json({ post })
  } catch (error) {
    console.error('Get blog post error:', error)
    return c.json({ error: 'Failed to fetch blog post' }, 500)
  }
})

// Get blog post tags
blogRoutes.get('/:slug/tags', async c => {
  try {
    const slug = c.req.param('slug')

    const tags = await c.env.DB.prepare(
      `
      SELECT t.* FROM Tag t
      JOIN _BlogPostTags bt ON t.id = bt.B
      JOIN BlogPost p ON p.id = bt.A
      WHERE p.slug = ? AND p.status = 'PUBLISHED'
      ORDER BY t.name
    `
    )
      .bind(slug)
      .all()

    return c.json({ tags: tags.results })
  } catch (error) {
    console.error('Get blog post tags error:', error)
    return c.json({ error: 'Failed to fetch blog post tags' }, 500)
  }
})
