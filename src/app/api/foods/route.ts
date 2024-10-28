import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/utils/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const foods = await prisma.food.findMany({
      where: { userId: user.userId },
      include: {
        category: true,
      },
    });
    return NextResponse.json(foods);
  } catch (error) {
    console.error('Error fetching foods:', error);
    return NextResponse.json({ error: 'Failed to fetch foods' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, categoryId } = await request.json();
    const food = await prisma.food.create({
      data: {
        name,
        categoryId,
        userId: user.userId,
      },
      include: {
        category: true,
      },
    });
    return NextResponse.json(food);
  } catch (error) {
    console.error('Error creating food:', error);
    return NextResponse.json({ error: 'Failed to create food' }, { status: 500 });
  }
}
