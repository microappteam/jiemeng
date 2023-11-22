import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="icon" href="/logo.png" />
          <meta property="og:title" content="周公解梦" />
          <meta property="twitter:image" content="/logo.png" />
          <meta property="og:image" content="/logo.png" />
          <meta property="twitter:title" content="周公解梦" />
          <meta property="twitter:card" content="summary" />
          <meta
            property="twitter:description"
            content="周公解梦是一种将梦境解读为暗示和预兆的传统文化实践。在中国古代，人们相信梦境可以透露出隐藏的信息或未来事件。因此，他们会寻求有经验的解梦师（如周公）来帮助理解和分析自己的梦境。"
          />
          <meta property="og:url" content="https://jiemeng.chenshuai.dev" />
          <meta
            property="og:description"
            content="周公解梦是一种将梦境解读为暗示和预兆的传统文化实践。在中国古代，人们相信梦境可以透露出隐藏的信息或未来事件。因此，他们会寻求有经验的解梦师（如周公）来帮助理解和分析自己的梦境。"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
