import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { dream } = req.body;
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a dream interpreter." },
            { role: "user", content: dream },
          ],
        },
        {
          headers: {
            Authorization: `Bearer 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`,
            "Content-Type": "application/json",
          },
        }
      );

      const answer = response.data.choices[0].message.content;
      res.status(200).json(answer);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
