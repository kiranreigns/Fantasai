/** @type {import('tailwindcss').Config} */
export const content = ["./src/**/*.{js,jsx}"];
export const darkMode = "class";
export const theme = {
  extend: {
    screens: {
      xs: "480px",
    },
    fontFamily: {
      sans: ["Roboto", "sans-serif"],
    },
    boxShadow: {
      card: "0 0 1px 0 rgba(189,192,207,0.06),0 10px 16px -1px rgba(189,192,207,0.2)",
      cardhover:
        "0 0 1px 0 rgba(189,192,207,0.06),0 10px 16px -1px rgba(189,192,207,0.4)",
    },
    // animations for loading
    animation: {
      spin: "spin 1s linear infinite",
      pulse: "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      shimmer: "shimmer 2s linear infinite",
      ellipsis: "ellipsis 1.4s infinite",
    },
    keyframes: {
      spin: {
        "0%": { transform: "rotate(0deg)" },
        "100%": { transform: "rotate(360deg)" },
      },
    },
  },
};
export const plugins = [];
