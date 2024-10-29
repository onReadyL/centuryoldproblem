import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/utils/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const categories = await prisma.category.findMany({
      where: { userId: user.userId },
      include: {
        foods: true,
      },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await request.json();
    const category = await prisma.category.create({
      data: {
        name,
        userId: user.userId,
      },
      include: {
        foods: true,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { categories } = await request.json();

    // 更新数据库中的分类
    const updatedCategories = await Promise.all(
      categories.map(async (categoryName: string) => {
        return await prisma.category.upsert({
          where: { name_userId: { name: categoryName, userId: user.userId } },
          update: {},
          create: {
            name: categoryName,
            userId: user.userId,
          },
        });
      })
    );

    return NextResponse.json(updatedCategories);
  } catch (error) {
    console.error('Error syncing categories:', error);
    return NextResponse.json({ error: 'Failed to sync categories' }, { status: 500 });
  }
}
