import React, { useState, useEffect } from "react";

const AuthModal = ({ isOpen, onClose, onSuccess }) => {
  useEffect(() => {
    // Initialize Google API client
    const loadGoogleAuth = async () => {
      try {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://accounts.google.com/gsi/client";
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });

        const client = google.accounts.oauth2.initTokenClient({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          scope: "email profile",
          redirect_uri: window.location.origin, // Dynamically set the current origin
          callback: async (response) => {
            if (response.access_token) {
              const userInfo = await fetch(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                {
                  headers: {
                    Authorization: `Bearer ${response.access_token}`,
                  },
                }
              ).then((res) => res.json());

              if (userInfo.email) {
                localStorage.setItem("token", response.access_token);
                onSuccess(userInfo);
              }
            }
          },
        });

        // Store the client instance for later use
        window.googleAuthClient = client;
        console.log("Google Auth initialized successfully");
      } catch (error) {
        console.error("Error initializing Google Auth:", error);
      }
    };

    loadGoogleAuth();
  }, []);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/auth/${isSignUp ? "signup" : "login"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        onSuccess();
      } else {
        const error = await response.json();
        alert(error.message || "Authentication failed");
      }
    } catch (error) {
      console.error("Auth error:", error);
      alert("Authentication failed");
    }
  };

  const handleGoogleSignIn = () => {
    if (!window.googleAuthClient) {
      console.error("Google Auth client not initialized");
      return;
    }

    try {
      // Token handling is done in the callback defined in useEffect
      window.googleAuthClient.requestAccessToken();
    } catch (error) {
      console.error("Google Sign-In error:", error);
      alert("Google Sign-In failed: " + (error.message || "Unknown error"));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="flex flex-col space-y-4">
          <h2 className="text-2xl font-bold text-center mb-4">
            {isSignUp ? "Sign Up" : "Login"}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            {isSignUp && (
              <input
                type="text"
                placeholder="Name"
                className="border p-2 rounded"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required={isSignUp}
              />
            )}
            <input
              type="email"
              placeholder="Email"
              className="border p-2 rounded"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="border p-2 rounded"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              {isSignUp ? "Sign Up" : "Login"}
            </button>
          </form>

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-gray-300 flex-grow"></div>
            <span className="px-4 text-gray-500 text-sm">OR</span>
            <div className="border-t border-gray-300 flex-grow"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="flex items-center justify-center bg-white border border-gray-300 py-2 px-4 rounded hover:bg-gray-50"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-6 h-6 mr-2"
            />
            Sign in with Google
          </button>

          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-500 hover:underline text-sm text-center"
          >
            {isSignUp
              ? "Already have an account? Log in"
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
