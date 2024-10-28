'use client';

import React, { useState } from 'react';
import { Typography } from 'antd';
import { DEFAULT_FOODS } from '@/types/food';
import { Background } from './Background';
import { MainCard } from './MainCard';
import { PreferenceSelector } from '@/components/PreferenceSelector';
import { AddFoodModal } from '@/components/AddFoodModal';
import { HistoryList } from '@/components/HistoryList';
import { useFoodPicker } from './hooks/useFoodPicker';
import { FoodManager } from '@/components/FoodManager';
import { FoodItem } from '@/types/food'; // Added import for FoodItem

const { Title } = Typography;

const FoodPicker: React.FC = () => {
  const {
    currentFood,
    isRolling,
    todayFood,
    lastPickDate,
    isModalOpen,
    newFood,
    newCategory,
    preferredCategories,
    history,
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
    foods,
    setFoods,
  } = useFoodPicker();

  const today = new Date().toLocaleDateString();
  const canPick = lastPickDate !== today;

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewFood('');
    setNewCategory(categories[0]);
  };

  const handleAddFoodClick = () => {
    setIsModalOpen(true);
  };

  const [isManagerOpen, setIsManagerOpen] = useState(false);

  return (
    <div className="min-h-screen p-4 md:p-8 relative bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden">
      {contextHolder}
      <Background />

      <Title className="text-center text-white mb-8 md:mb-12 relative z-10 drop-shadow-lg">
        今天吃什么？
      </Title>

      <PreferenceSelector
        value={preferredCategories}
        onChange={handlePreferenceChange}
        categories={categories.map(category => category.name)} // 将 Category 转换为 string[]
        onCategoriesChange={handleCategoriesChange}
        foods={foods}
      />

      <div className="relative z-10 flex flex-col lg:flex-row justify-center items-start gap-4 md:gap-8 w-full mt-4 md:mt-8 px-4">
        <MainCard
          currentFood={currentFood}
          isRolling={isRolling}
          todayFood={todayFood as FoodItem | null} // 强制转换类型
          canPick={canPick}
          onStartRolling={startRolling}
          onConfirm={confirmTodayFood}
          onAddFood={handleAddFoodClick}
          onManageFood={() => setIsManagerOpen(true)}
        />

        <HistoryList history={history} />
      </div>

      <AddFoodModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onAdd={handleAddFood}
        foodName={newFood}
        onFoodNameChange={setNewFood}
        category={newCategory}
        onCategoryChange={setNewCategory}
        categories={categories}
      />

      <FoodManager
        isOpen={isManagerOpen}
        onClose={() => setIsManagerOpen(false)}
        foods={foods}
        onFoodsChange={setFoods}
        categories={categories}
        onCategoriesChange={handleCategoriesChange}
      />
    </div>
  );
};

export default FoodPicker;
