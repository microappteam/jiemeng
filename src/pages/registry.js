// registry.js
import React from "react";
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
  return (
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
          disabled={isLoading}
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
