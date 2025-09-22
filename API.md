# Portfolio API Documentation

This document provides comprehensive documentation for the Cloudflare Workers API that powers the portfolio application's backend services.

## 🌐 Base URL

**Production**: `https://portfolio-api.hosala-lukas.workers.dev`
**Development**: `http://localhost:8787` (when running `wrangler dev`)

## 🔒 Authentication

The API uses Bearer token authentication for admin operations. Include the API secret in the Authorization header:

```http
Authorization: Bearer portfolio-api-secret-2024
```

**Note**: Only admin routes require authentication. Public routes (projects, blog posts) are accessible without authentication.

## 📁 API Structure

```
/                    # Health check
/auth/*             # Authentication endpoints
/projects/*         # Project management
/blog/*             # Blog post management
/admin/*            # Admin operations (requires auth)
```

## 🏥 Health Check

### GET /

Check if the API is running and accessible.

**Response:**

```json
{
  "message": "Portfolio API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🔐 Authentication Endpoints

### POST /auth/verify

Verify admin credentials for login.

**Request Body:**

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response (Success):**

```json
{
  "user": {
    "id": "user-id",
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "ADMIN"
  }
}
```

**Error Responses:**

- `400`: Email and password required
- `401`: Invalid credentials
- `403`: Access denied (non-admin user)
- `500`: Authentication failed

### GET /auth/user/:id

Get user information by ID.

**Parameters:**

- `id` (string): User ID

**Response:**

```json
{
  "user": {
    "id": "user-id",
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "ADMIN"
  }
}
```

**Error Responses:**

- `404`: User not found
- `500`: Failed to fetch user

## 📂 Project Endpoints

### GET /projects

Get all published projects.

**Response:**

```json
{
  "projects": [
    {
      "id": "project-id",
      "title": "Project Title",
      "slug": "project-slug",
      "description": "Project description",
      "excerpt": "Brief excerpt",
      "thumbnail": "https://example.com/thumb.jpg",
      "demoUrl": "https://demo.example.com",
      "githubUrl": "https://github.com/user/repo",
      "category": "Web Development",
      "featured": true,
      "sortOrder": 1,
      "views": 150,
      "likes": 25,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "publishedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### GET /projects/featured

Get only featured projects.

**Response:** Same as `/projects` but filtered to featured projects only.

### GET /projects/:slug

Get a specific project by slug and increment view count.

**Parameters:**

- `slug` (string): Project slug

**Response:**

```json
{
  "project": {
    "id": "project-id",
    "title": "Project Title",
    "slug": "project-slug",
    "description": "Project description",
    "content": "Full project content in markdown",
    "excerpt": "Brief excerpt",
    "thumbnail": "https://example.com/thumb.jpg",
    "images": "https://example.com/image1.jpg,https://example.com/image2.jpg",
    "demoUrl": "https://demo.example.com",
    "githubUrl": "https://github.com/user/repo",
    "category": "Web Development",
    "status": "PUBLISHED",
    "featured": true,
    "sortOrder": 1,
    "metaTitle": "SEO Title",
    "metaDescription": "SEO Description",
    "authorId": "user-id",
    "views": 151,
    "likes": 25,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "publishedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**

- `404`: Project not found
- `500`: Failed to fetch project

### GET /projects/:slug/technologies

Get technologies associated with a project.

**Parameters:**

- `slug` (string): Project slug

**Response:**

```json
{
  "technologies": [
    {
      "id": "tech-id",
      "name": "React",
      "slug": "react",
      "description": "JavaScript library for building user interfaces",
      "icon": "react-icon",
      "color": "#61DAFB",
      "category": "Frontend",
      "level": "ADVANCED"
    }
  ]
}
```

## 📝 Blog Endpoints

### GET /blog

Get all published blog posts.

**Response:**

```json
{
  "posts": [
    {
      "id": "post-id",
      "title": "Blog Post Title",
      "slug": "blog-post-slug",
      "excerpt": "Brief excerpt of the post",
      "thumbnail": "https://example.com/thumb.jpg",
      "category": "Technology",
      "featured": true,
      "readTime": 5,
      "views": 200,
      "likes": 30,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "publishedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### GET /blog/featured

Get featured blog posts (limited to 3).

**Response:** Same as `/blog` but filtered to featured posts with a limit of 3.

### GET /blog/:slug

Get a specific blog post by slug and increment view count.

**Parameters:**

- `slug` (string): Blog post slug

**Response:**

```json
{
  "post": {
    "id": "post-id",
    "title": "Blog Post Title",
    "slug": "blog-post-slug",
    "content": "Full blog post content in markdown",
    "excerpt": "Brief excerpt",
    "thumbnail": "https://example.com/thumb.jpg",
    "category": "Technology",
    "status": "PUBLISHED",
    "featured": true,
    "metaTitle": "SEO Title",
    "metaDescription": "SEO Description",
    "authorId": "user-id",
    "views": 201,
    "likes": 30,
    "readTime": 5,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "publishedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**

- `404`: Blog post not found
- `500`: Failed to fetch blog post

### GET /blog/:slug/tags

Get tags associated with a blog post.

**Parameters:**

- `slug` (string): Blog post slug

**Response:**

```json
{
  "tags": [
    {
      "id": "tag-id",
      "name": "React",
      "slug": "react",
      "color": "#61DAFB"
    }
  ]
}
```

## 🛡 Admin Endpoints

**Note**: All admin endpoints require authentication via Bearer token.

### GET /admin/projects

Get all projects (including drafts) for admin management.

**Headers:**

```http
Authorization: Bearer portfolio-api-secret-2024
```

**Response:**

```json
{
  "projects": [
    {
      "id": "project-id",
      "title": "Project Title",
      "slug": "project-slug",
      "description": "Project description",
      "content": "Full content",
      "status": "DRAFT",
      "featured": false,
      "sortOrder": 1,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "publishedAt": null
    }
  ]
}
```

### POST /admin/projects

Create a new project.

**Headers:**

```http
Authorization: Bearer portfolio-api-secret-2024
Content-Type: application/json
```

**Request Body:**

```json
{
  "title": "New Project",
  "slug": "new-project",
  "description": "Project description",
  "content": "Full project content",
  "excerpt": "Brief excerpt",
  "thumbnail": "https://example.com/thumb.jpg",
  "demoUrl": "https://demo.example.com",
  "githubUrl": "https://github.com/user/repo",
  "category": "Web Development",
  "status": "DRAFT",
  "featured": false,
  "sortOrder": 1,
  "metaTitle": "SEO Title",
  "metaDescription": "SEO Description",
  "authorId": "user-id",
  "publishedAt": "2024-01-01T00:00:00.000Z"
}
```

**Response:**

```json
{
  "success": true,
  "projectId": "new-project-id"
}
```

### PUT /admin/projects/:id

Update an existing project.

**Parameters:**

- `id` (string): Project ID

**Headers:**

```http
Authorization: Bearer portfolio-api-secret-2024
Content-Type: application/json
```

**Request Body:** Same as POST `/admin/projects`

**Response:**

```json
{
  "success": true
}
```

### DELETE /admin/projects/:id

Delete a project.

**Parameters:**

- `id` (string): Project ID

**Headers:**

```http
Authorization: Bearer portfolio-api-secret-2024
```

**Response:**

```json
{
  "success": true
}
```

### GET /admin/blog

Get all blog posts (including drafts) for admin management.

**Headers:**

```http
Authorization: Bearer portfolio-api-secret-2024
```

**Response:**

```json
{
  "posts": [
    {
      "id": "post-id",
      "title": "Blog Post Title",
      "slug": "blog-post-slug",
      "content": "Full content",
      "status": "DRAFT",
      "featured": false,
      "readTime": 5,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "publishedAt": null
    }
  ]
}
```

## 📊 Database Schema

The API uses Cloudflare D1 (SQLite) with the following main tables:

### Core Tables

- **User**: User accounts and admin credentials
- **Project**: Portfolio projects with metadata
- **BlogPost**: Blog articles and content
- **Technology**: Technologies used in projects
- **Tag**: Tags for blog posts

### Relationship Tables

- **\_ProjectTechnologies**: Many-to-many relationship between projects and technologies
- **\_BlogPostTags**: Many-to-many relationship between blog posts and tags

### Utility Tables

- **ContactSubmission**: Contact form submissions
- **Newsletter**: Newsletter subscriptions
- **Analytics**: Page view analytics
- **MediaFile**: File uploads and media management

## 🔧 Environment Variables

The API uses the following environment variables:

- `CORS_ORIGIN`: Allowed origin for CORS (default: production frontend URL)
- `API_SECRET`: Secret key for admin authentication

## 🌍 CORS Configuration

The API automatically configures CORS based on the environment:

- **Production**: Allows requests from `https://portfolio-by-lukas.vercel.app`
- **Development**: Allows requests from `http://localhost:3000`

**Allowed Headers**: `Content-Type`, `Authorization`
**Allowed Methods**: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`

## ⚡ Performance Considerations

### Caching

- GET endpoints are cached at the edge for improved performance
- Cache invalidation happens on content updates

### Rate Limiting

- Built-in Cloudflare rate limiting protects against abuse
- Admin endpoints have additional protection

### Database Optimization

- Proper indexing on frequently queried fields
- Optimized queries for better performance
- View count increments use efficient UPDATE statements

## 🔍 Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message describing what went wrong"
}
```

### Common HTTP Status Codes

- `200`: Success
- `400`: Bad Request (missing/invalid parameters)
- `401`: Unauthorized (missing/invalid auth token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found (resource doesn't exist)
- `500`: Internal Server Error (unexpected error)

## 🧪 Testing the API

### Using curl

**Health Check:**

```bash
curl https://portfolio-api.hosala-lukas.workers.dev/
```

**Get Projects:**

```bash
curl https://portfolio-api.hosala-lukas.workers.dev/projects
```

**Admin Operation:**

```bash
curl -H "Authorization: Bearer portfolio-api-secret-2024" \
     https://portfolio-api.hosala-lukas.workers.dev/admin/projects
```

### Using JavaScript

```javascript
// Public endpoint
const response = await fetch(
  'https://portfolio-api.hosala-lukas.workers.dev/projects'
)
const { projects } = await response.json()

// Admin endpoint
const adminResponse = await fetch(
  'https://portfolio-api.hosala-lukas.workers.dev/admin/projects',
  {
    headers: {
      Authorization: 'Bearer portfolio-api-secret-2024',
    },
  }
)
const { projects: adminProjects } = await adminResponse.json()
```

## 🚀 Deployment

The API is deployed on Cloudflare Workers with automatic deployment via GitHub Actions or manual deployment using:

```bash
cd cloudflare-api
wrangler deploy
```

**Database Migrations:**

```bash
wrangler d1 execute portfolio-db --file=migrations/schema.sql
wrangler d1 execute portfolio-db --file=migrations/seed.sql
```

## 📞 Support

For API issues or questions:

1. Check the [deployment logs](https://dash.cloudflare.com) in Cloudflare dashboard
2. Verify environment variables and configuration
3. Test with curl or Postman to isolate issues
4. Review this documentation for correct usage patterns

---

This API documentation provides all the information needed to integrate with the portfolio application's backend services. The API is designed to be fast, reliable, and secure for both public content delivery and admin operations.
