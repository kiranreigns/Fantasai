import { motion } from "framer-motion";

const Button = ({
  children,
  type = "button",
  disabled = false,
  onClick,
  className = "",
  variant = "",
}) => {
  const baseStyles =
    "py-2.5 rounded-xl text-white font-semibold transition-all duration-300 flex items-center justify-center";
  const variants = {
    "generate-button": `${
      disabled
        ? "bg-indigo-400 dark:bg-indigo-500"
        : "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
    }`,
    "share-button": `${
      disabled
        ? "bg-green-400 dark:bg-green-500"
        : "bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
    }`,
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className} ${
        disabled ? "cursor-not-allowed" : ""
      }`}
    >
      {children}
    </motion.button>
  );
};

export default Button;
