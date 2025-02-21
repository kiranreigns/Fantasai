import React from "react";
import PropTypes from "prop-types";
import { download } from "../assets";
import { FaHeart, FaRegHeart, FaPinterest, FaInstagram } from "react-icons/fa";
import { FaXTwitter, FaRegShareFromSquare } from "react-icons/fa6";

const ActionButtons = ({
  isLiked,
  isAnimating,
  isShareOpen,
  handleLike,
  toggleShare,
  handleSharePlatform,
  handleDownload,
  size = "small", // 'small' for card, 'large' for modal
}) => {
  const iconSizes = {
    small: "w-4 h-4 md:w-5 md:h-5",
    large: "w-5 h-5 sm:w-6 sm:h-6",
  };

  const shareIconSizes = {
    small: "w-3 h-3 sm:w-4 sm:h-4",
    large: "w-4 h-4 sm:w-5 sm:h-5",
  };

  // Add dark mode specific classes for icons
  const iconColorClasses =
    size === "large" ? "text-gray-800 dark:text-white" : "text-white";

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <button
        onClick={handleLike}
        className="flex items-center hover:scale-110 transition-transform duration-200"
        aria-label={isLiked ? "Unlike" : "Like"}
      >
        {size === "small" ? (
          <div
            className={`transform ${
              isAnimating ? "scale-125" : "scale-100"
            } transition-all duration-300`}
          >
            {isLiked ? (
              <FaHeart
                className={`${iconSizes[size]} text-red-500 
                ${isAnimating ? "animate-pulse" : ""}`}
              />
            ) : (
              <FaRegHeart className={`${iconSizes[size]} text-white`} />
            )}
          </div>
        ) : isLiked ? (
          <FaHeart className={`${iconSizes[size]} text-red-500`} />
        ) : (
          <FaRegHeart className={`${iconSizes[size]} ${iconColorClasses}`} />
        )}
      </button>

      <div className="relative">
        <button
          onClick={toggleShare}
          className="flex items-center hover:scale-110 transition-transform bg-transparent border-none outline-none p-0"
        >
          <FaRegShareFromSquare
            className={`${iconSizes[size]} ${iconColorClasses}`}
          />
        </button>

        {isShareOpen && (
          <div
            className={`absolute bottom-full right-0 mb-1 sm:mb-0.5 rounded-lg p-1 sm:p-2 ${
              size === "large" ? "bg-gray-800" : ""
            }`}
          >
            <div className="flex gap-1 sm:gap-2">
              <button
                onClick={(e) => handleSharePlatform(e, "pinterest")}
                className="text-red-600 hover:scale-110 transition-transform bg-transparent border-none outline-none p-0"
              >
                <FaPinterest className={shareIconSizes[size]} />
              </button>
              <button
                onClick={(e) => handleSharePlatform(e, "instagram")}
                className="text-pink-600 hover:scale-110 transition-transform bg-transparent border-none outline-none p-0"
              >
                <FaInstagram className={shareIconSizes[size]} />
              </button>
              <button
                onClick={(e) => handleSharePlatform(e, "twitter")}
                className="text-white hover:scale-110 transition-transform bg-transparent border-none outline-none p-0"
              >
                <FaXTwitter className={shareIconSizes[size]} />
              </button>
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleDownload}
        className="outline-none bg-transparent border-none hover:scale-110 transition-transform p-0"
      >
        <img
          src={download}
          alt="download"
          className={`${iconSizes[size]} object-contain ${
            size === "large" ? "dark:invert" : "invert"
          }`}
        />
      </button>
    </div>
  );
};

ActionButtons.propTypes = {
  isLiked: PropTypes.bool.isRequired,
  isAnimating: PropTypes.bool.isRequired,
  isShareOpen: PropTypes.bool.isRequired,
  handleLike: PropTypes.func.isRequired,
  toggleShare: PropTypes.func.isRequired,
  handleSharePlatform: PropTypes.func.isRequired,
  handleDownload: PropTypes.func.isRequired,
  size: PropTypes.oneOf(["small", "large"]),
};

export default ActionButtons;
