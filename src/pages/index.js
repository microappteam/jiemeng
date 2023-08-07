import { useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import { Layout, ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import StyledComponentsRegistry from './component';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Home() {
  const [dream, setDream] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      setResponse(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const Component = () => {
    const { data: session } = useSession();

    if (session) {
      return (
        <>
          Signed in as {session.user.email} <br />
          <button onClick={() => signOut()}>Sign out</button>
        </>
      );
    }

    return (
      <>
        Not signed in <br />
        <button onClick={() => signIn()}>Sign in</button>
      </>
    );
  };

  return (
    <Layout>
      <ConfigProvider locale={zhCN}>
        <div className="container">
          <Head>
            <title>周公解梦</title>
            <link rel="icon" href="/logo.png" />
            <meta property="og:title" content="周公解梦" />
            <meta property="twitter:image" content="/logo.png" />
            <meta property="og:image" content="/logo.png" />
            <meta property="twitter:title" content="周公解梦" />
            <meta property="twitter:card" content="summary" />
            <meta
              property="twitter:description"
              content="周公解梦是一种将梦境解读为暗示和预兆的传统文化实践。在中国古代，人们相信梦境可以透露出隐藏的信息或未来事件。因此，他们会寻求有经验的解梦师（如周公）来帮助理解和分析自己的梦境。"
            />
            <meta property="og:url" content="https://jiemeng.chenshuai.dev" />
            <meta
              property="og:description"
              content="周公解梦是一种将梦境解读为暗示和预兆的传统文化实践。在中国古代，人们相信梦境可以透露出隐藏的信息或未来事件。因此，他们会寻求有经验的解梦师（如周公）来帮助理解和分析自己的梦境。"
            />
          </Head>

          <Component />

          <StyledComponentsRegistry
            dream={dream}
            setDream={setDream}
            handleSubmit={handleSubmit}
            response={response}
            isLoading={isLoading}
            loadingTexts={loadingTexts}
          />
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
