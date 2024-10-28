import { FoodItem } from '@/types/food';

export const getRandomFood = (foods: FoodItem[], excludeNames: string[] = []): FoodItem => {
  const availableFoods = foods.filter(food => !excludeNames.includes(food.name));
  return availableFoods[Math.floor(Math.random() * availableFoods.length)];
};

export const getFilteredFoods = (foods: FoodItem[], categories: string[]): FoodItem[] => {
  if (categories.length === 0) return foods;
  return foods.filter(food => categories.includes(food.category));
};
