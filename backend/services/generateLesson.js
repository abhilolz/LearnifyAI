// backend/services/generateLesson.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

// ✅ Initialize Gemini model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Reusable lesson generation function
export async function generateLesson(topic) {
  if (!topic) throw new Error("Topic is required.");

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const prompt = `${lessonPrompt}\n\nTopic: ${topic}`;

  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      attempts++;
      console.log(
        `🧠 Generating lesson for topic: ${topic} (Attempt ${attempts})`
      );

      const result = await model.generateContent(prompt);
      const response = await result.response;

      let text = response.text();

      // 🧹 Clean Gemini's markdown-style code block wrappers
      text = text
        .replace(/```html/g, "")
        .replace(/```/g, "")
        .trim();

      return text; // ✅ Success — return cleaned lesson text
    } catch (error) {
      console.error(`⚠️ Attempt ${attempts} failed: ${error.message}`);

      // Wait 2 seconds before retrying
      if (attempts < maxAttempts) {
        console.log("🔁 Retrying in 2 seconds...");
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } else {
        console.error("❌ All attempts failed. Could not generate lesson.");
        throw error; // Rethrow after last attempt
      }
    }
  }
}

// 🧠 Prompt for the AI
const lessonPrompt = `
Act as an experienced instructional designer, curriculum architect, and subject matter expert. 
I will provide a topic or concept, and your task is to generate a comprehensive, structured lesson plan 
designed for digital delivery. The lesson must follow this detailed structure and be rich in content, 
educational theory, and learner engagement strategies:

1. Lesson Title (Compelling & Relevant)
   • Generate an engaging and informative title that reflects the core theme and purpose of the lesson.
   • It should balance clarity, relevance, and curiosity, suitable for a digital education platform.

2. Lesson Overview / Description
   • Write a 150–200 word description that clearly introduces the topic/concept,
     explains why it is important, outlines what learners will gain,
     and links it to broader subject areas or curricula.

3. Learning Outcomes (SMART Objectives)
   • List 5–7 specific, measurable objectives using active verbs
     aligned with Bloom’s Taxonomy (Remember → Create).

4. Key Concepts, Definitions & Terminology
   • Provide 10–15 critical terms with definitions and short contextual explanations.

5. In-depth Content Breakdown
   • Divide into sub-sections with titles, 150–300 word explanations,
     and optional knowledge checks or reflection prompts.

6. Interactive Learning Activities
   • 3–5 practical learning activities (case studies, data analysis, simulations, etc.)
     each with purpose, steps, and expected outcomes.

7. Real-World Examples & Case Studies
   • 2–3 detailed applied examples with reflection questions.

8. Target Audience
   • Define learner level, background, and pre-requisites.

9. Prerequisites
   • List prior knowledge or tools needed.

10. Estimated Duration
   • Time breakdown for reading, activities, and assessment.

11. Assessment Strategy
   • Include 3–5 sample quiz questions or project-based tasks.

12. Further Reading & Resources
   • Recommend related articles, videos, or courses.

Format the response in **clean HTML only** (no markdown).
Include proper headings, bullet points, and tables where relevant.
Do not include \\n or escape characters.
Only return the body content of the HTML document.
`;
