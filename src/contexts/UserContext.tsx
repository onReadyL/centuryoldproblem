'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spin } from 'antd';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  // 检查用户的认证状态
  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // 如果未登录且不在登录或注册页面，则重定向到登录页
        const currentPath = window.location.pathname;
        if (!['/login', '/register'].includes(currentPath)) {
          router.push('/login');
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // 用户登录函数
  // 发送登录请求并处理响应
  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error);
    }

    const userData = await response.json();
    setUser(userData);
    router.push('/');
    router.refresh(); // 强制刷新页面以确保状态更新
  };

  // 用户登出函数
  // 发送登出请求并重置用户状态
  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/login');
    router.refresh(); // 强制刷新页面以确保状态更新
  };

  if (loading) {
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <Spin tip="加载中..." /> {/* 使用一个加载动画组件 */}
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ user, loading, login, logout }}>{children}</UserContext.Provider>
  );
}

// 自定义 Hook，用于获取用户上下文
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
