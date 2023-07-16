import { useState } from "react";
import axios from "axios";

export default function DreamPage() {
  const [content, setContent] = useState("");
  const [result, setResult] = useState("");

  const handleInputChange = (event) => {
    setContent(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/api/dream", {
        content,
      });
      setResult(response.data.result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>周公解梦</h1>
      <form onSubmit={handleFormSubmit}>
        <label>
          输入需解梦的内容：
          <input type="text" value={content} onChange={handleInputChange} />
        </label>
        <button type="submit">解梦</button>
      </form>
      {result && <div>解梦结果：{result}</div>}
    </div>
  );
}
