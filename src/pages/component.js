// YourPage.tsx
import React, { useState } from 'react';
import { Button, Input } from 'antd';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import styles from './component.module.css';
import StyledComponentsRegistry from '../styles/registry';
import RootLayout from './layout';

const { TextArea } = Input;

export default function YourPage({
  dream,
  setDream,
  handleSubmit,
  response,
  isLoading,
  loadingTexts,
}) {
  const [title, setTitle] = useState('周公解梦');

  return (
    <RootLayout>
      <StyledComponentsRegistry>
        <div className={styles.content}>
          <h1 className={styles.title}>
            <Image
              src="/zgjm.png"
              width={256}
              height={70}
              alt="周公解梦"
              className={styles.logo}
            />
          </h1>
          <form onSubmit={handleSubmit}>
            <TextArea
              style={{
                borderColor: '#CEAB93',
                borderWidth: '1px',
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
                backgroundColor: '#CEAB93',
                borderColor: '#CEAB93',
                borderWidth: '1px',
                color: '#000',
              }}
              onClick={handleSubmit}
              loading={isLoading}
            >
              {isLoading
                ? loadingTexts[Math.floor(Math.random() * loadingTexts.length)]
                : '解梦'}
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
      </StyledComponentsRegistry>
    </RootLayout>
  );
}
