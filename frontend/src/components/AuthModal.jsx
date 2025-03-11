import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { googleProvider } from "../../config/firebase";

const AuthModal = ({ isOpen, onClose, onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  // google sign-in
  const { signin } = useAuth();

  // Early return if modal isn't open
  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    try {
      await signin(googleProvider);
      onClose(); // Close modal after successful sign-in
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  // Regular Email/Password Authentication
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = isSignUp
        ? {
            name: formData.name,
            email: formData.email,
            password: formData.password,
          } // For signup
        : { email: formData.email, password: formData.password }; // For login

      const response = await fetch(
        `http://localhost:8080/api/v1/auth/${isSignUp ? "signup" : "login"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Authentication failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      if (onSuccess) onSuccess(); // Call the success callback
    } catch (error) {
      console.error("Auth error:", error);
      alert(error.message);
    }
  };

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
