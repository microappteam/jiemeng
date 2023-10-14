import { useState, useEffect } from 'react';
import { Layout, ConfigProvider, Drawer, Table, Button } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import zhCN from 'antd/lib/locale/zh_CN';
import StyledComponentsRegistry from './component';
import { useSession } from 'next-auth/react';
import { preProcessFile } from 'typescript';

const utf8Decoder = new TextDecoder('utf-8');

const params = {
  pageSize: 10,
  current: 1,
};
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
          if (response.status !== 200) return;
          const reader = response.body.getReader();

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

  const handleDelete = (index) => {
    const newDreamHistory = [...dreamHistory];
    newDreamHistory.splice(index, 1);
    setDreamHistory(newDreamHistory);
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
                width={1200}
              >
                <ProTable
                  params={params}
                  request={async (
                    // 第一个参数 params 查询表单和 params 参数的结合
                    // 第一个参数中一定会有 pageSize 和  current ，这两个参数是 antd 的规范
                    params,
                  ) => {
                    // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
                    // 如果需要转化参数可以在这里进行修改
                    const msg = await fetch('/api/storage', { method: 'GET' });
                    return {
                      data: msg,
                      // success 请返回 true，
                      // 不然 table 会停止解析数据，即使有数据
                      success: true,
                      // 不传会使用 data 的长度，如果是分页一定要传
                      //total: number,
                    };
                  }}
                  columns={[
                    {
                      title: '梦境',
                      dataIndex: 'dream',
                      key: 'dream',
                    },
                    {
                      title: '解梦结果',
                      dataIndex: 'response',
                      key: 'response',
                    },
                    {
                      title: '操作',
                      valueType: 'option',
                      render: (_, record, index, action) => [
                        <a key="delete" onClick={() => handleDelete(index)}>
                          删除
                        </a>,
                      ],
                    },
                  ]}
                  dataSource={dreamHistory}
                  rowKey="dream"
                />
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
