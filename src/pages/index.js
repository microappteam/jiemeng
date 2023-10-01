import { useState, useEffect } from 'react';

import { Layout, ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import StyledComponentsRegistry from './component';
import { useSession } from 'next-auth/react';

const utf8Decoder = new TextDecoder('utf-8');

export default function Home() {
  const [dream, setDream] = useState('');
  const [responseText, setResponseText] = useState('');
  const [weatherText, setWeatherText] = useState('');

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
    setResponseText('');
    setWeatherText('');
    try {
      await fetch('/api/weather', {
        method: 'GET',
      })
        .then((response) => {
          if (response.status !== 200) return;
          const reader = response.body.getReader();

          return reader.read().then(function process({ done, value: chunk }) {
            if (done) {
              console.log('Stream finished');
              return;
            }
            const decodedChunk = new TextDecoder().decode(chunk);
            setWeatherText((prevWeatherText) => prevWeatherText + decodedChunk);
            console.log('Received data chunk', decodedChunk);

            return reader.read().then(process);
          });
        })
        .catch(console.error);

      console.log('weather=' + weatherText);
      /* await fetch('/api/dream', {
        method: 'POST',
        body: JSON.stringify({ dream }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          // 如果不等于200，说明网络请求错了，不再继续
          if (response.status !== 200) return;
          // 获取 reader
          const reader = response.body.getReader();

          // 读取数据
          return reader.read().then(function process({ done, value: chunk }) {
            if (done) {
              console.log('Stream finished');
              return;
            }
            setResponseText((responseText) => {
              return responseText + utf8Decoder.decode(chunk, { stream: true });
            });
            console.log(
              'Received data chunk',
              utf8Decoder.decode(chunk, { stream: true }),
            );

            // 读取下一段数据
            return reader.read().then(process);
          });
        })
        .catch(console.error);
         const response2 = await axios.post(
        `/api/storage`,
        {
          dream,
          response: responseText,
          username: session?.user?.name,
        },
        { timeout: 10000 },
      );
      console.log('response2', response2.data);
*/
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
              response={responseText}
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
