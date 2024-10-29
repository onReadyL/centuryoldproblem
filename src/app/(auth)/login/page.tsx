'use client';

import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import Link from 'next/link';
import { useUser } from '@/contexts/UserContext';

export default function Login() {
  const [loading, setLoading] = useState(false);

  const { login } = useUser();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      message.success('登录成功！');
      // login 函数内部已经包含了重定向逻辑,这里不需要重复
    } catch (error) {
      message.error(error instanceof Error ? error.message : '登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl">
        <h1 className="text-2xl font-bold text-center text-white mb-8">登录</h1>
        <Form name="login" onFinish={onFinish} layout="vertical">
          <Form.Item
            label={<span className="text-white">邮箱</span>}
            name="email"
            rules={[{ required: true, message: '请输入邮箱' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={<span className="text-white">密码</span>}
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登录
            </Button>
          </Form.Item>

          <div className="text-center text-white">
            还没有账号？{' '}
            <Link href="/register" className="text-blue-400 hover:text-blue-300">
              立即注册
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}
