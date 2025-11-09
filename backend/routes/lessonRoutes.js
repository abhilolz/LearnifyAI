import express from "express";
import {
  createLesson,
  getLessons,
  deleteLesson,
} from "../controllers/lessonController.js";

const router = express.Router();

router.post("/", createLesson); // Create new lesson
router.get("/", getLessons); // Get all lessons
router.delete("/:id", deleteLesson); // ✅ Delete one lesson + modules

export default router;
