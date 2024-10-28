import type { Food, Category, SimpleFoodItem, SimpleCategory } from '@/types/prisma';

export async function getFoods(): Promise<SimpleFoodItem[]> {
  const response = await fetch('/api/foods');
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch foods');
  }
  const foods: Food[] = await response.json();
  return foods.map(food => ({
    id: food.id,
    name: food.name,
    categoryId: food.categoryId,
    category: food.category?.name || '',
  }));
}

export async function createFood(name: string, categoryId: string): Promise<SimpleFoodItem> {
  const response = await fetch('/api/foods', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, categoryId }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create food');
  }
  const food: Food = await response.json();
  return {
    id: food.id,
    name: food.name,
    categoryId: food.categoryId,
    category: food.category?.name || '',
  };
}

export async function getCategories(): Promise<SimpleCategory[]> {
  const response = await fetch('/api/categories');
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch categories');
  }
  const categories: Category[] = await response.json();
  return categories.map(category => ({
    id: category.id,
    name: category.name,
  }));
}

export async function createCategory(name: string): Promise<SimpleCategory> {
  const response = await fetch('/api/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create category');
  }
  const category: Category = await response.json();
  return {
    id: category.id,
    name: category.name,
  };
}

export async function getHistory(): Promise<SimpleFoodItem[]> {
  const response = await fetch('/api/history');
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch history');
  }
  const history = await response.json();
  return history.map((item: any) => ({
    id: item.food.id,
    name: item.food.name,
    categoryId: item.food.categoryId,
    category: item.food.category?.name || '',
  }));
}

export async function createHistory(foodId: string): Promise<void> {
  const response = await fetch('/api/history', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ foodId }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create history');
  }
}

export async function updateFood(
  id: string,
  data: Partial<SimpleFoodItem>
): Promise<SimpleFoodItem> {
  const response = await fetch(`/api/foods/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update food');
  }
  const food: Food = await response.json();
  return {
    id: food.id,
    name: food.name,
    categoryId: food.categoryId,
    category: food.category?.name || '',
  };
}

export async function deleteFood(id: string): Promise<void> {
  const response = await fetch(`/api/foods/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete food');
  }
}
