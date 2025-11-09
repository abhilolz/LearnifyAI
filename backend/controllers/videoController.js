import { GoogleGenerativeAI } from "@google/generative-ai";
import { google } from "googleapis";

// Initialize YouTube API
const youtube = google.youtube("v3");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function to extract video ID
const extractVideoId = (url) => {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

// ✅ Summarize YouTube video using Gemini
export const summarizeVideo = async (req, res) => {
  try {
    const { videoUrl } = req.body;
    const videoId = extractVideoId(videoUrl);

    if (!videoId) {
      return res.status(400).json({ error: "Invalid YouTube URL" });
    }

    // Fetch video details using YouTube API
    const videoData = await youtube.videos.list({
      key: process.env.YOUTUBE_API_KEY,
      part: ["snippet", "statistics"],
      id: [videoId],
    });

    if (!videoData.data.items.length) {
      return res.status(404).json({ error: "Video not found" });
    }

    const videoDetails = videoData.data.items[0].snippet;

    // Create Gemini model instance
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Create AI prompt
    const prompt = `
Please provide a comprehensive summary of this YouTube video:

Title: ${videoDetails.title}
Description: ${videoDetails.description}
URL: ${videoUrl}

Include:
1. Main topics and key points
2. Important examples or moments
3. Key takeaways
4. Technical concepts explained (if any)

Format it clearly with headings and bullet points.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    res.json({
      summary,
      videoDetails: {
        title: videoDetails.title,
        description: videoDetails.description,
        publishedAt: videoDetails.publishedAt,
        channelTitle: videoDetails.channelTitle,
        thumbnails: videoDetails.thumbnails,
      },
    });
  } catch (error) {
    console.error("❌ Summarization error:", error.message);
    res.status(500).json({ error: "Failed to summarize video" });
  }
};
