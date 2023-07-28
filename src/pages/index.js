import { useState } from "react";
import axios from "axios";

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
    <div className="container">
      <div className="content">
        <h1 className="title">周公解梦</h1>
        <form onSubmit={handleSubmit}>
          <label>
            梦境内容：
            <textarea
              value={dream}
              onChange={(e) => setDream(e.target.value)}
              className="input"
              placeholder="请输入梦境"
            />
          </label>
          <button type="submit" className="button">
            解梦
          </button>
        </form>
        {response && (
          <div className="response">
            <p>解梦结果：</p>
            <pre className="response-text">{response}</pre>
          </div>
        )}
      </div>

      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          background-image: url("/980.jpg");
          background-size: 100% auto;
          background-repeat: no-repeat;
          height: 100vh; /* 设置高度为视口高度 */
        }

        .content {
          padding: 12px;
          text-align: center;
          background-color: #f9f0e1;
        }

        .title {
          background-color: #f9f0e1;
        }

        .input {
          background-color: #f9f0e1;
          width: 100%;
          height: 200px;
          resize: vertical;
          padding: 8px;
          font-size: 16px;
        }

        .button {
          background-color: #f9f0e1;
        }

        .response {
          width: 400px;
          margin-top: 20px;
          text-align: left;
        }

        .response-text {
          font-size: 18px;
          background-color: #f9f0e1;
          white-space: pre-line;
          overflow-wrap: break-word;
        }
      `}</style>
    </div>
  );
}
