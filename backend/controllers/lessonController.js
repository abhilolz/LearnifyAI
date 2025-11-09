import Lesson from "../models/Lesson.js";
import Module from "../models/Module.js";
import { generateLesson } from "../services/generateLesson.js";

// ✅ Create and save new lesson + modules
export const createLesson = async (req, res) => {
  const { topic } = req.body;

  if (!topic) {
    return res.status(400).json({ error: "Topic is required." });
  }

  try {
    console.log(`🧠 Generating lesson for topic: ${topic}`);
    const lessonHTML = await generateLesson(topic);

    // Extract lesson title from <h1>
    const headingMatch = lessonHTML.match(/<h1[^>]*>(.*?)<\/h1>/i);
    const lessonHeading = headingMatch ? headingMatch[1].trim() : topic;

    // Extract overview (optional)
    const overviewMatch = lessonHTML.match(
      /<h2[^>]*>Lesson Overview[\s\S]*?<\/h2>(.*?)(?=<h2|$)/i
    );
    const overview = overviewMatch ? overviewMatch[1].trim() : "";

    // ✅ Save main lesson
    const newLesson = new Lesson({
      lessonHeading,
      overview,
    });
    const savedLesson = await newLesson.save();
    console.log(`✅ Lesson saved: ${lessonHeading}`);

    // ✅ Split HTML by <h2> sections into modules
    const moduleRegex = /<h2[^>]*>(.*?)<\/h2>(.*?)(?=<h2|$)/gis;
    const modules = [];
    let match;

    while ((match = moduleRegex.exec(lessonHTML)) !== null) {
      const title = match[1].trim();
      const content = match[2].trim();
      if (title.toLowerCase() !== "lesson overview") {
        modules.push({ lessonId: savedLesson._id, title, content });
      }
    }

    // ✅ Save modules
    await Module.insertMany(modules);
    console.log(`✅ ${modules.length} modules saved for ${lessonHeading}`);

    res.status(201).json({
      message: "Lesson and modules generated successfully",
      lesson: savedLesson,
      modules,
    });
  } catch (err) {
    console.error("❌ Error generating lesson:", err.message);
    res.status(500).json({ error: "Lesson generation failed." });
  }
};

// ✅ Fetch all lessons
export const getLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find().sort({ createdAt: -1 });
    res.status(200).json({ lessons });
  } catch (err) {
    console.error("❌ Error fetching lessons:", err.message);
    res.status(500).json({ error: "Failed to fetch lessons." });
  }
};

// ✅ Delete lesson + its modules
export const deleteLesson = async (req, res) => {
  const { id } = req.params;

  try {
    // Delete all linked modules first
    await Module.deleteMany({ lessonId: id });

    // Delete the lesson itself
    await Lesson.findByIdAndDelete(id);

    console.log(`🗑️ Deleted lesson and modules for ID: ${id}`);
    res
      .status(200)
      .json({ message: "Lesson and its modules deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting lesson:", err.message);
    res.status(500).json({ error: "Failed to delete lesson." });
  }
};
