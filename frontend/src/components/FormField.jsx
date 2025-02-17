// components/FormField.jsx
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const FormField = ({
  labelName,
  type,
  name,
  placeholder,
  value,
  handleChange,
  isSurpriseMe,
  handleSurpriseMe,
  error,
}) => {
  const textareaRef = useRef(null);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (name === "prompt") {
      adjustTextareaHeight();
    }
  }, [value, name]);

  return (
    <motion.div
      className="relative w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-2">
        <label
          htmlFor={name}
          className="block text-base font-semibold text-gray-800 dark:text-gray-200 tracking-wide"
        >
          {labelName}
        </label>

        {isSurpriseMe && (
          <motion.button
            type="button"
            onClick={handleSurpriseMe}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-xs font-medium px-3 py-1 
              bg-indigo-50 dark:bg-indigo-900/30 
              text-indigo-600 dark:text-indigo-400 
              rounded-full 
              hover:bg-indigo-100 dark:hover:bg-indigo-900/50 
              transition-colors duration-300 
              flex items-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-sparkle"
            >
              <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.937A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z" />
            </svg>
            Surprise Me
          </motion.button>
        )}
      </div>

      <div className="relative">
        {name === "prompt" ? (
          <textarea
            ref={textareaRef}
            id={name}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={(e) => {
              handleChange(e);
              adjustTextareaHeight();
            }}
            required
            className={`block w-full px-4 py-3 text-sm 
              text-gray-800 dark:text-gray-200 
              bg-white dark:bg-gray-800 
              border rounded-xl 
              outline-none
              transition-all duration-300 
              focus:ring-2 focus:ring-indigo-400 focus:border-transparent
              placeholder:text-gray-400 dark:placeholder:text-gray-500
              ${
                error
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-700"
              }
              min-h-[120px] resize-none`}
            style={{
              overflow: "hidden",
            }}
          />
        ) : (
          <input
            type={type}
            id={name}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            required
            className={`block w-full px-4 py-3 text-sm 
              text-gray-800 dark:text-gray-200 
              bg-white dark:bg-gray-800 
              border rounded-xl 
              outline-none
              transition-all duration-300 
              focus:ring-2 focus:ring-indigo-400 focus:border-transparent 
              placeholder:text-gray-400 dark:placeholder:text-gray-500
              ${
                error
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-700"
              }`}
          />
        )}
        {error && (
          <p className="absolute text-xs text-red-500 dark:text-red-400 mt-1 pl-1">
            {error}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default FormField;
