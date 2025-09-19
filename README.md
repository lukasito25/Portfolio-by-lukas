# Lukas Hosala - Portfolio Website

This is the professional portfolio website of Lukas Hosala, Senior Product Manager with 8+ years of international experience at adidas Digital Sports and fintech startups.

## 🚀 Features

- **Authentic Content**: Real experience and projects from 8+ years in product management
- **Content Editor**: Built-in admin panel at `/admin/editor` for real-time content editing
- **Dark/Light Theme**: Cosmic purple theme with full dark mode support
- **Responsive Design**: Optimized for all devices
- **Performance Optimized**: Next.js 15 with Turbopack

## 🛠 Built With

- **Next.js 15** with App Router and Turbopack
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Radix UI** for components
- **Prisma** for future database features

This is a [Next.js](https://nextjs.org) project.

## Getting Started

## 📝 Content Management

Access the content editor at `/admin/editor` to:

- Edit homepage hero content and metrics
- Update about page and professional journey
- Manage blog articles and featured content
- Modify work projects and case studies

Content is saved locally in your browser and can be exported/imported as JSON.

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variable: `DATABASE_URL="file:./dev.db"`
3. Deploy automatically

### Environment Variables

Required for deployment:

```
DATABASE_URL="file:./dev.db"
```

Optional for enhanced features:

```
NEXTAUTH_URL="https://your-domain.com"
ANALYTICS_ENABLED="true"
```

## 🔧 Development

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
