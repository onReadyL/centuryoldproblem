import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
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
      [
        { name: '川菜' },
        { name: '粤菜' },
        { name: '江浙菜' },
        { name: '湘菜' },
        { name: '西餐' },
        { name: '日料' },
        { name: '韩餐' },
        { name: '快餐' },
        { name: '其他' },
      ].map(async category => {
        return prisma.category.create({
          data: {
            name: category.name,
            userId: defaultUser.id,
          },
        });
      })
    );

    // 创建默认菜品
    const defaultFoods = [
      { name: '麻辣香锅', categoryName: '川菜' },
      { name: '火锅', categoryName: '川菜' },
      { name: '烤肉', categoryName: '韩餐' },
      { name: '寿司', categoryName: '日料' },
      { name: '炸鸡', categoryName: '快餐' },
      { name: '披萨', categoryName: '西餐' },
      { name: '面条', categoryName: '其他' },
      { name: '沙拉', categoryName: '西餐' },
      { name: '汉堡', categoryName: '快餐' },
      { name: '盖浇饭', categoryName: '快餐' },
      { name: '煲仔饭', categoryName: '粤菜' },
      { name: '川菜', categoryName: '川菜' },
      { name: '粤式早茶', categoryName: '粤菜' },
      { name: '便当', categoryName: '其他' },
      { name: 'pasta', categoryName: '西餐' },
      { name: '咖喱饭', categoryName: '其他' },
    ];

    // 创建菜品
    await Promise.all(
      defaultFoods.map(async food => {
        const category = categories.find(c => c.name === food.categoryName);
        if (!category) return;

        return prisma.food.create({
          data: {
            name: food.name,
            categoryId: category.id,
            userId: defaultUser.id,
          },
        });
      })
    );

    console.log('Seed data created successfully');
  } catch (error) {
    console.error('Error creating seed data:', error);
    throw error;
  }
}

main()
  .catch(e => {
    console.error('Error in seed script:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
