import React, { useState } from 'react';
import { Modal, Table, Button, Space, Input, Select, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { SimpleFoodItem, SimpleCategory } from '@/types/prisma';
import { CategoryManager } from '@/components/CategoryManager';

interface FoodManagerProps {
  isOpen: boolean;
  onClose: () => void;
  foods: SimpleFoodItem[];
  onFoodsChange: (foods: SimpleFoodItem[]) => void;
  categories: SimpleCategory[];
  onCategoriesChange: (categories: SimpleCategory[]) => void;
}

interface EditingFood {
  index: number;
  food: SimpleFoodItem;
}

export const FoodManager: React.FC<FoodManagerProps> = ({
  isOpen,
  onClose,
  foods,
  onFoodsChange,
  categories,
  onCategoriesChange,
}) => {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [editingFood, setEditingFood] = useState<EditingFood | null>(null);
  const [newFood, setNewFood] = useState<SimpleFoodItem>({
    name: '',
    category: categories[0].name,
  });
  const [isAddMode, setIsAddMode] = useState(false);

  const filteredFoods = foods.filter(
    food =>
      food.name.toLowerCase().includes(searchText.toLowerCase()) &&
      (!selectedCategory || food.category === selectedCategory)
  );

  const handleEdit = (index: number, food: SimpleFoodItem) => {
    setEditingFood({ index, food: { ...food } });
  };

  const handleSaveEdit = () => {
    if (!editingFood) return;

    if (!editingFood.food.name.trim()) {
      message.warning('菜品名称不能为空');
      return;
    }

    const nameExists = foods.some(
      (food, idx) => idx !== editingFood.index && food.name === editingFood.food.name.trim()
    );
    if (nameExists) {
      message.warning('该菜品名称已存在');
      return;
    }

    const newFoods = [...foods];
    newFoods[editingFood.index] = {
      ...editingFood.food,
      name: editingFood.food.name.trim(),
    };
    onFoodsChange(newFoods);
    setEditingFood(null);
    message.success('修改成功');
  };

  const handleDelete = (foodToDelete: SimpleFoodItem) => {
    const newFoods = foods.filter(food => food.name !== foodToDelete.name);
    onFoodsChange(newFoods);
    message.success('删除成功');

    // 检查分类是否还有其他菜品
    const categoryHasOtherFoods = newFoods.some(food => food.category === foodToDelete.category);
    if (!categoryHasOtherFoods) {
      const shouldDeleteCategory = window.confirm(
        `${foodToDelete.category}分类下已没有菜品，是否删除该分类？`
      );
      if (shouldDeleteCategory) {
        const newCategories = categories.filter(c => c !== foodToDelete.category);
        onCategoriesChange(newCategories);
        message.success('分类已删除');
      }
    }
  };

  const handleAdd = () => {
    if (!newFood.name.trim()) {
      message.warning('菜品名称不能为空');
      return;
    }

    if (foods.some(food => food.name === newFood.name.trim())) {
      message.warning('该菜品已存在');
      return;
    }

    onFoodsChange([...foods, { ...newFood, name: newFood.name.trim() }]);
    setNewFood({ name: '', category: categories[0] });
    setIsAddMode(false);
    message.success('添加成功');
  };

  const columns = [
    {
      title: '菜品名称',
      dataIndex: 'name',
      key: 'name',
      render: (_: string, record: SimpleFoodItem, index: number) =>
        editingFood?.index === index ? (
          <Input
            value={editingFood.food.name}
            onChange={e =>
              setEditingFood({ index, food: { ...editingFood.food, name: e.target.value } })
            }
            onPressEnter={handleSaveEdit}
          />
        ) : (
          record.name
        ),
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (_: string, record: SimpleFoodItem, index: number) =>
        editingFood?.index === index ? (
          <Select
            value={editingFood.food.category}
            onChange={value =>
              setEditingFood({ index, food: { ...editingFood.food, category: value } })
            }
            style={{ width: 120 }}
          >
            {categories.map(category => (
              <Select.Option key={category} value={category}>
                {category}
              </Select.Option>
            ))}
          </Select>
        ) : (
          record.category
        ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: SimpleFoodItem, index: number) =>
        editingFood?.index === index ? (
          <Space>
            <Button type="primary" size="small" onClick={handleSaveEdit}>
              保存
            </Button>
            <Button size="small" onClick={() => setEditingFood(null)}>
              取消
            </Button>
          </Space>
        ) : (
          <Space>
            <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(index, record)} />
            <Popconfirm
              title="确定删除此菜品吗？"
              onConfirm={() => handleDelete(record)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        ),
    },
  ];

  return (
    <Modal title="管理菜品" open={isOpen} onCancel={onClose} width={800} footer={null}>
      <Space direction="vertical" className="w-full">
        <Space className="w-full justify-between">
          <Space>
            <Input.Search
              placeholder="搜索菜品"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
            <Select
              placeholder="选择分类"
              value={selectedCategory}
              onChange={setSelectedCategory}
              style={{ width: 120 }}
              allowClear
            >
              {categories.map(category => (
                <Select.Option key={category} value={category}>
                  {category}
                </Select.Option>
              ))}
            </Select>
          </Space>
          <Space>
            <CategoryManager
              categories={categories}
              onCategoriesChange={onCategoriesChange}
              foods={foods}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddMode(true)}>
              添加菜品
            </Button>
          </Space>
        </Space>

        {isAddMode && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <Space className="w-full">
              <Input
                placeholder="菜品名称"
                value={newFood.name}
                onChange={e => setNewFood({ ...newFood, name: e.target.value })}
                style={{ width: 200 }}
              />
              <Select
                value={newFood.category}
                onChange={value => setNewFood({ ...newFood, category: value })}
                style={{ width: 120 }}
              >
                {categories.map(category => (
                  <Select.Option key={category} value={category}>
                    {category}
                  </Select.Option>
                ))}
              </Select>
              <Button type="primary" onClick={handleAdd}>
                添加
              </Button>
              <Button onClick={() => setIsAddMode(false)}>取消</Button>
            </Space>
          </div>
        )}

        <Table
          columns={columns}
          dataSource={filteredFoods}
          rowKey="name"
          pagination={{ pageSize: 10 }}
        />
      </Space>
    </Modal>
  );
};
