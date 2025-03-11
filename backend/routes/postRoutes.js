import express from "express";
import * as dotenv from "dotenv";
import Post from "../mongodb/models/post.js";
import cloudinary from "../config/cloudinary.js";

dotenv.config();

const router = express.Router();

// GET ALL POSTS
router.route("/").get(async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});

// CREATE A POST
router.route("/").post(async (req, res) => {
  try {
    const { name, prompt, photo } = req.body;

    // Input validation
    if (!name || !prompt || !photo) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, prompt and photo",
      });
    }

    // Upload to Cloudinary with error handling and options
    let photoUrl;
    try {
      photoUrl = await cloudinary.uploader.upload(photo, {
        folder: "fantasai",
        resource_type: "auto",
        timeout: 10000, // 10 seconds timeout
        quality: "auto:good", // Optimize quality
        fetch_format: "auto", // Auto-select best format
      });

      console.log("Successfully uploaded to Cloudinary");
    } catch (uploadError) {
      console.error("Cloudinary upload error:", uploadError);
      return res.status(500).json({
        success: false,
        message: "Failed to upload image to cloud storage",
      });
    }

    try {
      const newPost = await Post.create({
        name: name.trim(),
        prompt: prompt.trim(),
        photo: photoUrl.secure_url, // Use secure_url instead of url
      });

      console.log("Successfully created post in database");
      res.status(201).json({ success: true, data: newPost });
    } catch (dbError) {
      console.error("Database error:", dbError);

      // If post creation fails, try to delete the uploaded image
      if (photoUrl && photoUrl.public_id) {
        try {
          await cloudinary.uploader.destroy(photoUrl.public_id);
          console.log("Cleaned up Cloudinary image after failed post creation");
        } catch (cleanupError) {
          console.error("Failed to cleanup Cloudinary image:", cleanupError);
        }
      }

      throw dbError;
    }
  } catch (error) {
    console.error("Post creation error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while creating the post",
    });
  }
});

export default router;
