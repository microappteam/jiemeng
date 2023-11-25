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
import WeatherDisplay from './WeatherDisplay';
import DreamHistoryDrawer from './DreamHistoryDrawer';
import Head from 'next/head';
const { TextArea } = Input;

export default function MyPage({
  open,
  dream,
  setDream,
  handleSubmit,
  response,
  isLoading,
  loadingTexts,
  weatherText,
  futureWeatherText,
  showDrawer,
  onClose,
  dreamHistory,
  handleDelete,
  deleteLoading,
  setDeleteLoading,
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [username, setUsername] = useState('');
  const [buttonText, setButtonText] = useState('解梦');
  const [isInputDisabled, setIsInputDisabled] = useState(false);
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
    setButtonText('解梦');
  }, [dream]);

  useEffect(() => {
    setIsInputDisabled(isLoading);
    if (isLoading) {
      const randomIndex = Math.floor(Math.random() * loadingTexts.length);
      setButtonText(loadingTexts[randomIndex]);
    } else {
      setButtonText('解梦');
    }
  }, [isLoading]);

  useEffect(() => {
    setButtonText('解梦');
  }, [dream]);
  useEffect(() => {
    if (deleteLoading) {
      const timer = setTimeout(() => {
        setDeleteLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [deleteLoading]);

  useEffect(() => {
    if (session?.user?.name) {
      setUsername(session.user.name);
    }
  }, [session]);

  return (
    <div>
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
                priority={true}
              />
            </h1>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '136%',
              }}
            >
              {username && (
                <div className={styles.welcome}>
                  欢迎你，{username}！
                  <span onClick={handleLogout} style={{ cursor: 'pointer' }}>
                    退出
                  </span>
                </div>
              )}
              <form
                onSubmit={handleSubmit}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  marginBottom: '10px',
                }}
              >
                <TextArea
                  style={{
                    borderColor: '#CEAB93',
                    borderWidth: '1px',
                    marginBottom: '28px',
                  }}
                  value={dream}
                  showCount
                  rows={5}
                  maxLength={200}
                  placeholder="请输入梦境"
                  onChange={(e) => setDream(e.target.value)}
                  disabled={!isSignedIn || isInputDisabled}
                />
                {isSignedIn ? (
                  <Button
                    block
                    size="large"
                    style={{
                      backgroundColor: '#CEAB93',
                      borderColor: '#CEAB93',
                      borderWidth: '1px',
                      color: '#000',
                      marginBottom: '10px',
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
                <div className={styles.response}>
                  <p>解梦结果：</p>
                  <ReactMarkdown className={styles['response-text']}>
                    {response}
                  </ReactMarkdown>
                </div>
              )}
            </div>
            {isSignedIn && (
              <div>
                <DreamHistoryDrawer
                  open={open}
                  showDrawer={showDrawer}
                  onClose={onClose}
                  dreamHistory={dreamHistory}
                  handleDelete={handleDelete}
                />
                <WeatherDisplay
                  weatherText={weatherText}
                  futureWeatherText={futureWeatherText}
                />
              </div>
            )}
          </div>
        </StyledComponentsRegistry>
      </RootLayout>
      <Head>
        <title>周公解梦</title>
      </Head>
    </div>
  );
}
