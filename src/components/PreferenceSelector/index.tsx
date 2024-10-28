import { Select, Space } from 'antd';
import { CategoryManager } from '@/components/CategoryManager';
import { SimpleFoodItem, SimpleCategory } from '@/types/prisma';

interface PreferenceSelectorProps {
  value: string[];
  onChange: (values: string[]) => void;
  categories: SimpleCategory[];
  onCategoriesChange: (categories: SimpleCategory[]) => void;
  foods: SimpleFoodItem[];
}

export const PreferenceSelector = ({
  value,
  onChange,
  categories,
  onCategoriesChange,
  foods,
}: PreferenceSelectorProps) => {
  return (
    <div className="relative z-10 mb-6 md:mb-8 text-center px-4">
      <Space.Compact className="w-full max-w-[600px]">
        <Select
          mode="multiple"
          placeholder="选择偏好的菜系（可多选）"
          value={value}
          onChange={onChange}
          style={{ width: 'calc(100% - 120px)' }}
          options={categories.map(category => ({ label: category.name, value: category.id }))}
          className="backdrop-blur-md bg-white/10"
        />
        <CategoryManager
          categories={categories}
          onCategoriesChange={onCategoriesChange}
          foods={foods}
        />
      </Space.Compact>
    </div>
  );
};
