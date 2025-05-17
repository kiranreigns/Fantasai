import express from "express";
import * as dotenv from "dotenv";
import axios from "axios";
dotenv.config();

const router = express.Router();

const handleImageGeneration = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: "Prompt is required",
      });
    }

    console.log("Generating image with prompt:", prompt);

    const invokeUrl =
      "https://ai.api.nvidia.com/v1/genai/stabilityai/stable-diffusion-xl";

    const headers = {
      Authorization: `Bearer ${process.env.NVDIA_FLUX_API_KEY}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    // Enhanced prompt with quality boosters
    const enhancedPrompt = `${prompt}, high quality, detailed, sharp focus,`;

    // Negative prompts to avoid common issues
    const negativePrompt =
      "disfigured, distorted, blurred, deformed, bad anatomy, extra limbs, missing limbs, poorly drawn face, bad proportions, duplicate, morbid, mutilated, out of frame, ugly, pixelated";

    // Improved payload format for Stable Diffusion XL with fine-tuned parameters
    const payload = {
      text_prompts: [
        {
          text: enhancedPrompt,
          weight: 1.0,
        },
        {
          text: negativePrompt,
          weight: -1.0,
        },
      ],
      cfg_scale: 8.0, // Increased for better prompt adherence
      height: 1024,
      width: 1024,
      samples: 1,
      steps: 40, // Increased for better quality
      seed: Math.floor(Math.random() * 1000000),
      sampler: "DDIM", // Specified sampler for better results
    };

    console.log("Making request to:", invokeUrl);

    const response = await axios.post(invokeUrl, payload, { headers });

    // Extract the image data from the response
    if (
      response.data &&
      response.data.artifacts &&
      response.data.artifacts.length > 0
    ) {
      const base64Image = response.data.artifacts[0].base64;

      // Return the image data to the client
      res.json({
        success: true,
        photo: base64Image,
      });
    } else {
      throw new Error("No image data found in API response");
    }
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to generate image",
    });
  }
};

router.route("/").post(handleImageGeneration);

export default router;
