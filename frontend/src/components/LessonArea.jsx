import { useEffect, useState } from "react";
import api from "../api/axios";

export default function LessonArea({ lesson }) {
  const [modules, setModules] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!lesson?._id) return;
    const fetchModules = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/modules/${lesson._id}`);
        setModules(res.data.modules);
      } catch (err) {
        console.error("❌ Failed to load modules:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchModules();
  }, [lesson]);

  if (!lesson) {
    return (
      <div className="flex items-center justify-center text-gray-500 h-full">
        🧠 Select a lesson or generate a new one!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold mb-4 text-green-400">
        {lesson.lessonHeading}
      </h1>

      {loading ? (
        <p className="text-gray-500">Loading modules...</p>
      ) : modules.length === 0 ? (
        <p className="text-gray-500">No modules yet</p>
      ) : (
        modules.map((mod, index) => (
          <div
            key={mod._id}
            className="bg-gray-900 border border-gray-800 rounded-2xl shadow-md p-4 transition-all duration-200 hover:shadow-gray-800/40"
          >
            <button
              className="w-full flex justify-between items-center text-left font-semibold text-lg hover:text-green-400"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              {mod.title}
              <span className="text-gray-400">
                {openIndex === index ? "▲" : "▼"}
              </span>
            </button>

            {openIndex === index && (
              <div
                className="prose prose-invert max-w-none mt-4 animate-fadeIn"
                dangerouslySetInnerHTML={{ __html: mod.content }}
              />
            )}
          </div>
        ))
      )}
    </div>
  );
}
