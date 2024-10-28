'use client';

import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: { email: string; password: string; name?: string }) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      message.success('注册成功！请登录');
      router.push('/login');
    } catch (error) {
      message.error(error instanceof Error ? error.message : '注册失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl">
        <h1 className="text-2xl font-bold text-center text-white mb-8">注册账号</h1>
        <Form name="register" onFinish={onFinish} layout="vertical">
          <Form.Item
            label={<span className="text-white">邮箱</span>}
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={<span className="text-white">密码</span>}
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码长度至少为6位' },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label={<span className="text-white">确认密码</span>}
            name="confirm"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item label={<span className="text-white">昵称</span>} name="name">
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              注册
            </Button>
          </Form.Item>

          <div className="text-center text-white">
            已有账号？{' '}
            <Link href="/login" className="text-blue-400 hover:text-blue-300">
              立即登录
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}
