import React, { useState } from "react";
import PropTypes from "prop-types";
import { downloadImage } from "../utils";
import ActionButtons from "./ActionButtons";
import { LuX } from "react-icons/lu";
const Card = ({
  _id,
  name = "Anonymous",
  prompt = "No prompt available",
  photo,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const toggleShare = (e) => {
    e.stopPropagation();
    setIsShareOpen(!isShareOpen);
  };

  const handleSharePlatform = async (e, platform) => {
    e.stopPropagation();
    const shareUrl = window.location.href;
    const text = `Check out this AI-generated image: ${prompt}`;

    // Try Web Share API first on supported devices
    if (navigator.share && platform === "native") {
      try {
        await navigator.share({
          title: "Share AI Generated Image",
          text: text,
          url: shareUrl,
        });
        return;
      } catch (err) {
        console.log("Error sharing:", err);
      }
    }

    let shareLink = "";
    switch (platform) {
      case "pinterest":
        shareLink = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
          shareUrl
        )}&media=${encodeURIComponent(photo)}&description=${encodeURIComponent(
          text
        )}`;
        break;
      case "instagram":
        alert(
          "Instagram sharing requires app integration, please download the image and share it manually"
        );
        break;
      case "twitter":
        shareLink = `https://x.com/intent/tweet?text=${encodeURIComponent(
          text
        )}&url=${encodeURIComponent(shareUrl)}`;
        break;
      default:
        return;
    }

    if (shareLink) {
      // Centered popup window with platform-specific dimensions
      const width = 550;
      const height = 420;
      const left = Math.floor((window.innerWidth - width) / 2);
      const top = Math.floor((window.innerHeight - height) / 2);

      window.open(
        shareLink,
        "_blank",
        `width=${width},height=${height},left=${left},top=${top}`
      );
    }
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    downloadImage(_id, photo);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        className="rounded-xl group relative 
        bg-white dark:bg-gray-800
        border border-gray-200 dark:border-gray-700
        shadow-card  dark:shadow-none
        hover:shadow-cardhover dark:hover:shadow-none
        transition-all duration-300 card"
      >
        {/* Entire card area (except action buttons) is clickable */}
        <div
          className="cursor-pointer"
          onClick={(e) => {
            // Ensure action buttons don't trigger modal
            if (!e.target.closest("button")) {
              openModal();
            }
          }}
        >
          {/* Image */}
          <img
            className="w-full h-auto object-cover rounded-xl"
            src={photo}
            alt={prompt}
            loading="lazy"
          />
        </div>

        {/* Hover overlay with gradient */}
        <div className="group-hover:flex flex-col hidden absolute inset-0 bg-gradient-to-b from-transparent via-[#10131f]/50 to-[#10131f]/90 rounded-xl">
          {/* Prompt text - clickable for modal */}
          <div
            className="flex-grow flex flex-col justify-end px-4 pb-2 cursor-pointer"
            onClick={(e) => {
              // Ensure action buttons don't trigger modal
              if (!e.target.closest("button")) {
                openModal();
              }
            }}
          >
            <p className="text-white text-sm sm:text-base line-clamp-2 break-words">
              {prompt}
            </p>
          </div>

          {/* Bottom container for user info and actions */}
          <div className="p-2 sm:p-3 md:p-4">
            {/* User info and actions container */}
            <div className="flex justify-between items-center">
              {/* User info */}
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full object-cover bg-indigo-500 flex justify-center items-center dark:text-black text-white text-[10px] sm:text-xs font-bold">
                  {name[0].toUpperCase()}
                </div>
                <p className="text-white text-xs sm:text-sm">{name}</p>
              </div>

              {/* Action buttons */}
              <ActionButtons
                isLiked={isLiked}
                isAnimating={isAnimating}
                isShareOpen={isShareOpen}
                handleLike={handleLike}
                toggleShare={toggleShare}
                handleSharePlatform={handleSharePlatform}
                handleDownload={handleDownload}
                size="small"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] bg-[#10131f] rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              className="absolute top-2 right-2 sm:top-4 sm:right-4 lg:text-black dark:lg:text-white text-white z-10 p-2"
              onClick={closeModal}
            >
              <span className="text-xl sm:text-2xl">
                <LuX />
              </span>
            </button>

            {/* Modal content */}
            <div className="flex flex-col lg:flex-row h-full">
              {/* Image container */}
              <div className="lg:w-2/3 h-[380px] md:h-[400px] lg:h-[600px]">
                <img
                  src={photo}
                  alt={prompt}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details container */}
              <div className="lg:w-1/3 p-4 sm:p-6 bg-gray-50 dark:bg-gray-800 flex flex-col max-h-[300px] lg:max-h-[600px]">
                <div className="flex-grow overflow-y-auto">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-indigo-500 flex justify-center items-center dark:text-black text-white text-xs sm:text-sm font-bold">
                      {name[0].toUpperCase()}
                    </div>
                    <p className="dark:text-white text-black text-base sm:text-lg">
                      {name}
                    </p>
                  </div>

                  <div className="mb-4 sm:mb-6">
                    <h3 className="dark:text-white text-black text-xs sm:text-sm mb-1 sm:mb-2">
                      Prompt:
                    </h3>
                    <p className="dark:text-gray-300 text-sm  text-gray-700 sm:text-base max-h-[150px] sm:max-h-[200px] pr-2">
                      {prompt}
                    </p>
                  </div>
                </div>

                {/* Action buttons in modal */}
                <ActionButtons
                  isLiked={isLiked}
                  isAnimating={isAnimating}
                  isShareOpen={isShareOpen}
                  handleLike={handleLike}
                  toggleShare={toggleShare}
                  handleSharePlatform={handleSharePlatform}
                  handleDownload={handleDownload}
                  size="large"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

Card.propTypes = {
  _id: PropTypes.string.isRequired,
  name: PropTypes.string,
  prompt: PropTypes.string,
  photo: PropTypes.string.isRequired,
};

export default Card;
