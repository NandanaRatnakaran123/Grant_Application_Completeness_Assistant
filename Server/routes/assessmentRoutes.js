
import express from "express";
import { createGeminiAssessment } from "../services/geminiAssessmentService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { guidelineText, applicationText } = req.body;

    // Validate input
    if (
      typeof guidelineText !== "string" ||
      typeof applicationText !== "string" ||
      !guidelineText.trim() ||
      !applicationText.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Both guidelineText and applicationText are required.",
      });
    }

    // Limit document size
    const MAX_TEXT_LENGTH = 200_000;

    if (
      guidelineText.length > MAX_TEXT_LENGTH ||
      applicationText.length > MAX_TEXT_LENGTH
    ) {
      return res.status(413).json({
        success: false,
        message:
          "Each document must contain at most 200,000 characters.",
      });
    }

    // Generate AI assessment using Gemini
    const assessment = await createGeminiAssessment(
      guidelineText,
      applicationText
    );

    return res.status(200).json({
      success: true,
      assessment,
    });
 
  } catch (error) {
    console.error("Assessment error:", error);

    const message = error?.message || "Unknown assessment error";

    return res.status(500).json({
      success: false,
      message,
    });
  }

});

export default router;
