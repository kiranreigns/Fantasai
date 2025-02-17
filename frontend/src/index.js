// src/index.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Initialize Google Auth
window.gapi.load("auth2", () => {
  window.gapi.auth2.init({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  });
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
