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
      const eventSource = new EventSource('/api/dream'); // 创建EventSource对象，指向服务器端的事件流

      eventSource.onmessage = (event) => {
        const formattedContent = event.data.replace(/\\n/g, '\n'); // 替换转义字符为实际换行符
        setResponse((prevResponse) => prevResponse + formattedContent); // 逐步追加响应内容
      };

      eventSource.onerror = (error) => {
        console.error(error);
        eventSource.close(); // 出现错误时关闭事件流
        setIsLoading(false);
      };

      const response = await axios.post('/api/dream', { dream }); // 触发后端的事件流

      eventSource.close(); // 请求完成后关闭事件流
      setIsLoading(false);
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
