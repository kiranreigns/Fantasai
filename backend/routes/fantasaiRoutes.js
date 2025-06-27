import express from "express";
import * as dotenv from "dotenv";
import axios from "axios";
dotenv.config();

const router = express.Router();

const handleImageGeneration = async (req, res) => {
  try {
    const {
      prompt,
      width = 1024,
      height = 1024,
      steps = 50,
      seed = 0,
      mode = "base",
      cfg_scale = 3.5,
    } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: "Prompt is required",
      });
    }

    // console.log("Generating image with prompt:", prompt);

    const invokeUrl =
      "https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.1-dev";

    const headers = {
      Authorization: `Bearer ${process.env.NVDIA_FLUX_API_KEY}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    // Flux.1-dev model payload format
    const payload = {
      prompt: prompt,
      mode: mode,
      cfg_scale: cfg_scale,
      width: width,
      height: height,
      seed: seed,
      steps: steps,
    };

    // console.log("Making request to:", invokeUrl);
    // console.log("Payload:", JSON.stringify(payload, null, 2));

    const response = await axios.post(invokeUrl, payload, { headers });

    // console.log("Response status:", response.status);
    // console.log("Response data type:", typeof response.data);
    // console.log("Response data length:", response.data?.length || 0);

    // Handle Flux API response format - it returns artifacts array with base64 image
    if (
      response.data &&
      response.data.artifacts &&
      response.data.artifacts.length > 0
    ) {
      // Extract the base64 image from the artifacts array
      const base64Image = response.data.artifacts[0].base64;

      // console.log("Received base64 image, length:", base64Image.length);

      // Return the image data in the expected format for the frontend
      res.json({
        success: true,
        photo: base64Image,
      });
    } else if (response.data && typeof response.data === "string") {
      // Fallback: if the response is a base64 image string directly
      const base64Image = response.data;

      // console.log(
      //   "Received base64 image directly, length:",
      //   base64Image.length
      // );

      res.json({
        success: true,
        photo: base64Image,
      });
    } else {
      console.error("Unexpected response format:", response.data);
      throw new Error("No image data found in API response");
    }
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);

    // Handle specific HTTP error responses
    if (error.response) {
      const errorMessage =
        error.response.data ||
        `Request failed with status ${error.response.status}`;
      res.status(error.response.status).json({
        success: false,
        error: errorMessage,
      });
    } else {
      res.status(500).json({
        success: false,
        error: error.message || "Failed to generate image",
      });
    }
  }
};

router.route("/").post(handleImageGeneration);

export default router;
