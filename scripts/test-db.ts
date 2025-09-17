import { prisma } from '../lib/db/prisma'

async function testConnection() {
  try {
    // Test basic connection
    await prisma.$connect()
    console.log('✅ Database connection successful')

    // Test that tables exist by running a simple count query
    const userCount = await prisma.user.count()
    const archiveCount = await prisma.archive.count()

    console.log(`📊 Users: ${userCount}, Archives: ${archiveCount}`)
    console.log('✅ Schema verification successful')

  } catch (error) {
    console.error('❌ Database test failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
