import { useState, useEffect } from 'react';
import { Layout, ConfigProvider, Drawer } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import StyledComponentsRegistry from './component';
import { useSession } from 'next-auth/react';
import { preProcessFile } from 'typescript';

const utf8Decoder = new TextDecoder('utf-8');

export default function Home() {
  const [dream, setDream] = useState('');
  const [responseText, setResponseText] = useState('');
  const [weatherText, setWeatherText] = useState();
  const [futureWeatherText, setFutureWeatherText] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const { data: session } = useSession();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [dreamHistory, setDreamHistory] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isArrowRight, setIsArrowRight] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
    const fetchData = async () => {
      try {
        const response = await fetch('/api/weather', {
          method: 'GET',
        });
        if (response.status !== 200) return;
        const reader = response.body.getReader();

        const process = ({ done, value: chunk }) => {
          if (done) {
            console.log('Stream finished');
            return;
          }
          const decodedChunk = new TextDecoder().decode(chunk);
          setFutureWeatherText(decodedChunk);
          if (
            decodedChunk.startsWith(
              '{"status":"1","count":"1","info":"OK","infocode":"10000","lives":[{"province"',
            )
          ) {
            setWeatherText(decodedChunk);
          }
          console.log('Received data chunk', decodedChunk);

          return reader.read().then(process);
        };

        await process(await reader.read());
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
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
    let tempText = '';

    try {
      await fetch('/api/dream', {
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

            tempText += utf8Decoder.decode(chunk, { stream: true });
            console.log(
              'Received data chunk',
              utf8Decoder.decode(chunk, { stream: true }),
            );

            // 读取下一段数据
            return reader.read().then(process);
          });
        })
        .catch(console.error);

      setDreamHistory((dreamHistory) => [
        ...dreamHistory,
        { dream, response: tempText },
      ]);
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
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const showDrawer = () => {
    setIsDrawerVisible(true);
  };

  const closeDrawer = () => {
    setIsDrawerVisible(false);
  };

  return (
    <Layout style={{ backgroundColor: '#fffbe9' }}>
      <ConfigProvider locale={zhCN}>
        <div className="container">
          {isHydrated && (
            <>
              <Drawer
                title="解梦记录"
                placement="right"
                closable={false}
                onClose={closeDrawer}
                visible={isDrawerVisible}
              >
                <ul>
                  {dreamHistory.map((item, index) => (
                    <li key={index}>
                      <strong>梦境：</strong> {item.dream}
                      <br />
                      <strong>解梦结果：</strong> {item.response}
                    </li>
                  ))}
                </ul>
              </Drawer>

              <StyledComponentsRegistry
                dream={dream}
                setDream={setDream}
                handleSubmit={handleSubmit}
                response={responseText}
                isLoading={isLoading}
                loadingTexts={loadingTexts}
                weatherText={weatherText}
                futureWeatherText={futureWeatherText}
              />

              <button className="history-button" onClick={showDrawer}>
                历史
              </button>
            </>
          )}
        </div>
      </ConfigProvider>

      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          background-color: #fffbe9;
          overflow-y: auto;
          height: 100vh;
        }
        .history-button {
          position: absolute;
          top: 10px;
          right: 240px;
          height: 40px;
          padding: 10px 20px;
          background-color: rgba(255, 255, 255, 0.6);
          color: rgba(0, 0, 0, 0.75);
          border: none;
          border-radius: 4px;
          cursor: pointer;

          transition: background-color 0.3s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .history-button:hover {
          background-color: #e0e0e0;
        }
      `}</style>
    </Layout>
  );
}
