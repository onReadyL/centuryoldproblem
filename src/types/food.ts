import { SimpleFoodItem, SimpleCategory } from './prisma';

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

export const DEFAULT_FOODS: SimpleFoodItem[] = [
  { id: '1', name: '麻辣香锅', categoryId: '1', category: '川菜' },
  { id: '2', name: '火锅', categoryId: '1', category: '川菜' },
  { id: '3', name: '烤肉', categoryId: '7', category: '韩餐' },
  { id: '4', name: '寿司', categoryId: '6', category: '日料' },
  { id: '5', name: '炸鸡', categoryId: '8', category: '快餐' },
  { id: '6', name: '披萨', categoryId: '5', category: '西餐' },
  { id: '7', name: '面条', categoryId: '9', category: '其他' },
  { id: '8', name: '沙拉', categoryId: '5', category: '西餐' },
  { id: '9', name: '汉堡', categoryId: '8', category: '快餐' },
  { id: '10', name: '盖浇饭', categoryId: '8', category: '快餐' },
  { id: '11', name: '煲仔饭', categoryId: '2', category: '粤菜' },
  { id: '12', name: '川菜', categoryId: '1', category: '川菜' },
  { id: '13', name: '粤式早茶', categoryId: '2', category: '粤菜' },
  { id: '14', name: '便当', categoryId: '9', category: '其他' },
  { id: '15', name: 'pasta', categoryId: '5', category: '西餐' },
  { id: '16', name: '咖喱饭', categoryId: '9', category: '其他' },
];

export const DEFAULT_CATEGORIES: SimpleCategory[] = [
  { id: '1', name: '川菜' },
  { id: '2', name: '粤菜' },
  { id: '3', name: '江浙菜' },
  { id: '4', name: '湘菜' },
  { id: '5', name: '西餐' },
  { id: '6', name: '日料' },
  { id: '7', name: '韩餐' },
  { id: '8', name: '快餐' },
  { id: '9', name: '其他' },
];
