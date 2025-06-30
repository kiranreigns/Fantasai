import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";

const FantasaiIntro = () => {
  const { currentUser } = useAuth(); // Get the current user from AuthContext
  const navigate = useNavigate(); // useNavigate hook for navigation between pages
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const controls = useAnimation();

  // Mock functions for demo purposes

  const handleCreateClick = () => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    } else {
      navigate("/create-post");
    }
  };
  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    navigate("/create-post");
  };

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      return () => container.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  // Floating particles animation
  const particleVariants = {
    animate: {
      y: [0, -20, 0],
      x: [0, 10, -10, 0],
      rotate: [0, 180, 360],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Generate particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 8 + 4,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 3,
  }));

  return (
    <div className="w-full min-h-screen relative overflow-hidden lg:mb-10">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[#10131f]">
        {/* Dynamic gradient overlay */}
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
              rgba(255, 107, 107, 0.3) 0%, 
              rgba(79, 70, 229, 0.2) 25%, 
              rgba(57, 194, 255, 0.1) 50%, 
              transparent 70%)`,
          }}
        />

        {/* Animated grid pattern */}
        <motion.div
          className="absolute inset-0 opacity-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 2 }}
        >
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(79, 70, 229, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(79, 70, 229, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />
        </motion.div>

        {/* Floating particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 opacity-60"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            variants={particleVariants}
            animate="animate"
            transition={{ delay: particle.delay }}
          />
        ))}

        {/* Pulsing orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-gradient-to-r from-pink-500 to-indigo-500 opacity-20 blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 opacity-20 blur-xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      {/* Main Content */}
      <div
        ref={containerRef}
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 md:px-8 text-center mt-8 mb-8 md:mb-0 md:mt-0"
      >
        {/* Logo/Title with enhanced animations */}
        <motion.div
          className="relative mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.h1
            className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent relative"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              backgroundSize: "200% 200%",
              filter: "drop-shadow(0 0 20px rgba(79, 70, 229, 0.3))",
            }}
          >
            Fantasai
            {/* Glowing effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent opacity-50 blur-sm"
              animate={{
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              Fantasai
            </motion.div>
          </motion.h1>

          {/* Animated underline */}
          <motion.div
            className="absolute -bottom-4 left-1/2 h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent"
            initial={{ width: 0, x: "-50%" }}
            animate={{ width: "80%", x: "-50%" }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="text-xl md:text-2xl lg:text-3xl mb-12 text-gray-300 font-light max-w-4xl leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Where Imagination Meets Technology to Create{" "}
          <motion.span
            className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent font-semibold"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ backgroundSize: "200% 200%" }}
          >
            Visual Wonders
          </motion.span>
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.button
            onClick={handleCreateClick}
            className="relative px-8 py-3 text-lg md:px-12 md:py-4 md:text-xl font-bold text-white bg-gradient-to-r from-[#FF6B6B] to-[#5a49f7] rounded-full overflow-hidden group shadow-2xl"
            whileHover={{
              boxShadow: "0 20px 40px rgba(79, 70, 229, 0.4)",
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Button background animation */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[
#FF6B6B] to-[
#6B5BFF] opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.3 }}
            />

            {/* Button text */}
            <span className="relative z-10">Start Creating Now</span>

            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 1,
                ease: "easeInOut",
              }}
            />
          </motion.button>
        </motion.div>

        {/* Feature highlights */}
        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          {[
            { icon: "✨", title: "AI-Powered", desc: "Advanced Models" },
            {
              icon: "🎨",
              title: "Creative Tools",
              desc: "Unlimited Possibilities",
            },
            { icon: "⚡", title: "Lightning Fast", desc: "Instant results" },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="relative p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 + index * 0.2 }}
              whileHover={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                scale: 1.05,
              }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default FantasaiIntro;
