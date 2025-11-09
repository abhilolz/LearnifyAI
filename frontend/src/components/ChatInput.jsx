import { useState } from "react";

export default function ChatInput({ onSubmit, disabled }) {
  const [topic, setTopic] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic.trim() || disabled) return;
    onSubmit(topic.trim());
    setTopic("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center bg-gray-800 rounded-xl px-4 py-2 shadow-md"
    >
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="💬 Type a topic to generate a lesson..."
        className="flex-1 bg-transparent focus:outline-none text-gray-100 placeholder-gray-500"
      />
      <button
        type="submit"
        disabled={disabled}
        className={`ml-3 px-4 py-2 rounded-lg font-semibold transition-all ${
          disabled
            ? "bg-gray-600 text-gray-400"
            : "bg-green-600 hover:bg-green-500 text-white"
        }`}
      >
        Generate
      </button>
    </form>
  );
}
