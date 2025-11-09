import express from "express";
import {
  getModulesByLesson,
  deleteModule,
} from "../controllers/moduleController.js";

const router = express.Router();

router.get("/:lessonId", getModulesByLesson);
router.delete("/:id", deleteModule);

export default router;
