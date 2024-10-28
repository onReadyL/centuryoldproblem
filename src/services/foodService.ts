import type { Food, Category } from '@/types/prisma';

export async function getFoods(): Promise<Food[]> {
  const response = await fetch('/api/foods');
  if (!response.ok) throw new Error('Failed to fetch foods');
  return response.json();
}

export async function createFood(name: string, categoryId: string): Promise<Food> {
  const response = await fetch('/api/foods', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, categoryId }),
  });
  if (!response.ok) throw new Error('Failed to create food');
  return response.json();
}

export async function getCategories(): Promise<Category[]> {
  const response = await fetch('/api/categories');
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
}

export async function createCategory(name: string): Promise<Category> {
  const response = await fetch('/api/categories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) throw new Error('Failed to create category');
  return response.json();
}
