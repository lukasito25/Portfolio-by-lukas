import { PrismaClient } from './src/generated/prisma/index.js'

const prisma = new PrismaClient()

async function verifyData() {
  console.log('🔍 Verifying database content...\n')

  try {
    // Check users
    const users = await prisma.user.findMany()
    console.log(`👤 Users: ${users.length}`)
    users.forEach(user => console.log(`  - ${user.name} (${user.email})`))

    // Check technologies
    const technologies = await prisma.technology.findMany()
    console.log(`\n💻 Technologies: ${technologies.length}`)
    console.log('Categories:', [...new Set(technologies.map(t => t.category))])

    // Check projects
    const projects = await prisma.project.findMany()
    console.log(`\n📁 Projects: ${projects.length}`)
    projects.forEach(project => console.log(`  - ${project.title}`))

    // Check blog posts
    const blogPosts = await prisma.blogPost.findMany()
    console.log(`\n📝 Blog Posts: ${blogPosts.length}`)
    blogPosts.forEach(post => console.log(`  - ${post.title}`))

    // Check tags
    const tags = await prisma.tag.findMany()
    console.log(`\n🏷️  Tags: ${tags.length}`)
    tags.forEach(tag => console.log(`  - ${tag.name}`))

    console.log('\n✅ Data verification complete!')
  } catch (error) {
    console.error('❌ Error verifying data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verifyData()
