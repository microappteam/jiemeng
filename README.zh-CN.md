<div align="center">

<img height="120" src="public/logo.png">

<h1>周公解梦</h1>

用 ChatGPT 构建的梦境解释器。

[English](./README.md) · 简体中文 · [Report Bug][github-issues-link] · [Request Feature][github-issues-link]

[![][ant-design-shield]][ant-design-link]

</div>

## 🔨 使用

只需在输入框里输入梦境。

<br/>

## ✨ 特性

- 使用Next.js作为脚手架。

  <br/><img src="https://www.arkasoftwares.com/blog/wp-content/uploads/2020/09/Next-JS.jpg">

  <br/>

- 使用chatgpt进行解梦。

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

- 使用Antd美化页面。

<img height="160" src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg">

<br/>

<!-- 链接组 -->

[ant-design-shield]: https://img.shields.io/badge/-Ant%20Design-1677FF?labelColor=black&logo=antdesign&style=flat-square
[ant-design-link]: https://ant.design
[github-issues-link]: https://github.com/microappteam/book-read-ai/issues
