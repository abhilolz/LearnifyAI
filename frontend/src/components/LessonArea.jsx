import { useEffect, useState } from "react";
import api from "../api/axios";

export default function LessonArea({ lesson }) {
  const [modules, setModules] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch modules from backend when a lesson is selected
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

  // ✅ If no lesson is selected
  if (!lesson) {
    return (
      <div className="flex items-center justify-center text-gray-500 h-full">
        🧠 Select a lesson or generate a new one!
      </div>
    );
  }

  // ✅ Render modules
  return (
    <div className="space-y-4 h-full overflow-y-auto p-6">
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
              <div className="animate-fadeIn mt-4 space-y-4">
                {/* ✅ Lesson Content */}
                <div
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: mod.content }}
                />

                {/* 🎥 Related Videos Section */}
                {mod.relatedVideos && mod.relatedVideos.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h3 className="text-sm font-semibold text-green-400">
                      🎥 Related Videos
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {mod.relatedVideos.map((vid) => (
                        <a
                          key={vid.videoId}
                          href={vid.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gray-800 rounded-lg p-2 hover:bg-gray-700 transition-all flex flex-col"
                        >
                          <img
                            src={vid.thumbnail}
                            alt={vid.title}
                            className="rounded-lg mb-2"
                          />
                          <p className="text-sm font-medium text-gray-200 line-clamp-2">
                            {vid.title}
                          </p>
                          <span className="text-xs text-gray-400">
                            {vid.channelTitle}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
