import { PrismaClient } from '@prisma/client';
import { DEFAULT_CATEGORIES, DEFAULT_FOODS } from '../src/types/food';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 创建默认用户
  const defaultUser = await prisma.user.create({
    data: {
      email: 'demo@example.com',
      password: await bcrypt.hash('123456', 10),
      name: 'Demo User',
    },
  });

  // 创建默认分类
  const categories = await Promise.all(
    DEFAULT_CATEGORIES.map(async category => {
      return prisma.category.create({
        data: {
          id: category.id,
          name: category.name,
          userId: defaultUser.id,
        },
      });
    })
  );

  // 创建默认菜品
  await Promise.all(
    DEFAULT_FOODS.map(async food => {
      return prisma.food.create({
        data: {
          name: food.name,
          categoryId: food.categoryId,
          userId: defaultUser.id,
        },
      });
    })
  );

  console.log('Seed data created successfully');
}

main()
  .catch(e => {
    console.error('Error creating seed data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
