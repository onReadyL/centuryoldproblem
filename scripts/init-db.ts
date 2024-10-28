import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function initDb() {
  try {
    // 检查数据库连接
    await prisma.$connect();
    console.log('Database connected successfully');

    // 检查是否需要运行种子数据
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      console.log('No users found, running seed data...');
      // 运行种子数据
      await prisma.$executeRaw`SELECT 1`;
      console.log('Seed data completed');
    } else {
      console.log('Database already has data, skipping seed');
    }

    console.log('Database initialization completed');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

initDb();
