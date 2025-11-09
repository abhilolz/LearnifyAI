import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Sidebar({
  onSelectLesson,
  onNewLesson,
  refreshTrigger,
}) {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLessons = async () => {
    try {
      const res = await api.get("/lessons");
      setLessons(res.data.lessons);
    } catch (err) {
      console.error("❌ Failed to load lessons:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm("Delete this lesson?")) return;
    try {
      await api.delete(`/lessons/${lessonId}`);
      setLessons((prev) => prev.filter((l) => l._id !== lessonId));
    } catch (err) {
      console.error("❌ Failed to delete lesson:", err);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [refreshTrigger]);

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="p-4 text-2xl font-bold text-green-400 border-b border-gray-800">
        LearnifyAI
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-2">
        <button
          onClick={onNewLesson}
          className="w-full text-left bg-green-600 hover:bg-green-500 px-3 py-2 rounded-lg transition-all duration-200"
        >
          + New Lesson
        </button>

        <h2 className="text-xs uppercase text-gray-400 mt-4 tracking-wider">
          Saved Lessons
        </h2>

        {loading ? (
          <p className="text-gray-500 text-sm mt-2">Loading...</p>
        ) : lessons.length === 0 ? (
          <p className="text-gray-500 text-sm mt-2">No lessons yet</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {lessons.map((lesson) => (
              <li
                key={lesson._id}
                className="flex items-center justify-between bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg transition-all"
              >
                <button
                  className="flex-1 text-left truncate hover:text-green-400"
                  onClick={() => onSelectLesson(lesson)}
                >
                  {lesson.lessonHeading}
                </button>
                <button
                  onClick={() => handleDeleteLesson(lesson._id)}
                  className="ml-2 text-red-400 hover:text-red-300"
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
