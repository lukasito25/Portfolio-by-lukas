import { PrismaClient } from '../src/generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
  const hashedPassword = await bcrypt.hash(adminPassword, 12)

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Lukas Hosala',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log('✅ Admin user created:', admin.email)

  // Create sample technologies
  const technologies = [
    // Frontend
    {
      name: 'React',
      slug: 'react',
      category: 'Frontend',
      level: 'EXPERT',
      color: '#61DAFB',
      icon: 'react',
    },
    {
      name: 'Next.js',
      slug: 'nextjs',
      category: 'Frontend',
      level: 'EXPERT',
      color: '#000000',
      icon: 'nextjs',
    },
    {
      name: 'TypeScript',
      slug: 'typescript',
      category: 'Frontend',
      level: 'ADVANCED',
      color: '#3178C6',
      icon: 'typescript',
    },
    {
      name: 'Tailwind CSS',
      slug: 'tailwindcss',
      category: 'Frontend',
      level: 'ADVANCED',
      color: '#06B6D4',
      icon: 'tailwindcss',
    },
    {
      name: 'Vue.js',
      slug: 'vuejs',
      category: 'Frontend',
      level: 'INTERMEDIATE',
      color: '#4FC08D',
      icon: 'vuejs',
    },

    // Backend
    {
      name: 'Node.js',
      slug: 'nodejs',
      category: 'Backend',
      level: 'EXPERT',
      color: '#339933',
      icon: 'nodejs',
    },
    {
      name: 'Express.js',
      slug: 'expressjs',
      category: 'Backend',
      level: 'ADVANCED',
      color: '#000000',
      icon: 'express',
    },
    {
      name: 'Prisma',
      slug: 'prisma',
      category: 'Backend',
      level: 'ADVANCED',
      color: '#2D3748',
      icon: 'prisma',
    },
    {
      name: 'GraphQL',
      slug: 'graphql',
      category: 'Backend',
      level: 'INTERMEDIATE',
      color: '#E10098',
      icon: 'graphql',
    },

    // Database
    {
      name: 'PostgreSQL',
      slug: 'postgresql',
      category: 'Database',
      level: 'ADVANCED',
      color: '#336791',
      icon: 'postgresql',
    },
    {
      name: 'MongoDB',
      slug: 'mongodb',
      category: 'Database',
      level: 'INTERMEDIATE',
      color: '#47A248',
      icon: 'mongodb',
    },
    {
      name: 'Redis',
      slug: 'redis',
      category: 'Database',
      level: 'INTERMEDIATE',
      color: '#DC382D',
      icon: 'redis',
    },

    // Tools & Others
    {
      name: 'Docker',
      slug: 'docker',
      category: 'DevOps',
      level: 'INTERMEDIATE',
      color: '#2496ED',
      icon: 'docker',
    },
    {
      name: 'AWS',
      slug: 'aws',
      category: 'Cloud',
      level: 'INTERMEDIATE',
      color: '#FF9900',
      icon: 'aws',
    },
    {
      name: 'Git',
      slug: 'git',
      category: 'Tools',
      level: 'EXPERT',
      color: '#F05032',
      icon: 'git',
    },
  ]

  const createdTechnologies = []
  for (const tech of technologies) {
    const techData = {
      ...tech,
      level: tech.level as any, // Type cast to work with Prisma enum
    }
    const technology = await prisma.technology.upsert({
      where: { slug: tech.slug },
      update: techData,
      create: techData,
    })
    createdTechnologies.push(technology)
  }

  console.log('✅ Technologies created:', createdTechnologies.length)

  // Create sample tags
  const tags = [
    { name: 'Web Development', slug: 'web-development', color: '#3B82F6' },
    { name: 'React', slug: 'react-tag', color: '#61DAFB' },
    { name: 'Next.js', slug: 'nextjs-tag', color: '#000000' },
    { name: 'TypeScript', slug: 'typescript-tag', color: '#3178C6' },
    { name: 'Tutorial', slug: 'tutorial', color: '#10B981' },
    { name: 'Best Practices', slug: 'best-practices', color: '#8B5CF6' },
    { name: 'Performance', slug: 'performance', color: '#F59E0B' },
    { name: 'DevOps', slug: 'devops', color: '#EF4444' },
  ]

  const createdTags = []
  for (const tag of tags) {
    const createdTag = await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: tag,
      create: tag,
    })
    createdTags.push(createdTag)
  }

  console.log('✅ Tags created:', createdTags.length)

  // Create sample projects
  const reactTech = createdTechnologies.find(t => t.slug === 'react')
  const nextjsTech = createdTechnologies.find(t => t.slug === 'nextjs')
  const typeScriptTech = createdTechnologies.find(t => t.slug === 'typescript')
  const tailwindTech = createdTechnologies.find(t => t.slug === 'tailwindcss')

  const projects = [
    {
      title: 'E-Commerce Platform',
      slug: 'e-commerce-platform',
      description:
        'A full-stack e-commerce platform built with Next.js and TypeScript',
      content: `
# E-Commerce Platform

A modern, full-stack e-commerce platform that demonstrates advanced web development techniques and best practices.

## Features

- **Product Management**: Complete CRUD operations for products with image uploads
- **Shopping Cart**: Persistent cart with local storage and session management
- **User Authentication**: Secure authentication with NextAuth.js
- **Payment Integration**: Stripe integration for secure payments
- **Order Management**: Complete order processing and tracking
- **Admin Dashboard**: Comprehensive admin panel for managing products, orders, and users

## Technologies Used

- **Frontend**: Next.js 13+, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Payment**: Stripe
- **Deployment**: Vercel

## Key Learning Points

This project taught me about scalable architecture, payment processing, and building production-ready applications.
      `,
      excerpt:
        'A full-stack e-commerce platform demonstrating modern web development with Next.js, TypeScript, and Stripe integration.',
      thumbnail:
        'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
      demoUrl: 'https://ecommerce-demo.vercel.app',
      githubUrl: 'https://github.com/lukashosala/ecommerce-platform',
      category: 'Full Stack',
      status: 'PUBLISHED' as const,
      featured: true,
      sortOrder: 1,
      metaTitle: 'E-Commerce Platform - Full Stack Next.js Project',
      metaDescription:
        'Modern e-commerce platform built with Next.js, TypeScript, and Prisma. Features include payment processing, user authentication, and admin dashboard.',
      authorId: admin.id,
      publishedAt: new Date('2024-01-15'),
    },
    {
      title: 'Task Management Dashboard',
      slug: 'task-management-dashboard',
      description:
        'A collaborative task management application with real-time updates',
      content: `
# Task Management Dashboard

A collaborative task management application that helps teams organize and track their work efficiently.

## Features

- **Real-time Collaboration**: Live updates using WebSockets
- **Drag & Drop Interface**: Intuitive task organization with beautiful animations
- **Team Management**: User roles and permissions
- **Project Organization**: Organize tasks into projects and boards
- **Time Tracking**: Built-in time tracking for productivity insights
- **Notifications**: Real-time notifications for task updates

## Technical Highlights

- **State Management**: Redux Toolkit for complex state management
- **Real-time Updates**: Socket.io for live collaboration
- **Animations**: Framer Motion for smooth interactions
- **Performance**: Optimized with React.memo and useMemo
      `,
      excerpt:
        'Collaborative task management with real-time updates, drag & drop interface, and team collaboration features.',
      thumbnail:
        'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop',
      demoUrl: 'https://taskboard-demo.vercel.app',
      githubUrl: 'https://github.com/lukashosala/task-dashboard',
      category: 'Frontend',
      status: 'PUBLISHED' as const,
      featured: true,
      sortOrder: 2,
      authorId: admin.id,
      publishedAt: new Date('2024-02-20'),
    },
    {
      title: 'Portfolio Website',
      slug: 'portfolio-website',
      description:
        'This very portfolio website built with Next.js and modern technologies',
      content: `
# Portfolio Website

The website you're currently viewing! Built with modern web technologies and best practices.

## Features

- **CMS Integration**: Custom CMS for managing projects and blog posts
- **SEO Optimized**: Meta tags, structured data, and performance optimization
- **Analytics**: Custom analytics tracking for insights
- **Contact System**: Contact form with email notifications
- **Newsletter**: Email newsletter subscription system
- **Admin Panel**: Secure admin interface for content management

## Performance Features

- **Static Generation**: Optimized with Next.js ISR
- **Image Optimization**: Next.js Image component with WebP support
- **Code Splitting**: Automatic code splitting for optimal loading
- **Caching Strategy**: Comprehensive caching at multiple levels
      `,
      excerpt:
        'Modern portfolio website with CMS functionality, analytics, and optimized performance.',
      thumbnail:
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      demoUrl: 'https://lukashosala.com',
      githubUrl: 'https://github.com/lukashosala/portfolio',
      category: 'Full Stack',
      status: 'PUBLISHED' as const,
      featured: false,
      sortOrder: 3,
      authorId: admin.id,
      publishedAt: new Date('2024-03-10'),
    },
  ]

  const createdProjects = []
  for (const project of projects) {
    const createdProject = await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: {
        ...project,
        technologies: {
          connect: [
            { id: reactTech?.id },
            { id: nextjsTech?.id },
            { id: typeScriptTech?.id },
            { id: tailwindTech?.id },
          ].filter(Boolean),
        },
      },
    })
    createdProjects.push(createdProject)
  }

  console.log('✅ Projects created:', createdProjects.length)

  // Create sample blog posts
  const reactTag = createdTags.find(t => t.slug === 'react-tag')
  const tutorialTag = createdTags.find(t => t.slug === 'tutorial')
  const performanceTag = createdTags.find(t => t.slug === 'performance')

  const blogPosts = [
    {
      title: 'Building Scalable React Applications',
      slug: 'building-scalable-react-applications',
      content: `
# Building Scalable React Applications

As React applications grow in complexity, maintaining clean and scalable code becomes increasingly important. Here are some strategies I've learned for building maintainable React applications.

## Component Architecture

### 1. Atomic Design Principles

Following atomic design helps create a consistent component hierarchy:

- **Atoms**: Basic building blocks (buttons, inputs, labels)
- **Molecules**: Simple combinations of atoms (search box, card header)
- **Organisms**: Complex components (navigation, product list)
- **Templates**: Page-level structure without content
- **Pages**: Specific instances of templates with real content

### 2. Custom Hooks for Logic Separation

Custom hooks are excellent for separating business logic from UI components:

\`\`\`typescript
// useApi.ts
function useApi<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [url]);

  return { data, loading, error };
}
\`\`\`

## State Management

For larger applications, consider these state management patterns:

### 1. Context + useReducer for Complex State

\`\`\`typescript
interface AppState {
  user: User | null;
  theme: 'light' | 'dark';
  notifications: Notification[];
}

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    default:
      return state;
  }
}
\`\`\`

### 2. Zustand for Simple Global State

\`\`\`typescript
import { create } from 'zustand';

interface StoreState {
  count: number;
  increment: () => void;
  decrement: () => void;
}

const useStore = create<StoreState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));
\`\`\`

## Performance Optimization

### 1. Memoization Strategies

Use React.memo, useMemo, and useCallback strategically:

\`\`\`typescript
const ExpensiveComponent = React.memo(({ data, onUpdate }) => {
  const processedData = useMemo(() => {
    return data.map(item => expensiveTransformation(item));
  }, [data]);

  const handleUpdate = useCallback((id: string) => {
    onUpdate(id);
  }, [onUpdate]);

  return (
    <div>
      {processedData.map(item => (
        <Item key={item.id} data={item} onUpdate={handleUpdate} />
      ))}
    </div>
  );
});
\`\`\`

### 2. Code Splitting

Implement route-based and component-based code splitting:

\`\`\`typescript
// Route-based splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));

// Component-based splitting
const HeavyChart = lazy(() => import('./components/HeavyChart'));
\`\`\`

## Testing Strategy

A comprehensive testing approach includes:

1. **Unit Tests**: Individual component and hook testing
2. **Integration Tests**: Component interaction testing
3. **E2E Tests**: Full user flow testing

\`\`\`typescript
// Example component test
test('should display user name when logged in', () => {
  const user = { name: 'John Doe', email: 'john@example.com' };

  render(
    <UserProvider value={{ user }}>
      <Header />
    </UserProvider>
  );

  expect(screen.getByText('John Doe')).toBeInTheDocument();
});
\`\`\`

## Conclusion

Building scalable React applications requires careful planning and adherence to established patterns. Focus on component reusability, proper state management, performance optimization, and comprehensive testing.

Remember that the best architecture is one that your team can understand and maintain effectively.
      `,
      excerpt:
        'Learn strategies for building maintainable and scalable React applications, including component architecture, state management, and performance optimization.',
      thumbnail:
        'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop',
      category: 'Tutorial',
      status: 'PUBLISHED' as const,
      featured: true,
      metaTitle: 'Building Scalable React Applications - Best Practices Guide',
      metaDescription:
        'Complete guide to building scalable React applications with component architecture, state management, and performance optimization strategies.',
      readTime: 8,
      authorId: admin.id,
      publishedAt: new Date('2024-01-25'),
    },
    {
      title: 'Next.js 13+ App Router: Complete Guide',
      slug: 'nextjs-app-router-guide',
      content: `
# Next.js 13+ App Router: Complete Guide

The new App Router in Next.js 13+ represents a significant shift in how we build Next.js applications. Let's explore the key concepts and migration strategies.

## What's New in App Router

### 1. File-based Routing Changes

The app directory introduces new file conventions:

- \`page.tsx\`: UI unique to a route
- \`layout.tsx\`: Shared UI for a segment and its children
- \`loading.tsx\`: Loading UI for a segment
- \`error.tsx\`: Error UI for a segment
- \`not-found.tsx\`: Not found UI

### 2. Server Components by Default

All components in the app directory are Server Components by default:

\`\`\`typescript
// app/posts/page.tsx - Server Component
async function PostsPage() {
  const posts = await fetch('https://api.example.com/posts').then(res => res.json());

  return (
    <div>
      <h1>Posts</h1>
      {posts.map(post => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}
\`\`\`

### 3. Client Components with "use client"

When you need interactivity, use the "use client" directive:

\`\`\`typescript
'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
\`\`\`

## Layouts and Nested Routing

### Root Layout

Every app needs a root layout:

\`\`\`typescript
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header>My App</header>
        <main>{children}</main>
        <footer>© 2024</footer>
      </body>
    </html>
  );
}
\`\`\`

### Nested Layouts

Create nested layouts for different sections:

\`\`\`typescript
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard">
      <nav>Dashboard Navigation</nav>
      <div className="content">{children}</div>
    </div>
  );
}
\`\`\`

## Data Fetching Patterns

### Server-side Data Fetching

Fetch data directly in Server Components:

\`\`\`typescript
async function ProductPage({ params }: { params: { id: string } }) {
  const product = await fetch(\`/api/products/\${params.id}\`).then(res => res.json());

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>Price: \${product.price}</p>
    </div>
  );
}
\`\`\`

### Parallel Data Fetching

Fetch multiple data sources in parallel:

\`\`\`typescript
async function DashboardPage() {
  const [users, posts, analytics] = await Promise.all([
    fetch('/api/users').then(res => res.json()),
    fetch('/api/posts').then(res => res.json()),
    fetch('/api/analytics').then(res => res.json()),
  ]);

  return (
    <div>
      <UsersSection users={users} />
      <PostsSection posts={posts} />
      <AnalyticsSection data={analytics} />
    </div>
  );
}
\`\`\`

## Migration Strategy

### 1. Incremental Adoption

You can adopt the App Router incrementally:

- Keep existing pages in the \`pages\` directory
- Add new routes in the \`app\` directory
- Gradually migrate existing routes

### 2. Component Migration

Server Components require some adjustments:

\`\`\`typescript
// Before (pages directory)
function MyPage({ data }) {
  const [state, setState] = useState(data);

  return <div>{/* JSX */}</div>;
}

export async function getServerSideProps() {
  const data = await fetchData();
  return { props: { data } };
}

// After (app directory)
async function MyPage() {
  const data = await fetchData(); // Direct fetch in component

  return <ClientComponent initialData={data} />;
}

// Separate client component for interactivity
'use client';
function ClientComponent({ initialData }) {
  const [state, setState] = useState(initialData);

  return <div>{/* JSX */}</div>;
}
\`\`\`

## Best Practices

### 1. Composition Patterns

Compose Server and Client Components effectively:

\`\`\`typescript
// Server Component
async function BlogPost({ id }: { id: string }) {
  const post = await fetchPost(id);

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
      {/* Client Component for interactivity */}
      <LikeButton postId={id} initialLikes={post.likes} />
      <CommentSection postId={id} />
    </article>
  );
}
\`\`\`

### 2. Error Boundaries

Use error boundaries for better error handling:

\`\`\`typescript
// app/posts/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
\`\`\`

## Conclusion

The App Router brings powerful new patterns to Next.js applications. While there's a learning curve, the benefits of Server Components, improved data fetching, and better developer experience make it worth the migration effort.

Start small, migrate incrementally, and embrace the new paradigms for building modern web applications.
      `,
      excerpt:
        'Comprehensive guide to Next.js 13+ App Router, covering Server Components, new routing patterns, data fetching, and migration strategies.',
      thumbnail:
        'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop',
      category: 'Tutorial',
      status: 'PUBLISHED' as const,
      featured: true,
      metaTitle:
        'Next.js App Router Complete Guide - Server Components & Migration',
      metaDescription:
        'Learn Next.js 13+ App Router with Server Components, new routing patterns, data fetching strategies, and step-by-step migration guide.',
      readTime: 12,
      authorId: admin.id,
      publishedAt: new Date('2024-02-15'),
    },
  ]

  const createdBlogPosts = []
  for (const post of blogPosts) {
    const createdPost = await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: {
        ...post,
        tags: {
          connect: [
            { id: reactTag?.id },
            { id: tutorialTag?.id },
            { id: performanceTag?.id },
          ].filter(Boolean),
        },
      },
    })
    createdBlogPosts.push(createdPost)
  }

  console.log('✅ Blog posts created:', createdBlogPosts.length)

  // Create sample recruiter page
  const sampleRecruiterPage = await prisma.recruiterPage.upsert({
    where: { slug: 'techcorp-product-strategy' },
    update: {},
    create: {
      title: 'Strategic Product Leadership for TechCorp',
      slug: 'techcorp-product-strategy',
      companyName: 'TechCorp',
      companySlug: 'techcorp',
      isActive: true,
      roleName: 'Head of Product',
      roleLevel: 'Director',
      companySize: '500-1000',
      industry: 'B2B SaaS',
      templateType: 'company-mirror',
      authorId: admin.id,
      customContent: JSON.stringify({
        heroMessage:
          'Transform TechCorp product strategy with proven methodologies',
        valueProposition: 'Drive 40% faster time-to-market and 25% user growth',
      }),
      companyInfo: JSON.stringify({
        stage: 'Scale-Up',
        marketPosition: 'Growing',
        growthRate: '+45% YoY',
        primaryGoals: [
          'Market Expansion',
          'Product Innovation',
          'Team Scalability',
        ],
      }),
      challenges: JSON.stringify([
        {
          title: 'Product-Market Fit Optimization',
          description:
            'Struggling to identify the highest-impact features that drive user retention and expansion revenue.',
          impact: 'High',
          urgency: 'Critical',
        },
        {
          title: 'Cross-Functional Team Alignment',
          description:
            'Engineering, Design, and Marketing teams working in silos, leading to conflicting priorities and delayed releases.',
          impact: 'High',
          urgency: 'High',
        },
        {
          title: 'Data-Driven Decision Making',
          description:
            'Limited product analytics infrastructure making it difficult to measure feature success and user behavior.',
          impact: 'Medium',
          urgency: 'High',
        },
      ]),
      solutions: JSON.stringify([
        {
          title: 'Strategic Product Roadmap',
          description:
            'Develop a data-driven product strategy aligned with business objectives and user needs.',
          timeframe: '30 days',
          impact: '15-25% increase in user engagement',
        },
        {
          title: 'Cross-Functional Process Framework',
          description:
            'Implement agile methodologies and communication protocols to break down silos.',
          timeframe: '60 days',
          impact: '40% reduction in time-to-market',
        },
        {
          title: 'Analytics & Measurement System',
          description:
            'Deploy comprehensive product analytics to track KPIs and optimize user experience.',
          timeframe: '90 days',
          impact: '30% improvement in feature adoption',
        },
      ]),
      views: 0,
      uniqueViews: 0,
      responses: 0,
    },
  })

  console.log('✅ Sample recruiter page created:', sampleRecruiterPage.slug)

  console.log('🎉 Database seed completed successfully!')
  console.log(`
📊 Summary:
- Admin user: ${admin.email}
- Technologies: ${createdTechnologies.length}
- Tags: ${createdTags.length}
- Projects: ${createdProjects.length}
- Blog posts: ${createdBlogPosts.length}

🔑 Admin credentials:
Email: ${adminEmail}
Password: ${adminPassword}

Make sure to change the admin password in production!
  `)
}

main()
  .catch(e => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
