import { Modal, Space, Input, Select } from 'antd';
import { CATEGORIES } from '@/types/food';

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: () => void;
  foodName: string;
  onFoodNameChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  categories?: string[]; // 添加可选的 categories prop
}

export const AddFoodModal = ({
  isOpen,
  onClose,
  onAdd,
  foodName,
  onFoodNameChange,
  category,
  onCategoryChange,
  categories = CATEGORIES, // 使用默认值
}: AddFoodModalProps) => {
  return (
    <Modal
      title="添加新菜品"
      open={isOpen}
      onOk={onAdd}
      onCancel={onClose}
      okText="添加"
      cancelText="取消"
      className="backdrop-blur-2xl"
      styles={{
        content: {
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
        },
      }}
    >
      <Space direction="vertical" className="w-full mt-4">
        <Input
          placeholder="请输入菜品名称"
          value={foodName}
          onChange={e => onFoodNameChange(e.target.value)}
          onPressEnter={onAdd}
          className="rounded-lg"
        />
        <Select
          value={category}
          onChange={onCategoryChange}
          style={{ width: '100%' }}
          options={categories.map(category => ({ label: category, value: category }))}
          className="rounded-lg"
        />
      </Space>
    </Modal>
  );
};
