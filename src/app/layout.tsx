import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ConfigProvider } from 'antd';
import { Providers } from '@/components/Providers';
import './globals.css';
import { UserProvider } from '@/contexts/UserContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '今天吃什么',
  description: '随机选择今天的美食',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        <Providers>
          <UserProvider>
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: '#1677ff',
                  borderRadius: 8,
                  fontFamily: inter.style.fontFamily,
                },
              }}
            >
              {children}
            </ConfigProvider>
          </UserProvider>
        </Providers>
      </body>
    </html>
  );
}
