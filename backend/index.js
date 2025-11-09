// backend/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import lessonRoutes from "./routes/lessonRoutes.js";
import editorRoutes from "./routes/editorRoutes.js";
import moduleRoutes from "./routes/moduleRoutes.js";

dotenv.config(); // Load .env variables

// ✅ Connect to MongoDB
connectDB();

const app = express();

// ✅ Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true,
  })
);
app.use(express.json());

// ✅ Base Route (optional sanity check)
app.get("/", (req, res) => {
  res.send("🚀 LearnifyAI backend is running successfully!");
});

// ✅ Lesson-related routes
app.use("/api/lessons", lessonRoutes);

// ✅ Editor tools (rephrase, summarize, etc.)
app.use("/api/editor", editorRoutes);

// ✅ Module generation (if used in your project)
app.use("/api/modules", moduleRoutes);

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server is running on port ${PORT} 😊`));
