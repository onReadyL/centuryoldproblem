import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const foods = await prisma.food.findMany({
      include: {
        category: true,
      },
    });
    return NextResponse.json(foods);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch foods' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, categoryId } = await request.json();
    const food = await prisma.food.create({
      data: {
        name,
        categoryId,
      },
      include: {
        category: true,
      },
    });
    return NextResponse.json(food);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create food' }, { status: 500 });
  }
}
