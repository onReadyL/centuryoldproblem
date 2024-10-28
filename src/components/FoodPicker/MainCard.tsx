import { Card, Button, Typography, Alert, Space, Tag } from 'antd';
import { FoodItem } from '@/types/food';
import { SettingOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface MainCardProps {
  currentFood: string;
  isRolling: boolean;
  todayFood: FoodItem | null;
  canPick: boolean;
  onStartRolling: () => void;
  onConfirm: () => void;
  onManageFood: () => void;
  onAddFood: () => void;
}

export const MainCard = ({
  currentFood,
  isRolling,
  todayFood,
  canPick,
  onStartRolling,
  onConfirm,
  onManageFood,
}: MainCardProps) => {
  return (
    <Card
      className="w-full lg:w-auto lg:min-w-[450px] rounded-2xl backdrop-blur-xl bg-white/10 border-0 shadow-2xl"
      bordered={false}
    >
      <div className="text-center mb-6 md:mb-8 p-6 md:p-8 bg-gradient-to-br from-white/5 to-white/10 rounded-xl backdrop-blur-md border border-white/10">
        <Title
          level={2}
          className={`text-3xl md:text-4xl font-bold mb-6 text-white ${
            isRolling ? 'animate-shake' : ''
          }`}
        >
          {currentFood || '点击开始'}
        </Title>
        {todayFood && (
          <Alert
            message={
              <Space>
                <span className="text-white">今日已选：{todayFood.name}</span>
                <Tag color="blue" className="backdrop-blur-sm">
                  {todayFood.category}
                </Tag>
              </Space>
            }
            type="success"
            showIcon
            className="rounded-lg border-0 bg-white/20 backdrop-blur-md"
          />
        )}
      </div>
      <Space className="flex flex-wrap justify-center gap-4" size="middle">
        <Button
          type="primary"
          size="large"
          onClick={onStartRolling}
          disabled={isRolling || !canPick}
          loading={isRolling}
          className="min-w-[120px] h-12 px-8 text-lg rounded-full bg-gradient-to-r from-blue-500 to-blue-600 border-0 hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
        >
          {isRolling ? '选择中...' : '开始选择'}
        </Button>
        <Button
          type="default"
          size="large"
          onClick={onConfirm}
          disabled={isRolling || !canPick || currentFood === '点击开始'}
          className="min-w-[120px] h-12 px-8 text-lg rounded-full border border-white/20 backdrop-blur-md hover:border-white/40 transition-all duration-300"
        >
          确定
        </Button>
        <Button
          type="dashed"
          size="large"
          onClick={onManageFood}
          className="min-w-[120px] h-12 px-8 text-lg rounded-full border border-blue-500/50 hover:border-blue-500 transition-all duration-300"
          icon={<SettingOutlined />}
        >
          管理菜品
        </Button>
      </Space>
      {!canPick && (
        <Alert
          message="今天已经选择过啦，明天再来吧！"
          type="warning"
          showIcon
          className="mt-6 rounded-lg border-0 bg-yellow-500/20 backdrop-blur-md"
        />
      )}
    </Card>
  );
};
