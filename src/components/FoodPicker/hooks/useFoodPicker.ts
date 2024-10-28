import { useState, useRef, useEffect } from 'react';
import { message } from 'antd';
import type { SimpleFoodItem, SimpleCategory } from '@/types/prisma';
import { getFoods, getCategories } from '@/services/foodService';

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

    const filteredFoods = foods.filter(food => food.category === newCategory);

    if (filteredFoods.length === 0) {
      messageApi.warning('没有符合偏好的菜品，将使用所有菜品');
      return;
    }

    intervalRef.current = setInterval(() => {
      const randomFood = filteredFoods[Math.floor(Math.random() * filteredFoods.length)];
      setCurrentFood(randomFood.name);
    }, 100);

    setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsRolling(false);

      let finalFood = filteredFoods[Math.floor(Math.random() * filteredFoods.length)];
      setCurrentFood(finalFood.name);
      localStorage.setItem('currentSelectedFood', JSON.stringify(finalFood));
    }, 3000);
  };

  const confirmTodayFood = () => {
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
      setTodayFood(foodItem);
      setLastPickDate(today);

      localStorage.setItem('todayFood', JSON.stringify(foodItem));
      localStorage.setItem('lastPickDate', today);

      messageApi.success('已确认今日美食！');
    } catch (error) {
      console.error('Error confirming food:', error);
      messageApi.error('保存选择失败，请重试');
    }
  };

  const handleAddFood = () => {
    if (!newFood.trim()) {
      messageApi.warning('请输入菜品名称');
      return;
    }

    if (foods.some(food => food.name === newFood.trim())) {
      messageApi.warning('该菜品已存在');
      return;
    }

    try {
      const newFoodItem: SimpleFoodItem = {
        name: newFood.trim(),
        category: newCategory,
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

  // 添加分类管理函数
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
