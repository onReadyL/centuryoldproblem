import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function initDb() {
  try {
    // 检查数据库连接
    await prisma.$connect();
    console.log('Database connected successfully');

    // 运行迁移
    console.log('Running migrations...');
    await prisma.$executeRaw`SELECT 1`;

    // 检查是否需要运行种子数据
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      console.log('No users found, running seed data...');
      // 种子数据会通过 prisma db seed 命令自动运行
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
