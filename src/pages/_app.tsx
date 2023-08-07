import type { AppProps } from 'next/app';
import { SessionProvider, useSession, signIn } from 'next-auth/react';
import { useEffect } from 'react';

export default function MyApp({ Component, pageProps }: AppProps) {
  // 在服务器端渲染时，session 对象可能为 undefined
  const { data: session, status } = useSession() || {};

  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn();
    }
  }, [status]);

  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
