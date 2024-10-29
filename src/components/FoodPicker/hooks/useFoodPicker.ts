import { useState, useRef, useEffect } from 'react';
import { message } from 'antd';
import type { SimpleFoodItem, SimpleCategory } from '@/types/prisma';
import { getFoods, getCategories, createHistory } from '@/services/foodService';

export const useFoodPicker = () => {
  const [currentFood, setCurrentFood] = useState<string>('点击开始');
  const [isRolling, setIsRolling] = useState(false);
  const [todayFood, setTodayFood] = useState<SimpleFoodItem | null>(null);
  const [lastPickDate, setLastPickDate] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFood, setNewFood] = useState('');
  const [newCategory, setNewCategory] = useState<SimpleCategory | null>(null);
  const [preferredCategories, setPreferredCategories] = useState<string[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const [foods, setFoods] = useState<SimpleFoodItem[]>([]);
  const [categories, setCategories] = useState<SimpleCategory[]>([]);
  const [history, setHistory] = useState<SimpleFoodItem[]>([]);

  // 加载数据
  useEffect(() => {
    const loadData = async () => {
      try {
        const [foodsData, categoriesData] = await Promise.all([getFoods(), getCategories()]);
        setFoods(foodsData);
        setCategories(categoriesData);
        if (categoriesData.length > 0) {
          setNewCategory(categoriesData[0]);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
        messageApi.error('加载数据失败');
      }
    };
    loadData();
  }, []);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startRolling = () => {
    if (isRolling) return;

    setIsRolling(true);
    setTodayFood(null);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    let availableFoods =
      preferredCategories.length > 0
        ? foods.filter(food => preferredCategories.includes(food.categoryId))
        : foods;

    if (availableFoods.length === 0) {
      messageApi.warning('没有符合偏好的菜品，将使用所有菜品');
      availableFoods = foods;
    }

    intervalRef.current = setInterval(() => {
      const randomFood = availableFoods[Math.floor(Math.random() * availableFoods.length)];
      setCurrentFood(randomFood.name);
    }, 100);

    setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsRolling(false);

      const finalFood = availableFoods[Math.floor(Math.random() * availableFoods.length)];
      setCurrentFood(finalFood.name);
      localStorage.setItem('currentSelectedFood', JSON.stringify(finalFood));
    }, 3000);
  };

  const confirmTodayFood = async () => {
    const today = new Date().toLocaleDateString();

    if (lastPickDate === today) {
      messageApi.warning('今天已经选择过了哦！');
      return;
    }

    try {
      const currentSelectedFood = localStorage.getItem('currentSelectedFood');
      if (!currentSelectedFood) {
        messageApi.error('未找到当前选择的菜品信息');
        return;
      }

      const foodItem: SimpleFoodItem = JSON.parse(currentSelectedFood);
      await createHistory(foodItem.id);
      setTodayFood(foodItem);
      setHistory(prev => [foodItem, ...prev].slice(0, 7));
      setLastPickDate(today);

      messageApi.success('已确认今日美食！');
    } catch (error) {
      console.error('Error confirming food:', error);
      messageApi.error('保存选择失败，请重试');
    }
  };

  const handleAddFood = async () => {
    if (!newFood.trim() || !newCategory) {
      messageApi.warning('请输入菜品名称和选择分类');
      return;
    }

    if (foods.some(food => food.name === newFood.trim())) {
      messageApi.warning('该菜品已存在');
      return;
    }

    try {
      const newFoodItem: SimpleFoodItem = {
        id: '', // 这个ID会由服务器生成
        name: newFood.trim(),
        categoryId: newCategory.id,
        category: newCategory.name,
      };
      setFoods(prev => [...prev, newFoodItem]);
      messageApi.success('添加成功！');
      setNewFood('');
      setNewCategory(categories[0]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving custom foods:', error);
      messageApi.error('保存失败，请重试');
    }
  };

  const handlePreferenceChange = (values: string[]) => {
    setPreferredCategories(values);
  };

  const handleCategoriesChange = async (newCategories: SimpleCategory[]) => {
    try {
      setCategories(newCategories);
      // 更新相关菜品的分类
      const updatedFoods = foods.map(food => ({
        ...food,
        categoryId: newCategories.some(c => c.id === food.categoryId)
          ? food.categoryId
          : newCategories[0]?.id || food.categoryId,
      }));
      setFoods(updatedFoods);
    } catch (error) {
      console.error('Error updating categories:', error);
      messageApi.error('更新分类失败');
    }
  };

  return {
    currentFood,
    isRolling,
    todayFood,
    lastPickDate,
    isModalOpen,
    newFood,
    newCategory,
    foods,
    setFoods,
    preferredCategories,
    history,
    messageApi,
    contextHolder,
    setIsModalOpen,
    setNewFood,
    setNewCategory,
    startRolling,
    confirmTodayFood,
    handleAddFood,
    handlePreferenceChange,
    categories,
    handleCategoriesChange,
  };
};
