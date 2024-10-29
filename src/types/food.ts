import { SimpleFoodItem } from './prisma';

export interface FoodItem extends SimpleFoodItem {
  id: string;
  name: string;
  categoryId: string;
  category: string;
}

export const CATEGORIES = [
  '川菜',
  '粤菜',
  '江浙菜',
  '湘菜',
  '西餐',
  '日料',
  '韩餐',
  '快餐',
  '其他',
];
