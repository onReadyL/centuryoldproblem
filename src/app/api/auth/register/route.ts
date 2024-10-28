import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { DEFAULT_CATEGORIES } from '@/constants/food';

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    // 验证邮箱格式
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: '请输入有效的邮箱地址' }, { status: 400 });
    }

    // 验证密码长度
    if (!password || password.length < 6) {
      return NextResponse.json({ error: '密码长度至少为6位' }, { status: 400 });
    }

    // 检查邮箱是否已注册
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: '该邮箱已被注册' }, { status: 400 });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || email.split('@')[0],
      },
    });

    // 为新用户创建默认分类
    await Promise.all(
      DEFAULT_CATEGORIES.map(categoryName =>
        prisma.category.create({
          data: {
            name: categoryName,
            userId: user.id,
          },
        })
      )
    );

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: '注册失败，请重试' }, { status: 500 });
  }
}
