export interface FoodItem {
  name: string;
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

export const DEFAULT_FOODS: FoodItem[] = [
  { name: '麻辣香锅', category: '川菜' },
  { name: '火锅', category: '川菜' },
  { name: '烤肉', category: '韩餐' },
  { name: '寿司', category: '日料' },
  { name: '炸鸡', category: '快餐' },
  { name: '披萨', category: '西餐' },
  { name: '面条', category: '其他' },
  { name: '沙拉', category: '西餐' },
  { name: '汉堡', category: '快餐' },
  { name: '盖浇饭', category: '快餐' },
  { name: '煲仔饭', category: '粤菜' },
  { name: '川菜', category: '川菜' },
  { name: '粤式早茶', category: '粤菜' },
  { name: '便当', category: '其他' },
  { name: 'pasta', category: '西餐' },
  { name: '咖喱饭', category: '其他' },
];
