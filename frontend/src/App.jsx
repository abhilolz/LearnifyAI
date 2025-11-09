import { useState } from "react";
import Sidebar from "./components/Sidebar";
import LessonArea from "./components/LessonArea";
import ChatInput from "./components/ChatInput";
import api from "./api/axios";

export default function App() {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (topic) => {
    try {
      setLoading(true);
      const res = await api.post("/lessons", { topic });
      const newLesson = res.data.lesson;
      setSelectedLesson(newLesson);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error("❌ Error generating lesson:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100">
      {/* Sidebar */}
      <Sidebar
        onSelectLesson={setSelectedLesson}
        onNewLesson={() => setSelectedLesson(null)}
        refreshTrigger={refreshTrigger}
      />

      {/* Main Section */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="border-b border-gray-800 bg-gray-900 p-4 shadow-md flex justify-between items-center">
          <h1 className="text-xl font-semibold text-green-400">
            🧠 LearnifyAI
          </h1>
          <span className="text-sm text-gray-400">
            AI-Powered Lesson Generator
          </span>
        </header>

        {/* Lesson Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <LessonArea lesson={selectedLesson} />
        </main>

        {/* Input Bar */}
        <footer className="bg-gray-900 border-t border-gray-800 p-3">
          <ChatInput onSubmit={handleGenerate} disabled={loading} />
        </footer>
      </div>
    </div>
  );
}
