import { GoogleGenerativeAI } from '@google/generative-ai';

// Create an instance of the AI model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Reusable prompt templates
const prompts = {
  rephrase: (text) => `
You are a professional editor polishing work for publication. Rephrase the following passage for improved clarity, tone, and readability, while maintaining the original meaning. Make the language more sophisticated, professional, and fluid. Avoid redundancy, improve transitions, and optimize sentence structure for expert readers.
Format your output using clear headings and subheadings, bullet points where appropriate, and markdown for readability.Give the response in HTML formatting, add in the tables and bullet points where necessary. Use a professional tone and ensure the content is suitable for an educational audience. Only send the HTML response, only provide the body of the HTML document, and don't use \\n or any other escape characters.

Passage:
"${text}"
`,

  regenerate: (text) => `
You are an expert content creator and writing assistant. Rewrite the following passage with entirely fresh phrasing and structure while preserving the original intent and meaning. Enhance clarity, flow, and engagement, making it suitable for publication in a high-quality blog or educational article. Use refined vocabulary and vary sentence structures to add literary richness.
Format your output using clear headings and subheadings, bullet points where appropriate, and markdown for readability.Give the response in HTML formatting, add in the tables and bullet points where necessary. Use a professional tone and ensure the content is suitable for an educational audience. Only send the HTML response, only provide the body of the HTML document, and don't use \\n or any other escape characters.

Passage:
"${text}"
`,

  summarize: (text) => `
You are a seasoned academic editor. Summarize the following passage into a concise, standalone paragraph that retains all essential insights. Focus on clarity, coherence, and utility for readers who seek to understand the core idea quickly. Ensure the summary is structured, articulate, and useful in a professional or educational context.
Format your output using clear headings and subheadings, bullet points where appropriate, and markdown for readability.Give the response in HTML formatting, add in the tables and bullet points where necessary. Use a professional tone and ensure the content is suitable for an educational audience. Only send the HTML response, only provide the body of the HTML document, and don't use \\n or any other escape characters.

Passage:
"${text}"
`,
};

// Function to call Gemini API
const generateGeminiResponse = async (prompt) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};

// Controller to handle rephrase
export const rephraseText = async (req, res) => {
  const { text } = req.body;
  try {
    const prompt = prompts.rephrase(text);
    const result = await generateGeminiResponse(prompt);
    res.json({ output: result });
  } catch (err) {
    res.status(500).json({ error: 'Failed to rephrase text' });
  }
};

// Controller to handle regenerate
export const regenerateText = async (req, res) => {
  const { text } = req.body;
  try {
    const prompt = prompts.regenerate(text);
    const result = await generateGeminiResponse(prompt);
    res.json({ output: result });
  } catch (err) {
    res.status(500).json({ error: 'Failed to regenerate text' });
  }
};

// Controller to handle summarize
export const summarizeText = async (req, res) => {
  const { text } = req.body;
  try {
    const prompt = prompts.summarize(text);
    const result = await generateGeminiResponse(prompt);
    res.json({ output: result });
  } catch (err) {
    res.status(500).json({ error: 'Failed to summarize text' });
  }
};
