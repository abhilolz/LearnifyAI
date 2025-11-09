import Module from "../models/Module.js";

// ✅ Get all modules for a given lesson
export const getModulesByLesson = async (req, res) => {
  const { lessonId } = req.params;

  try {
    const modules = await Module.find({ lessonId });
    res.status(200).json({ modules });
  } catch (err) {
    console.error("❌ Error fetching modules:", err.message);
    res.status(500).json({ error: "Failed to fetch modules." });
  }
};

// ✅ (Optional) Delete a module
export const deleteModule = async (req, res) => {
  const { id } = req.params;
  try {
    await Module.findByIdAndDelete(id);
    res.status(200).json({ message: "Module deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting module:", err.message);
    res.status(500).json({ error: "Failed to delete module." });
  }
};
