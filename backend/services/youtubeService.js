import { google } from "googleapis";

const youtube = google.youtube("v3");

// ✅ Function to fetch related YouTube videos for a topic
export const fetchRelatedVideos = async (query) => {
  try {
    const response = await youtube.search.list({
      key: process.env.YOUTUBE_API_KEY,
      part: ["snippet"],
      maxResults: 3,
      q: query,
      type: "video",
      relevanceLanguage: "en",
      safeSearch: "strict",
    });

    return response.data.items.map((video) => ({
      videoId: video.id.videoId,
      title: video.snippet.title,
      channelTitle: video.snippet.channelTitle,
      thumbnail: video.snippet.thumbnails.medium.url,
      url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
    }));
  } catch (err) {
    console.error("❌ YouTube fetch error:", err.message);
    return [];
  }
};
