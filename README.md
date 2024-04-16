<div align="center">

<img height="120" src="public/logo.png">

<h1>Duke of Zhou Interprets Dreams</h1>

A dream interpreter built with ChatGPT.

English · [简体中文](./README.zh-CN.md) · [Report Bug][github-issues-link] · [Request Feature][github-issues-link]

[![][ant-design-shield]][ant-design-link]

</div>

## 🔨 Usage

Just enter the dream in the input box.

<br/>

## ✨ Features

- Build with Next.js.

  <br/><img src="https://www.arkasoftwares.com/blog/wp-content/uploads/2020/09/Next-JS.jpg">

  <br/>

- Use gpt-3.5-turbo to interprets dreams.

```jsx
const chatData = await openai.chat.completions.create({
  model: 'gpt-3.5-turbo',
  messages: [
    { role: 'system', content: rolePlayText },
    { role: 'user', content: `UserId: ${userId}` },
    { role: 'user', content: dream },
  ],
  temperature: 1,
  max_tokens: 888,
  stream: true,
});
```

- Beautify the page with antd.

<img height="160" src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg">

<br/>

<!-- 链接组 -->

[ant-design-shield]: https://img.shields.io/badge/-Ant%20Design-1677FF?labelColor=black&logo=antdesign&style=flat-square
[ant-design-link]: https://ant.design
[github-issues-link]: https://github.com/microappteam/book-read-ai/issues
