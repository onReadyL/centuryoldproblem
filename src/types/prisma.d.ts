import {
  Food as PrismaFood,
  Category as PrismaCategory,
  History as PrismaHistory,
} from '@prisma/client';

export interface Food extends PrismaFood {
  id: string;
  name: string;
  categoryId: string;
  category?: Category;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category extends PrismaCategory {
  id: string;
  name: string;
  foods?: Food[];
  createdAt: Date;
  updatedAt: Date;
}

export interface History extends PrismaHistory {
  id: string;
  foodId: string;
  date: Date;
  createdAt: Date;
  food?: Food;
}

// 添加组件使用的简化类型
export interface SimpleFoodItem {
  name: string;
  category: string;
}

export interface SimpleCategory {
  id: string;
  name: string;
}
