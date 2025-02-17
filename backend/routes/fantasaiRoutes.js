import express from "express";
import * as dotenv from "dotenv";
import axios from "axios";
dotenv.config();

const router = express.Router();

// Define available models with their configurations
const MODELS = [
  {
    id: "stabilityai/stable-diffusion-xl-base-1.0",
    priority: 1,
    params: {
      num_inference_steps: 30, // Reduced steps for faster generation
      guidance_scale: 7.5,
      negative_prompt: "blurry, bad quality, distorted, ugly, deformed",
    },
    timeout: 40000,
  },
  {
    id: "runwayml/stable-diffusion-v1-5",
    priority: 2,
    params: {
      num_inference_steps: 35,
      guidance_scale: 8.0,
      negative_prompt: "blurry, bad quality, distorted, ugly, deformed",
    },
    timeout: 35000,
  },
  {
    id: "CompVis/stable-diffusion-v1-4",
    priority: 3,
    params: {
      num_inference_steps: 25,
      guidance_scale: 7.5,
      negative_prompt: "blurry, bad quality, distorted, ugly, deformed",
    },
    timeout: 30000,
  },
];

// Simple in-memory cache
const imageCache = new Map();
const modelHealth = new Map(
  MODELS.map((model) => [model.id, { healthy: true, lastCheck: Date.now() }])
);

// Add detailed error logging
async function generateImage(prompt, model) {
  try {
    console.log(`Attempting generation with model: ${model.id}`);
    const response = await axios({
      method: "post",
      url: `https://api-inference.huggingface.co/models/${model.id}`,
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      data: {
        inputs: prompt,
        parameters: {
          ...model.params,
          return_full_object: true,
          wait_for_model: true,
        },
      },
      responseType: "arraybuffer",
      timeout: model.timeout,
    });

    // Check if response is an error message in JSON format
    try {
      const textResponse = Buffer.from(response.data).toString("utf-8");
      const jsonResponse = JSON.parse(textResponse);
      if (jsonResponse.error) {
        throw new Error(jsonResponse.error);
      }
    } catch (e) {
      // If parsing fails, it's likely a valid image buffer
    }

    if (response.data.length < 100) {
      // Probably not a valid image
      throw new Error("Invalid image data received");
    }

    modelHealth.set(model.id, { healthy: true, lastCheck: Date.now() });
    return response.data;
  } catch (error) {
    console.error(`Failed with model ${model.id}:`, error.message);
    modelHealth.set(model.id, {
      healthy: false,
      lastCheck: Date.now(),
      lastError: error.message,
    });
    throw error;
  }
}

// Improved image generation function with better error handling
async function generateImageWithFallback(prompt) {
  console.log("Starting image generation for prompt:", prompt);

  // Check cache first
  const cacheKey = `${prompt}`;
  if (imageCache.has(cacheKey)) {
    console.log("Cache hit for prompt");
    return imageCache.get(cacheKey);
  }

  // Filter out unhealthy models
  const healthyModels = MODELS.filter((model) => {
    const health = modelHealth.get(model.id);
    const healthCheckValidityPeriod = 5 * 60 * 1000; // 5 minutes
    const isHealthy =
      health.healthy ||
      Date.now() - health.lastCheck > healthCheckValidityPeriod;
    if (!isHealthy) {
      console.log(
        `Model ${model.id} is unhealthy. Last error: ${health.lastError}`
      );
    }
    return isHealthy;
  }).sort((a, b) => a.priority - b.priority);

  if (healthyModels.length === 0) {
    throw new Error("No healthy models available. Please try again later.");
  }

  console.log(
    `Attempting generation with ${healthyModels.length} healthy models`
  );

  // Try models sequentially instead of parallel to avoid overwhelming the API
  for (const model of healthyModels) {
    try {
      console.log(`Trying model: ${model.id}`);
      const imageData = await generateImage(prompt, model);

      // Verify the response is a valid image
      if (imageData && imageData.length > 100) {
        console.log(`Successfully generated image with model: ${model.id}`);
        imageCache.set(cacheKey, imageData);

        // Clear old cache entries if cache is too large
        if (imageCache.size > 100) {
          const oldestKey = imageCache.keys().next().value;
          imageCache.delete(oldestKey);
        }

        return imageData;
      }
      console.log(`Invalid image data received from model: ${model.id}`);
    } catch (error) {
      console.error(`Error with model ${model.id}:`, error.message);
      continue; // Try next model
    }
  }

  throw new Error(
    "All models failed to generate image. Please try again later."
  );
}

router.route("/").get((req, res) => {
  res.send("Hello from Fantasai!");
});

router.route("/").post(async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: "Prompt is required",
      });
    }

    // Input validation
    if (typeof prompt !== "string" || prompt.length > 500) {
      return res.status(400).json({
        success: false,
        error: "Invalid prompt. Must be a string under 500 characters.",
      });
    }

    // Generate image
    const imageData = await generateImageWithFallback(prompt);

    // Verify we have valid image data
    if (!imageData || imageData.length < 100) {
      throw new Error("Invalid image data generated");
    }

    // Convert to base64
    const base64Image = Buffer.from(imageData).toString("base64");

    return res.status(200).json({
      success: true,
      photo: base64Image,
    });
  } catch (error) {
    console.error("Error in route handler:", error);

    // Handle specific error types
    if (error.response) {
      if (error.response.status === 401) {
        return res.status(401).json({
          success: false,
          error: "Authentication failed. Please check your API key.",
        });
      }
      if (error.response.status === 429) {
        return res.status(429).json({
          success: false,
          error: "Rate limit exceeded. Please try again later.",
        });
      }
      if (error.response.status === 503) {
        return res.status(503).json({
          success: false,
          error: "Service temporarily unavailable. Please try again later.",
        });
      }
    }

    return res.status(500).json({
      success: false,
      error: "Image generation failed: " + (error.message || "Unknown error"),
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

export default router;

/*
    const response = await fetch(
      "https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
        },
        body: JSON.stringify({
          text_prompts: [
            {
              text: prompt,
              weight: 1,
            },
          ],
          cfg_scale: 7,
          height: 1024,
          width: 1024,
          samples: 1,
          steps: 30,
        }),
      }
    );
    

    if (!response.ok) {
      throw new Error(`Non-200 response: ${await response.text()}`);
    }

    const responseData = await response.json();
    const base64Image = responseData.artifacts[0].base64;

    return res.status(200).json({
      success: true,
      photo: base64Image,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Something went wrong",
    });
  }
});

*/
