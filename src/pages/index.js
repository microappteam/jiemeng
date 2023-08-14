const { useState, useEffect } = require('react');
const axios = require('axios');
const { Layout, ConfigProvider } = require('antd');
const zhCN = require('antd/lib/locale/zh_CN');
const StyledComponentsRegistry = require('./component');
const { createKysely, Kysely } = require('@vercel/postgres-kysely');

const kysely = createKysely({
  client: 'pg',
  connection: {
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

const db = createKysely(kysely);

function Home() {
  const [dream, setDream] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

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
      const response = await axios.post(
        '/api/dream',
        { dream },
        { timeout: 60000 },
      );

      await db.dream.insert({ dream }); // 插入梦境记录到数据库

      setResponse(response.data);
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
          height: 100vh;
          padding-top: 20px;
          overflow-y: auto;
        }
      `}</style>
    </Layout>
  );
}

module.exports = Home;
