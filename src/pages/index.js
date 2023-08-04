// index.js
import { useState } from "react";
import axios from "axios";
import Head from "next/head";
import { App, ConfigProvider } from "antd";
import zhCN from "antd/lib/locale/zh_CN";
import StyledComponentsRegistry from "./registry";

export default function Home() {
  const [dream, setDream] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loadingTexts = [
    "Loading...",
    "正在询问周公...",
    "正在翻阅梦书...",
    "好运正在路上...",
    "Loading 101% ...",
    "慢工出细活，久久方为功...",
    "周公正在解读梦境，请稍候...",
    "加载中，请稍候...",
    "卖力加载中...",
    "O.o ...",
    "马上就要写完咯...",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        "/api/dream",
        { dream },
        { timeout: 60000 }
      );
      setResponse(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <App>
      <ConfigProvider locale={zhCN}>
        <div className="container">
          <Head>
            <title>周公解梦</title>
            <link rel="icon" href="/dream.png" />
          </Head>
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
    </App>
  );
}
