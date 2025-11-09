import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import lessonRoutes from "./routes/lessonRoutes.js";
import moduleRoutes from "./routes/moduleRoutes.js";
import videoRoutes from "./routes/videoRoutes.js"; // ✅ import here

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Define routes AFTER initializing app
app.use("/api/lessons", lessonRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/videos", videoRoutes); // ✅ Add here

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server is running on port ${PORT} 😊`));
