// CreatePost.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { preview } from "../assets";
import { getRandomPrompts } from "../utils";
import { FormField } from "../components";

const CreatePost = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    prompt: "",
    photo: "",
  });
  const [errors, setErrors] = useState({});
  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

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
      const response = await fetch("http://localhost:8080/api/v1/fantasai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: form.prompt }),
      });

      if (!response.ok)
        throw new Error(responseData.error || "Failed to generate image");

      const data = await response.json();
      setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` }); // Set the generated image
    } catch (error) {
      alert(error.message);
    } finally {
      setGeneratingImg(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (form.prompt && form.photo) {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8080/api/v1/post", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        if (!response.ok) throw new Error("Failed to create post");

        await response.json();
        alert("Post created successfully");
        navigate("/");
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please generate an image before sharing");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompts(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto px-4 py-12 bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col"
    >
      {/* Header */}
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

          <motion.button
            type="button"
            onClick={generateImage}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={generatingImg}
            className={`w-full py-2.5 rounded-xl text-white font-semibold 
            transition-all duration-300 flex items-center justify-center
            ${
              generatingImg
                ? "bg-indigo-400 dark:bg-indigo-500 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            }`}
          >
            {generatingImg ? (
              <>
                <svg
                  className="animate-spin mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating...
              </>
            ) : (
              "Generate Image"
            )}
          </motion.button>
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
              {generatingImg ? (
                <div className="flex flex-col items-center justify-center">
                  <svg
                    className="animate-spin mb-4 h-12 w-12 text-indigo-500 dark:text-indigo-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <p className="text-indigo-600 dark:text-indigo-400 font-semibold animate-pulse text-center">
                    Generating your image...
                  </p>
                </div>
              ) : form.photo ? (
                <motion.img
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  src={form.photo}
                  alt={form.prompt}
                  className="w-full h-full object-contain rounded-xl shadow-lg"
                />
              ) : (
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
              )}
            </div>
          </div>

          {form.photo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="mt-4 mb-2 text-center text-gray-600 dark:text-gray-400 max-w-md">
                Cool! Now that your image has been generated you can share it
                with the community if you want
              </p>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={loading}
                className={`mt-6 w-full max-w-md py-2.5 px-5 rounded-xl text-white font-semibold 
                transition-all duration-300 flex items-center justify-center
                ${
                  loading
                    ? "bg-green-400 dark:bg-green-500 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                }`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sharing...
                  </>
                ) : (
                  "Share with Community"
                )}
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </form>
    </motion.section>
  );
};

export default CreatePost;
