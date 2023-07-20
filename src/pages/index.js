import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [dream, setDream] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/api/dream",
        { dream },
        { timeout: 60000 }
      );
      setResponse(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>周公解梦</h1>
      <form onSubmit={handleSubmit}>
        <label>
          梦境内容：
          <input
            type="text"
            value={dream}
            onChange={(e) => setDream(e.target.value)}
          />
        </label>
        <button type="submit">解梦</button>
      </form>
      {response && <p>解梦结果：{response}</p>}
    </div>
  );
}
