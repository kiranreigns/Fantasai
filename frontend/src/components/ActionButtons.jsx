import React from "react";
import PropTypes from "prop-types";
import { download } from "../assets";
import {
  FaHeart,
  FaRegHeart,
  FaPinterest,
  FaFacebookSquare,
} from "react-icons/fa";
import { FaXTwitter, FaRegShareFromSquare } from "react-icons/fa6";

const ActionButtons = ({
  isLiked,
  isAnimating,
  handleLike,
  handleSharePlatform,
  handleDownload,
  size = "small", // 'small' for card, 'large' for modal
}) => {
  const iconSizes = {
    small: "w-4 h-4 md:w-6 md:h-6",
    large: "w-7 h-7 sm:w-6 sm:h-6",
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

      <div className="relative group/share">
        {" "}
        {/* Use group naming strategy */}
        <button
          className="flex items-center hover:scale-110 transition-transform bg-transparent border-none outline-none p-0"
          aria-label="Share options"
        >
          <FaRegShareFromSquare
            className={`${iconSizes[size]} ${iconColorClasses}`}
          />
        </button>
        <div
          className={`absolute bottom-full right-0 mb-1 sm:mb-0.5 rounded-lg p-1 sm:p-2 
            ${size === "large" ? "bg-gray-800" : ""} 
            invisible opacity-0 group-hover/share:visible group-hover/share:opacity-100
            translate-y-1 group-hover/share:translate-y-0
            transition-all duration-200 ease-out
            will-change-transform will-change-opacity`}
          aria-hidden="true"
        >
          <div className="flex gap-1 sm:gap-2">
            <button
              onClick={(e) => handleSharePlatform(e, "pinterest")}
              className="text-red-600 hover:scale-110 transition-transform bg-transparent border-none outline-none p-0 will-change-transform"
              aria-label="Share on Pinterest"
            >
              <FaPinterest
                className={`${shareIconSizes[size]} transform-gpu`}
              />
            </button>
            <button
              onClick={(e) => handleSharePlatform(e, "instagram")}
              className="text-blue-500 hover:scale-110 transition-transform bg-transparent border-none outline-none p-0  will-change-transform"
              aria-label="Share on Facebook"
            >
              <FaFacebookSquare
                className={`${shareIconSizes[size]} transform-gpu`}
              />
            </button>
            <button
              onClick={(e) => handleSharePlatform(e, "twitter")}
              className="text-white hover:scale-110 transition-transform bg-transparent border-none outline-none p-0 will-change-transform"
              aria-label="Share on X"
            >
              <FaXTwitter className={`${shareIconSizes[size]} transform-gpu`} />
            </button>
          </div>
        </div>
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
  handleLike: PropTypes.func.isRequired,
  handleSharePlatform: PropTypes.func.isRequired,
  handleDownload: PropTypes.func.isRequired,
  size: PropTypes.oneOf(["small", "large"]),
};

export default ActionButtons;
