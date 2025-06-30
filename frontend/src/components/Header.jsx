import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { logoLight, logoDark } from "../assets";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";

const Header = () => {
  const { currentUser, signout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null); // Ref to track the profile menu
  const navigate = useNavigate(); // useNavigate hook for navigation between pages
  const location = useLocation(); // useLocation to track the current path

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false); // Close the profile menu if clicked outside
      }
    };

    // Add event listener when menu is open
    if (showProfileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // cleanup the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileMenu]);

  const handleCreateOrPostsclick = () => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    if (location.pathname === "/create-post") {
      navigate("/");
    } else {
      navigate("/create-post");
    }
  };

  // Function to determine button text based on current path
  const getButtonText = () => {
    return location.pathname === "/create-post" ? "Posts" : "Create";
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    navigate("/create-post");
  };

  const handleLogout = () => {
    signout();
    setShowProfileMenu(false);
    navigate("/");
  };

  return (
    <header className="w-full flex justify-between items-center bg-white dark:bg-gray-800 sm:px-8 px-4 py-4 border-b border-b-[#e6ebf4] dark:border-b-gray-700 transition-colors duration-200">
      <Link to="/">
        <img
          src={isDarkMode ? logoDark : logoLight}
          alt="logo"
          className="w-28 object-contain trasition-opacity duration-200"
        />
      </Link>

      <div className="flex items-center gap-4">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 sm:p-2.5 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
          aria-label="Toggle theme"
        >
          {isDarkMode ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-yellow-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          )}
        </button>

        {/* Create / Posts Button */}
        <button
          onClick={handleCreateOrPostsclick}
          className="bg-indigo-600 dark:bg-indigo-500 text-white font-semibold px-4 py-2 text-sm sm:text-base rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all"
        >
          {getButtonText()}
        </button>

        {!currentUser && (
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-gray-100 text-gray-700 font-semibold px-3 py-1.5 text-sm sm:text-base rounded-lg dark:border-white border-2 border-solid border-indigo-500 hover:bg-gray-200 transition-all"
          >
            Sign in
          </button>
        )}

        {currentUser && (
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center rounded-full overflow-hidden w-10 h-10  focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt="Profile"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                  {currentUser.displayName
                    ? currentUser.displayName.charAt(0).toUpperCase()
                    : "?"}
                </div>
              )}
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-5 py-2 w-60 bg-white rounded-lg shadow-xl z-20 border-solid border-2 border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {currentUser.displayName}
                  </p>
                  <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                    {currentUser.email}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm 
                    bg-white 
                    text-gray-700 
                    dark:bg-gray-800
                    dark:text-gray-200
                    dark:hover:text-red-500
                    hover:text-red-500
                    transition-all duration-200
                    group flex items-center gap-2"
                >
                  <svg
                    xmlns="https://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-600 dark:text-gray-100 
                      group-hover:text-red-500 dark:group-hover:text-red-500 
                      transition-colors duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign out
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </header>
  );
};

export default Header;
