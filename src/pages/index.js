import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import Head from "next/head";
import { App, Button, Input, ConfigProvider } from "antd";
import zhCN from "antd/lib/locale/zh_CN";
const { TextArea } = Input;
export default function Home() {
  const [dream, setDream] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/api/dream",
        { dream },
        { timeout: 60000 }
      );
      setResponse(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <App>
      <ConfigProvider
        locale={zhCN}
        getPopupContainer={() => contentRef.current}
      >
        <div className="container">
          <Head>
            <title>周公解梦</title>
            <link rel="icon" href="/dream.png" />
          </Head>
          <div className="content">
            <h1 className="title">周公解梦</h1>
            <form onSubmit={handleSubmit}>
              <TextArea
                style={{
                  borderColor: "#CEAB93",
                  borderWidth: "1px",
                  width: 300,
                }}
                value={dream}
                showCount
                rows={5}
                maxLength={400}
                placeholder="请输入梦境"
                onChange={(e) => setDream(e.target.value)}
              />
              <br />
              <br />

              <Button
                block
                size="large"
                style={{
                  backgroundColor: "#CEAB93",
                  borderColor: "#CEAB93",
                  borderWidth: "1px",
                  color: "#000",
                }}
                onClick={handleSubmit}
              >
                解梦
              </Button>
            </form>
            {response && (
              <div className="response">
                <p>解梦结果：</p>
                <ReactMarkdown className="response-text">
                  {response}
                </ReactMarkdown>
              </div>
            )}
          </div>

          <style jsx>{`
            .container {
              display: flex;
              justify-content: center;
              align-items: flex-start;
              background-color: #fffbe9;
              height: 100vh;
              padding-top: 20px;
            }

            .content {
              display: flex;
              justify-content: center;
              align-items: center;
              flex-direction: column;
              padding: 12px;
              text-align: center;
              width: 90%;
              max-width: 400px;
            }

            .response {
              margin-top: 20px;
              text-align: left;
            }

            .response-text {
              font-size: 16px;
              background-color: #e3caa5;
              white-space: pre-line;
              overflow-wrap: break-word;
            }
          `}</style>
        </div>
      </ConfigProvider>
    </App>
  );
}
