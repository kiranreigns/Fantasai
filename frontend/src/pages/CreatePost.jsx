// CreatePost.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { preview } from "../assets";
import { getRandomPrompt } from "../utils";
import { FormField, LoadingSpinner, Button } from "../components";

const API_ENDPOINTS = {
  generateImage: "http://localhost:8080/api/v1/fantasai",
  createPost: "http://localhost:8080/api/v1/post",
};

const initialFormState = {
  name: "",
  prompt: "",
  photo: "",
};

const CreatePost = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.prompt.trim()) newErrors.prompt = "Prompt is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateImage = async () => {
    if (!validateForm()) return;

    try {
      setGeneratingImg(true);
      const response = await fetch(API_ENDPOINTS.generateImage, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: form.prompt }),
      });

      if (!response.ok) throw new Error("Failed to generate image");

      const data = await response.json();
      setForm((prev) => ({
        ...prev,
        photo: `data:image/jpeg;base64,${data.photo}`,
      }));
    } catch (error) {
      alert(error.message);
    } finally {
      setGeneratingImg(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || !form.photo) {
      alert("Please generate an image before sharing");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.createPost, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Failed to create post");
      await response.json();
      navigate("/");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm((prev) => ({ ...prev, prompt: randomPrompt }));
  };

  const renderImagePreview = () => {
    if (generatingImg) {
      return (
        <div className="flex flex-col items-center justify-center">
          <LoadingSpinner
            size="h-12 w-12"
            className="mb-4 text-indigo-500 dark:text-indigo-400"
          />
          <p className="text-indigo-600 dark:text-indigo-400 font-semibold animate-pulse text-center">
            Generating your image...
          </p>
        </div>
      );
    }

    if (form.photo) {
      return (
        <motion.img
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          src={form.photo}
          alt={form.prompt}
          className="w-full h-full object-contain rounded-xl shadow-lg"
        />
      );
    }

    return (
      <div className="text-center">
        <img
          src={preview}
          alt="preview"
          className="w-48 h-48 mx-auto mb-4 opacity-40"
        />
        <p className="text-gray-500 dark:text-gray-400">
          Your AI-generated image will appear here
        </p>
      </div>
    );
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto px-4 py-12 bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col"
    >
      {/* Header section*/}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Create with Fantas
          <span className="text-indigo-600 dark:text-indigo-400">AI</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Unleash your creativity by generating imaginative AI images and
          sharing them with our vibrant community.
        </p>
      </motion.div>

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-2 gap-12 flex-grow"
      >
        {/* Left Column - Form Inputs */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="space-y-6"
        >
          {/* FormField components*/}
          <FormField
            labelName="Your Name"
            type="text"
            name="name"
            placeholder="Michael Scofield"
            value={form.name}
            handleChange={handleChange}
            error={errors.name}
          />

          <FormField
            labelName="Image Prompt"
            type="text"
            name="prompt"
            placeholder="A futuristic cityscape with floating skyscrapers"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
            error={errors.prompt}
          />

          <Button
            onClick={generateImage}
            disabled={generatingImg}
            className="w-full"
            variant="generate-button"
          >
            {generatingImg ? (
              <>
                <LoadingSpinner className="mr-2" />
                Generating...
              </>
            ) : (
              "Generate Image"
            )}
          </Button>
        </motion.div>

        {/* Right Column - Image Preview */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-col items-center justify-center"
        >
          <div className="w-full max-w-md aspect-square relative">
            <div
              className="w-full h-full border-2 border-dashed border-indigo-200 dark:border-indigo-800 
              rounded-2xl flex items-center justify-center bg-white dark:bg-gray-800 
              transition-all duration-300 hover:border-indigo-400 dark:hover:border-indigo-600"
            >
              {renderImagePreview()}
            </div>
          </div>

          {form.photo &&
            !generatingImg && ( // the share button container will only be visible when an image exists and is not being generated
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="mt-4 mb-2 text-center text-gray-600 dark:text-gray-400 max-w-md">
                  Cool! Now that your image has been generated you can share it
                  with the community
                </p>
                <Button
                  type="submit"
                  disabled={loading}
                  variant="share-button"
                  className="mt-6 w-full max-w-md"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner className="mr-2" />
                      Sharing...
                    </>
                  ) : (
                    "Share with Community"
                  )}
                </Button>
              </motion.div>
            )}
        </motion.div>
      </form>
    </motion.section>
  );
};

export default CreatePost;
