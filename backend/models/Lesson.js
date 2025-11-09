import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    lessonHeading: {
      type: String,
      required: true,
    },
    overview: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Lesson", lessonSchema);
