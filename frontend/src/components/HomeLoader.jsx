const HomeLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.7)]">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner with pulse effect */}
        <div className="relative">
          {/* Outer spinning ring */}
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>

          {/* Inner pulsing circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-8 h-8 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Loading text with shimmer effect */}
        <div className="relative">
          <p className="text-lg text-white font-medium">
            Loading posts
            <span className="animate-ellipsis">.</span>
            <span
              className="animate-ellipsis"
              style={{ animationDelay: "0.2s" }}
            >
              .
            </span>
            <span
              className="animate-ellipsis"
              style={{ animationDelay: "0.4s" }}
            >
              .
            </span>
          </p>

          {/* Shimmer effect */}
          <div className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        </div>
      </div>
    </div>
  );
};

export default HomeLoader;
