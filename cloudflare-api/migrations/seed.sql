-- Seed data for portfolio D1 database
-- This will create initial data including admin user and sample content

-- Insert admin user (password: admin123, hashed with bcrypt)
INSERT INTO User (id, name, email, password, role, createdAt, updatedAt) VALUES
('admin-user-id', 'Lukas Hosala', 'admin@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBNj9.VKzA3lUe', 'ADMIN', datetime('now'), datetime('now'));

-- Insert sample technologies
INSERT INTO Technology (id, name, slug, category, level, color, icon, createdAt, updatedAt) VALUES
('tech-1', 'React', 'react', 'Frontend', 'EXPERT', '#61DAFB', 'react', datetime('now'), datetime('now')),
('tech-2', 'Next.js', 'nextjs', 'Frontend', 'EXPERT', '#000000', 'nextjs', datetime('now'), datetime('now')),
('tech-3', 'TypeScript', 'typescript', 'Frontend', 'ADVANCED', '#3178C6', 'typescript', datetime('now'), datetime('now')),
('tech-4', 'Tailwind CSS', 'tailwindcss', 'Frontend', 'ADVANCED', '#06B6D4', 'tailwindcss', datetime('now'), datetime('now')),
('tech-5', 'Node.js', 'nodejs', 'Backend', 'EXPERT', '#339933', 'nodejs', datetime('now'), datetime('now')),
('tech-6', 'Prisma', 'prisma', 'Backend', 'ADVANCED', '#2D3748', 'prisma', datetime('now'), datetime('now')),
('tech-7', 'PostgreSQL', 'postgresql', 'Database', 'ADVANCED', '#336791', 'postgresql', datetime('now'), datetime('now')),
('tech-8', 'Cloudflare', 'cloudflare', 'Cloud', 'INTERMEDIATE', '#F38020', 'cloudflare', datetime('now'), datetime('now'));

-- Insert sample tags
INSERT INTO Tag (id, name, slug, color, createdAt, updatedAt) VALUES
('tag-1', 'Web Development', 'web-development', '#3B82F6', datetime('now'), datetime('now')),
('tag-2', 'React', 'react-tag', '#61DAFB', datetime('now'), datetime('now')),
('tag-3', 'Tutorial', 'tutorial', '#10B981', datetime('now'), datetime('now')),
('tag-4', 'Best Practices', 'best-practices', '#8B5CF6', datetime('now'), datetime('now'));

-- Insert sample projects
INSERT INTO Project (
    id, title, slug, description, content, excerpt, thumbnail, demoUrl, githubUrl,
    category, status, featured, sortOrder, metaTitle, metaDescription, authorId,
    views, likes, createdAt, updatedAt, publishedAt
) VALUES
(
    'project-1',
    'Portfolio Website',
    'portfolio-website',
    'Modern portfolio website built with Next.js and Cloudflare D1',
    '# Portfolio Website\n\nA modern, performant portfolio website showcasing projects and blog posts.',
    'Modern portfolio website with CMS functionality and edge database integration',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    'https://portfolio-by-lukas.vercel.app',
    'https://github.com/lukasito25/Portfolio-by-lukas',
    'Full Stack',
    'PUBLISHED',
    1,
    1,
    'Portfolio Website - Lukas Hosala',
    'Modern portfolio website built with Next.js, Cloudflare D1, and TypeScript',
    'admin-user-id',
    0,
    0,
    datetime('now'),
    datetime('now'),
    datetime('now')
);

-- Insert sample blog post
INSERT INTO BlogPost (
    id, title, slug, content, excerpt, thumbnail, category, status, featured,
    metaTitle, metaDescription, authorId, views, likes, readTime,
    createdAt, updatedAt, publishedAt
) VALUES
(
    'post-1',
    'Building with Cloudflare D1 and Next.js',
    'cloudflare-d1-nextjs',
    '# Building with Cloudflare D1 and Next.js\n\nLearn how to integrate Cloudflare D1 database with your Next.js applications.',
    'A comprehensive guide to using Cloudflare D1 as your application database',
    'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop',
    'Tutorial',
    'PUBLISHED',
    1,
    'Building with Cloudflare D1 and Next.js - Tutorial',
    'Learn how to integrate Cloudflare D1 database with Next.js applications for edge performance',
    'admin-user-id',
    0,
    0,
    5,
    datetime('now'),
    datetime('now'),
    datetime('now')
);

-- Insert project-technology relationships
INSERT INTO _ProjectTechnologies (A, B) VALUES
('project-1', 'tech-1'),
('project-1', 'tech-2'),
('project-1', 'tech-3'),
('project-1', 'tech-4'),
('project-1', 'tech-8');

-- Insert blog post-tag relationships
INSERT INTO _BlogPostTags (A, B) VALUES
('post-1', 'tag-1'),
('post-1', 'tag-3'),
('post-1', 'tag-4');