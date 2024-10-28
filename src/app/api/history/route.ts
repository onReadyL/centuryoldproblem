import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/utils/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const history = await prisma.history.findMany({
      where: { userId: user.userId },
      include: {
        food: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
      take: 7,
    });
    return NextResponse.json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { foodId } = await request.json();
    const history = await prisma.history.create({
      data: {
        foodId,
        userId: user.userId,
      },
      include: {
        food: {
          include: {
            category: true,
          },
        },
      },
    });
    return NextResponse.json(history);
  } catch (error) {
    console.error('Error creating history:', error);
    return NextResponse.json({ error: 'Failed to create history' }, { status: 500 });
  }
}
