import express from "express";
import { summarizeVideo } from "../controllers/videoController.js";

const router = express.Router();

router.post("/summarize", summarizeVideo);

export default router;
