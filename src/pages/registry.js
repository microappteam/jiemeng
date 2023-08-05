import React, { useState } from "react";
import { Button, Input } from "antd";
import ReactMarkdown from "react-markdown";

const { TextArea } = Input;

export default function StyledComponentsRegistry({
  dream,
  setDream,
  handleSubmit,
  response,
  isLoading,
  loadingTexts,
}) {
  const [title, setTitle] = useState("周公解梦");

  return (
    <div className="content">
      <h1 className="title">
        <img src="/zgjm.png" alt="周公解梦" className="logo" />
      </h1>
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
          loading={isLoading}
        >
          {isLoading
            ? loadingTexts[Math.floor(Math.random() * loadingTexts.length)]
            : "解梦"}
        </Button>
      </form>
      {response && (
        <div className="response">
          <p>解梦结果：</p>
          <ReactMarkdown className="response-text">{response}</ReactMarkdown>
        </div>
      )}

      <style jsx>{`
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

        .title {
          max-width: 200px;
        }

        .logo {
          max-width: 100%;
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
  );
}
