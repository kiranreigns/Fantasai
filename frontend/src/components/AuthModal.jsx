import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const AuthModal = ({ isOpen, onClose, onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const { signinWithGoogle, signup, signin, resetPassword } = useAuth();

  // Early return if modal isn't open
  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signinWithGoogle();
      onClose(); // Close modal after successful sign-in
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Firebase Email/Password Authentication
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isResetPassword) {
        await resetPassword(formData.email);
        toast.success("Password reset email sent! Check your inbox.");
        setIsResetPassword(false);
        resetForm(); // Reset form after successful password reset
      } else if (isSignUp) {
        await signup(formData.email, formData.password, formData.name);
        toast.success("Account created successfully!");
        resetForm(); // Reset form after successful signup
      } else {
        await signin(formData.email, formData.password);
        resetForm(); // Reset form after successful login
      }

      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Auth error:", error);

      // Handle Firebase auth errors
      switch (error.code) {
        case "auth/email-already-in-use":
          setError("This email is already in use. Try logging in instead.");
          break;
        case "auth/invalid-email":
          setError("Invalid email address.");
          break;
        case "auth/weak-password":
          setError("Password should be at least 6 characters.");
          break;
        case "auth/user-not-found":
        case "auth/wrong-password":
          setError("Invalid email or password.");
          break;
        default:
          setError(error.message || "Authentication failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      name: "",
    });
    setError(null);
  };

  const switchMode = (mode) => {
    resetForm();
    if (mode === "reset") {
      setIsResetPassword(true);
      setIsSignUp(false);
    } else {
      setIsResetPassword(false);
      setIsSignUp(mode === "signup");
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0" onClick={onClose}></div>

      <motion.div
        className="relative bg-white dark:bg-slate-800 rounded-2xl dark:border dark:border-indigo-500/30 p-8 max-w-md w-full mx-4 shadow-xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
      >
        <div className="flex flex-col space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-4">
            {isResetPassword
              ? "Reset Password"
              : isSignUp
              ? "Sign Up"
              : "Sign In"}
          </h2>

          {error && (
            <motion.div
              className="bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-500/50 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative"
              role="alert"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <span className="block sm:inline">{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            {isSignUp && (
              <motion.input
                type="text"
                placeholder="Name"
                className="border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 p-3 rounded-lg focus:border-blue-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-blue-500 dark:focus:ring-indigo-500 focus:outline-none transition-colors"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required={isSignUp}
                disabled={isLoading}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              />
            )}

            <motion.input
              type="email"
              placeholder="Email"
              className="border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 p-3 rounded-lg focus:border-blue-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-blue-500 dark:focus:ring-indigo-500 focus:outline-none transition-colors"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              disabled={isLoading}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: isSignUp ? 0.2 : 0.1 }}
            />

            {!isResetPassword && (
              <motion.input
                type="password"
                placeholder="Password"
                className="border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 p-3 rounded-lg focus:border-blue-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-blue-500 dark:focus:ring-indigo-500 focus:outline-none transition-colors"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required={!isResetPassword}
                disabled={isLoading}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: isSignUp ? 0.3 : 0.2 }}
              />
            )}

            <motion.button
              type="submit"
              className={`bg-blue-500 dark:bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-blue-600 dark:hover:bg-indigo-700 transition-colors font-medium ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: isSignUp ? 0.4 : 0.3 }}
            >
              {isLoading
                ? "Processing..."
                : isResetPassword
                ? "Send Reset Link"
                : isSignUp
                ? "Sign Up"
                : "Sign In"}
            </motion.button>
          </form>

          {!isResetPassword && (
            <>
              <motion.div
                className="relative flex items-center justify-center my-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="border-t border-gray-300 dark:border-slate-600 flex-grow"></div>
                <span className="px-4 text-gray-500 dark:text-gray-400 text-sm">
                  OR
                </span>
                <div className="border-t border-gray-300 dark:border-slate-600 flex-grow"></div>
              </motion.div>

              <motion.button
                type="button"
                onClick={handleGoogleSignIn}
                className="flex items-center justify-center bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors font-medium"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  className="w-5 h-5 mr-3"
                />
                Sign in with Google
              </motion.button>
            </>
          )}

          <motion.div
            className="flex flex-col space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {!isResetPassword && (
              <button
                type="button"
                onClick={() => switchMode(isSignUp ? "signin" : "signup")}
                className="text-blue-500 dark:text-indigo-400 hover:text-blue-600 dark:hover:text-indigo-300 hover:underline text-sm text-center transition-colors"
                disabled={isLoading}
              >
                {isSignUp
                  ? "Already have an account? Sign in"
                  : "Need an account? Sign up"}
              </button>
            )}

            <button
              type="button"
              onClick={() => switchMode(isResetPassword ? "signin" : "reset")}
              className="text-blue-500 dark:text-indigo-400 hover:text-blue-600 dark:hover:text-indigo-300 hover:underline text-sm text-center transition-colors"
              disabled={isLoading}
            >
              {isResetPassword ? "Back to sign in" : "Forgot password?"}
            </button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AuthModal;
