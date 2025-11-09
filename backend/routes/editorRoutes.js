import express from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import { rephraseText, regenerateText, summarizeText } from '../controllers/editorController.js';

const router = express.Router();

router.post('/rephrase', verifyToken, rephraseText);
router.post('/regenerate', verifyToken, regenerateText);
router.post('/summarize', verifyToken, summarizeText);

export default router;
