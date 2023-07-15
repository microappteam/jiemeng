const express = require("express");
const { OpenAI } = require("openai");

const app = express();
const port = 3000;

// 设置 OpenAI API 访问凭证
const openai = new OpenAI({
  apiKey: "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",
});

// 处理 POST 请求
app.use(express.json());
app.post("/dream", async (req, res) => {
  try {
    const userInput = req.body.inputText;

    // 调用 ChatGPT 进行解梦
    const response = await openai.complete({
      engine: "text-davinci-003", // 使用适合的模型引擎
      prompt: `You are a dream interpreter.\n\nUser: ${userInput}`,
      maxTokens: 100,
      temperature: 0.7,
      n: 1,
      stop: "\n",
    });

    const dreamResult = response.choices[0].text.trim();

    // 将解梦结果返回给前端
    res.json({ result: dreamResult });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to process the dream request" });
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
