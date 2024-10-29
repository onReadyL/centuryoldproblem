import { Card, List, Typography, Tag } from 'antd';
import { FoodItem } from '@/types/food';
import { ClockCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface HistoryListProps {
  history: FoodItem[];
}

export const HistoryList = ({ history }: HistoryListProps) => {
  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <ClockCircleOutlined className="text-blue-400" />
          <Title level={4} className="text-white !mb-0">
            历史记录
          </Title>
        </div>
      }
      className="w-full lg:w-auto lg:min-w-[350px] rounded-2xl backdrop-blur-xl bg-white/10 border-0 shadow-2xl mt-4 lg:mt-0 overflow-hidden"
      bordered={false}
      bodyStyle={{ maxHeight: '400px', overflowY: 'auto' }}
    >
      <div className="space-y-2">
        {history.length > 0 ? (
          history.map((food, index) => (
            <div
              key={index}
              className="relative group p-4 rounded-lg bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/20 transition-all duration-300 border border-white/10"
            >
              {/* 时间标签 */}
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center px-3 py-1 text-xs text-blue-300 bg-blue-500/20 rounded-full backdrop-blur-sm">
                  {index === 0 ? '昨天' : `${index + 1}天前`}
                </span>
                <Tag
                  color="blue"
                  className="m-0 backdrop-blur-sm border-0 bg-blue-500/20 text-blue-300"
                >
                  {food.category}
                </Tag>
              </div>

              {/* 菜品名称 */}
              <Text className="text-white/90 text-lg font-medium block">{food.name}</Text>

              {/* 装饰线条 */}
              <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-blue-500/50 to-purple-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="text-white/60 backdrop-blur-sm p-4 rounded-lg bg-white/5 border border-white/10">
              暂无历史记录
            </div>
          </div>
        )}
      </div>

      {/* 使用 CSS Modules 或 Tailwind 替代 jsx global */}
      <style>
        {`
          .ant-card-body::-webkit-scrollbar {
            width: 6px;
          }
          .ant-card-body::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
          }
          .ant-card-body::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 3px;
          }
          .ant-card-body::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.3);
          }
        `}
      </style>
    </Card>
  );
};
