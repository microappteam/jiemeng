import { Button } from 'antd';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Input } from 'antd';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import styles from './component.module.css';
import StyledComponentsRegistry from '../styles/registry';
import RootLayout from '../layout';

const { TextArea } = Input;

export default function YourPage({
  dream,
  setDream,
  handleSubmit,
  response,
  isLoading,
  loadingTexts,
}) {
  const router = useRouter();
  const { data: session } = useSession();

  const [username, setUsername] = useState('');

  const isSignedIn = session !== null;

  const handleLogin = async () => {
    const result = await signIn('github');
    if (result?.error) {
      console.log(result.error);
    } else {
      setUsername(session.user.name);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setUsername('');
    router.push('/');
  };

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
          {username && (
            <div className={styles.welcome}>
              欢迎你，{username}！<Button onClick={handleLogout}>登出</Button>
            </div>
          )}
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
              disabled={!isSignedIn}
            />
            <br />
            <br />

            {isSignedIn ? (
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
                  ? loadingTexts[
                      Math.floor(Math.random() * loadingTexts.length)
                    ]
                  : '解梦'}
              </Button>
            ) : (
              <Button block size="large" onClick={handleLogin}>
                登录到GitHub
              </Button>
            )}
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
