import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema(
  {
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    relatedVideos: [
      {
        videoId: String,
        title: String,
        channelTitle: String,
        thumbnail: String,
        url: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Module", moduleSchema);
