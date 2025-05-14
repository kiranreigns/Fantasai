import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="flex flex-col space-y-4">
          <h2 className="text-2xl font-bold text-center mb-4">
            {isResetPassword
              ? "Reset Password"
              : isSignUp
              ? "Sign Up"
              : "Sign In"}
          </h2>

          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}

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
                disabled={isLoading}
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
              disabled={isLoading}
            />
            {!isResetPassword && (
              <input
                type="password"
                placeholder="Password"
                className="border p-2 rounded"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required={!isResetPassword}
                disabled={isLoading}
              />
            )}
            <button
              type="submit"
              className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading
                ? "Processing..."
                : isResetPassword
                ? "Send Reset Link"
                : isSignUp
                ? "Sign Up"
                : "Login"}
            </button>
          </form>

          {!isResetPassword && (
            <>
              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-gray-300 flex-grow"></div>
                <span className="px-4 text-gray-500 text-sm">OR</span>
                <div className="border-t border-gray-300 flex-grow"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="flex items-center justify-center bg-white border border-gray-300 py-2 px-4 rounded hover:bg-gray-50"
                disabled={isLoading}
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  className="w-6 h-6 mr-2"
                />
                Sign in with Google
              </button>
            </>
          )}

          <div className="flex flex-col space-y-2">
            {!isResetPassword && (
              <button
                type="button"
                onClick={() => switchMode(isSignUp ? "signin" : "signup")}
                className="text-blue-500 hover:underline text-sm text-center"
                disabled={isLoading}
              >
                {isSignUp
                  ? "Already have an account? Log in"
                  : "Need an account? Sign up"}
              </button>
            )}

            <button
              type="button"
              onClick={() => switchMode(isResetPassword ? "signin" : "reset")}
              className="text-blue-500 hover:underline text-sm text-center"
              disabled={isLoading}
            >
              {isResetPassword ? "Back to login" : "Forgot password?"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
