import { useState } from 'react';
import { Button, Modal, Input, List, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

interface CategoryManagerProps {
  categories: string[];
  onCategoriesChange: (categories: string[]) => void;
  foods: Array<{ name: string; category: string }>;
}

export const CategoryManager = ({
  categories,
  onCategoriesChange,
  foods,
}: CategoryManagerProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<{ index: number; value: string } | null>(
    null
  );

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      message.warning('请输入分类名称');
      return;
    }

    if (categories.includes(newCategory.trim())) {
      message.warning('该分类已存在');
      return;
    }

    onCategoriesChange([...categories, newCategory.trim()]);
    setNewCategory('');
    message.success('添加成功');
  };

  const handleEditCategory = (index: number, oldValue: string, newValue: string) => {
    if (!newValue.trim()) {
      message.warning('分类名称不能为空');
      return;
    }

    if (categories.includes(newValue.trim()) && newValue.trim() !== oldValue) {
      message.warning('该分类已存在');
      return;
    }

    const newCategories = [...categories];
    newCategories[index] = newValue.trim();
    onCategoriesChange(newCategories);
    setEditingCategory(null);
    message.success('修改成功');
  };

  const handleDeleteCategory = (category: string) => {
    // 检查是否有菜品使用此分类
    const inUse = foods.some(food => food.category === category);
    if (inUse) {
      message.error('该分类下还有菜品，无法删除');
      return;
    }

    const newCategories = categories.filter(c => c !== category);
    onCategoriesChange(newCategories);
    message.success('删除成功');
  };

  return (
    <>
      <Button
        type="dashed"
        onClick={() => setIsModalOpen(true)}
        icon={<EditOutlined />}
        className="backdrop-blur-md bg-white/10"
      >
        管理分类
      </Button>

      <Modal
        title="管理菜品分类"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
          setNewCategory('');
        }}
        footer={null}
      >
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="输入新分类名称"
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              onPressEnter={handleAddCategory}
            />
            <Button type="primary" onClick={handleAddCategory} icon={<PlusOutlined />}>
              添加
            </Button>
          </div>

          <List
            dataSource={categories}
            renderItem={(category, index) => (
              <List.Item
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                key={category}
              >
                {editingCategory?.index === index ? (
                  <Input
                    value={editingCategory.value}
                    onChange={e => setEditingCategory({ index, value: e.target.value })}
                    onPressEnter={() => handleEditCategory(index, category, editingCategory.value)}
                    onBlur={() => setEditingCategory(null)}
                    autoFocus
                  />
                ) : (
                  <span>{category}</span>
                )}
                <div className="space-x-2">
                  <Button
                    type="text"
                    onClick={() => setEditingCategory({ index, value: category })}
                    icon={<EditOutlined />}
                  />
                  <Popconfirm
                    title="确定删除此分类吗？"
                    description="删除后无法恢复"
                    onConfirm={() => handleDeleteCategory(category)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button type="text" danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </div>
              </List.Item>
            )}
          />
        </div>
      </Modal>
    </>
  );
};
