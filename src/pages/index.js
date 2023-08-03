import { useState, useEffect } from "react";
import axios from "axios";
import Head from "next/head";
import { Button, Input } from "antd";
import styled from "styled-components";

const { TextArea } = Input;

const StyledContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background-color: #fffbe9;
  height: 100vh;
  padding-top: 20px;
`;

const StyledContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 12px;
  text-align: center;
  width: 90%;
  max-width: 400px;
`;

const StyledResponse = styled.div`
  margin-top: 20px;
  text-align: left;
`;

const StyledResponseText = styled.p`
  font-size: 16px;
  white-space: pre-line;
  overflow-wrap: break-word;
`;

const StyledButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 16px;
`;

const StyledButton = styled(Button)`
  background-color: #ceab93;
  border-color: #ceab93;
  border-width: 1px;
  color: #000;

  &:hover,
  &:focus {
    background-color: #ceab93;
    border-color: #ceab93;
    color: #000;
  }

  &:active {
    background-color: #ceab93;
    border-color: #ceab93;
    color: #000;
    box-shadow: none;
  }

  &:disabled {
    background-color: #ceab93;
    border-color: #ceab93;
    color: #000;
    opacity: 0.7;
  }
`;

const loadingMessages = [
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

export default function Home() {
  const [dream, setDream] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [randomMessage, setRandomMessage] = useState("");

  useEffect(() => {
    if (loading) {
      const randomIndex = Math.floor(Math.random() * loadingMessages.length);
      setRandomMessage(loadingMessages[randomIndex]);
    }
  }, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
      setLoading(false);
    }
  };

  return (
    <StyledContainer>
      <Head>
        <title>周公解梦</title>
        <link rel="icon" href="/dream.png" />
      </Head>
      <StyledContent>
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

          <StyledButtonContainer>
            <StyledButton
              block
              size="large"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? randomMessage : "解梦"}
            </StyledButton>
          </StyledButtonContainer>
        </form>
        {response && (
          <StyledResponse>
            <p>解梦结果：</p>
            <StyledResponseText>{response}</StyledResponseText>
          </StyledResponse>
        )}
      </StyledContent>
    </StyledContainer>
  );
}
