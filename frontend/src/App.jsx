import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import { ProtectedRoute } from "./components";
import { Home, CreatePost } from "./pages";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "./context/ThemeContext";

// Create a wrapper component for ToastContainer to access theme context
const ThemedToastContainer = () => {
  const { isDarkMode } = useTheme();

  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={isDarkMode ? "dark" : "light"}
    />
  );
};

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <div className="min-h-screen transition-colors duration-200 dark:bg-gray-900">
            <Header />
            <main className="w-full bg-[#f9fafe] dark:bg-gray-900 min-h-[calc(100vh-73px)]">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route
                  path="/create-post"
                  element={
                    <ProtectedRoute>
                      <CreatePost />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <ThemedToastContainer />
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
