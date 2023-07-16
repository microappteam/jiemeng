import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { content } = req.body;

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/engines/davinci-codex/completions",
        {
          prompt: `周公解梦：${content}`,
          max_tokens: 100,
          temperature: 0.7,
          n: 1,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "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", 
          },
        }
      );

      const dreamResult = response.data.choices[0].text.trim();
      res.status(200).json({ result: dreamResult });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "解梦失败" });
    }
  } else {
    res.status(405).end();
  }
}
