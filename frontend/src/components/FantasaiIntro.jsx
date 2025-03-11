import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";

const FantasaiIntro = () => {
  const shimmerRef = useRef(null);
  const { currentUser } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const shimmerElement = shimmerRef.current;
    let animationFrame;

    const animateShimmer = () => {
      const keyframes = [{ left: "-100%" }, { left: "100%" }];

      const options = {
        duration: 2000,
        iterations: Infinity,
        easing: "linear",
      };

      if (shimmerElement) {
        shimmerElement.animate(keyframes, options);
      }
    };

    animateShimmer();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  const handleCreateClick = () => {
    if (currentUser) {
      navigate("/create-post");
    } else {
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    navigate("/create-post");
  };

  return (
    <>
      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center py-8 px-4 md:px-8 rounded-xl mb-6 text-center w-full mx-auto">
        <h1
          className="text-4xl md:text-6xl lg:text-[5rem] font-[900] tracking-[-2px] m-0 mb-4 md:mb-6 bg-gradient-to-r from-[#FF6B6B] via-[#6B5BFF] to-[#39C2FF] bg-clip-text text-transparent relative inline-block"
          style={{ textShadow: "0 4px 12px rgba(107, 91, 255, 0.2)" }}
        >
          Fantasai
          {/* Shimmer effect */}
          <div
            ref={shimmerRef}
            className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
          />
        </h1>

        <p className="text-lg md:text-xl lg:text-[1.5rem] mb-6 md:mb-8 text-[#555] font-light dark:text-gray-300 max-w-2xl">
          Where Imagination Meets Technology to Create Visual Wonders
        </p>

        <button
          onClick={handleCreateClick}
          className="bg-gradient-to-r from-[#FF6B6B] to-[#6B5BFF] text-white border-0 py-3 px-6 md:py-4 md:px-8 text-base md:text-[1.2rem] rounded-[50px] cursor-pointer transition-all duration-300 ease shadow-[0_4px_15px_rgba(107,91,255,0.3)] mb-6 md:mb-8 hover:translate-y-[-3px] hover:shadow-[0_7px_20px_rgba(107,91,255,0.4)]"
        >
          Start Creating Now
        </button>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};

export default FantasaiIntro;
