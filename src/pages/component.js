import { Button } from 'antd';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
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
  const [buttonText, setButtonText] = useState('解梦');
  const [isInputDisabled, setIsInputDisabled] = useState(false); // 添加 isInputDisabled 状态

  const isSignedIn = session !== null;

  const handleLogin = async () => {
    const result = await signIn('github');
    if (result?.error) {
      console.log(result.error);
    } else if (result?.user?.name) {
      setUsername(result.user.name);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setUsername('');
    router.push('/');
  };

  useEffect(() => {
    setIsInputDisabled(isLoading);
    if (isLoading) {
      const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * loadingTexts.length);
        setButtonText(loadingTexts[randomIndex]);
      }, 10000);

      return () => {
        clearInterval(interval);
      };
    } else {
      setButtonText('解梦');
    }
  }, [isLoading]);

  useEffect(() => {
    setButtonText('解梦');
  }, [dream]);

  useEffect(() => {
    if (session?.user?.name) {
      setUsername(session.user.name);
    }
  }, [session]);

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
                width: 308,
                marginBottom: '28px',
              }}
              value={dream}
              showCount
              rows={5}
              maxLength={400}
              placeholder="请输入梦境"
              onChange={(e) => setDream(e.target.value)}
              disabled={!isSignedIn || isInputDisabled} // 更新 disabled 属性
            />
            {isSignedIn ? (
              <Button
                block
                size="large"
                style={{
                  width: 308,
                  backgroundColor: '#CEAB93',
                  borderColor: '#CEAB93',
                  borderWidth: '1px',
                  color: '#000',
                  marginBottom: '28px',
                }}
                onClick={handleSubmit}
                loading={isLoading}
              >
                {buttonText}
              </Button>
            ) : (
              <Button
                block
                size="large"
                style={{
                  width: 308,
                  backgroundColor: '#CEAB93',
                  borderColor: '#CEAB93',
                  borderWidth: '1px',
                  color: '#000',
                  marginBottom: '10px',
                }}
                onClick={handleLogin}
              >
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
