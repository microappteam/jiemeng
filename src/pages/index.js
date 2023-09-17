import { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import StyledComponentsRegistry from './component';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function Home() {
  const [dream, setDream] = useState('');
  const [response, setResponse] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const loadingTexts = [
    'Loading...',
    '正在询问周公...',
    '正在翻阅梦书...',
    '好运正在路上...',
    'Loading 101% ...',
    '慢工出细活，久久方为功...',
    '周公正在解读梦境，请稍候...',
    '加载中，请稍候...',
    '卖力加载中...',
    'O.o ...',
    '马上就要写完咯...',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const eventSource = new EventSource('/api/dream');
      eventSource.onmessage = (event) => {
        const responseData = event.data;
        // 处理接收到的数据，例如将数据添加到一个数组中
        // 或者更新显示在页面上的内容
        console.log(responseData);
      };

      eventSource.onerror = (error) => {
        console.error(error);
        setIsLoading(false);
        eventSource.close();
      };

      setTimeout(() => {
        eventSource.close();
        setIsLoading(false);
      }, 10000);
      console.log(response.data);
      const response2 = await axios.post(
        `/api/storage`,
        {
          dream,
          response: response.data,
          username: session?.user?.name,
        },
        { timeout: 10000 },
      );
      console.log('response2', response2.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <ConfigProvider locale={zhCN}>
        <div className="container">
          {isHydrated && (
            <StyledComponentsRegistry
              dream={dream}
              setDream={setDream}
              handleSubmit={handleSubmit}
              response={response}
              isLoading={isLoading}
              loadingTexts={loadingTexts}
            />
          )}
        </div>
      </ConfigProvider>

      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          background-color: #fffbe9;
          padding-top: 20px;
          overflow-y: auto;
          height: 100vh;
        }
      `}</style>
    </Layout>
  );
}
