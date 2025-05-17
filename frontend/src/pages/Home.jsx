import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Card, FormField, HomeLoader } from "../components";
import FantasaiIntro from "../components/FantasaiIntro";

const RenderCards = ({ data, title }) => {
  RenderCards.propTypes = {
    data: PropTypes.array,
    title: PropTypes.string.isRequired,
  };

  if (data?.length > 0) {
    return data.map((post) => <Card key={post._id} {...post} />);
  }

  return (
    <h2 className="mt-5 font-bold text-[#6449ff] text-xl uppercase">{title}</h2>
  );
};
const Home = () => {
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [noResults, setNoResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Check scroll position to show/hide button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/post`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const result = await response.json();
        setAllPosts(result.data.reverse()); // show the newest post on the top
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // handleSearchChange
  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    const searchTerm = e.target.value;
    setSearchText(searchTerm);
    setIsSearching(true);

    setSearchTimeout(
      setTimeout(() => {
        if (!searchTerm.trim()) {
          setSearchResults(allPosts);
          setNoResults(false);
          setIsSearching(false);
          return;
        }

        const normalizedSearchTerm = searchTerm.trim().toLowerCase();
        const searchWords = normalizedSearchTerm.split(/\s+/);

        try {
          const searchResult = allPosts
            .filter((item) => {
              const normalizedName = item.name.toLowerCase();
              const normalizedPrompt = item.prompt.toLowerCase();

              // Enhanced matching logic
              return searchWords.every((word) => {
                const matchesName = normalizedName.includes(word);
                const matchesPrompt = normalizedPrompt.includes(word);

                // Add fuzzy matching for typos
                const fuzzyMatch = (text, searchWord) => {
                  const maxDistance = Math.floor(searchWord.length / 3); // Allow 1/3 character differences
                  let distance = 0;
                  for (let i = 0; i < searchWord.length; i++) {
                    if (text[i] !== searchWord[i]) distance++;
                    if (distance > maxDistance) return false;
                  }
                  return true;
                };

                return (
                  matchesName ||
                  matchesPrompt ||
                  fuzzyMatch(normalizedName, word) ||
                  fuzzyMatch(normalizedPrompt, word)
                );
              });
            })
            .sort((a, b) => {
              const getScore = (item) => {
                let score = 0;
                const normalizedName = item.name.toLowerCase();
                const normalizedPrompt = item.prompt.toLowerCase();

                searchWords.forEach((word) => {
                  // Exact matches
                  if (normalizedName === word || normalizedPrompt === word)
                    score += 5;
                  // Starts with word
                  if (
                    normalizedName.startsWith(word) ||
                    normalizedPrompt.startsWith(word)
                  )
                    score += 3;
                  // Contains word
                  if (
                    normalizedName.includes(word) ||
                    normalizedPrompt.includes(word)
                  )
                    score += 2;
                  // Fuzzy matches
                  if (
                    normalizedName
                      .split(" ")
                      .some((term) => term.includes(word)) ||
                    normalizedPrompt
                      .split(" ")
                      .some((term) => term.includes(word))
                  )
                    score += 1;
                });

                return score;
              };

              return getScore(b) - getScore(a);
            });

          setSearchResults(searchResult);
          setNoResults(searchResult.length === 0);
        } catch (error) {
          console.error("Search error:", error);
          setSearchResults([]);
          setNoResults(true);
        } finally {
          setIsSearching(false);
        }
      }, 500)
    );
  };

  return (
    <>
      <FantasaiIntro />
      <section className="max-w-7xl mx-auto">
        <div>
          <h2 className="text-[2rem] font-bold text-[#222328] dark:text-gray-200 mb-4">
            The Community Gallery
          </h2>
          <p className="mt-2 text-[#666e75] text-[18px] max-w [500px] dark:text-gray-400">
            Browse through a collection of imaginative and visually stunning
            images generated by Fantasai
          </p>
        </div>

        <div className="mt-16 ">
          <FormField
            labelName="Search posts"
            type="text"
            name="text"
            placeholder="Search posts"
            value={searchText}
            handleChange={handleSearchChange}
          />
        </div>

        <div className="mt-10">
          {loading ? (
            <div className="flex justify-center items-center">
              <HomeLoader />
            </div>
          ) : (
            <>
              {searchText && (
                <h2 className="font-medium text-gray-600 dark:text-gray-400 text-xl mb-3">
                  Showing results for{" "}
                  <span className="text-[#222328] dark:text-gray-200">
                    {searchText}
                  </span>
                </h2>
              )}

              <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-2 gap-3">
                {searchText ? (
                  <RenderCards
                    data={searchResults}
                    title="No search results found"
                  />
                ) : (
                  <RenderCards data={allPosts} title="No posts found" />
                )}
              </div>
            </>
          )}
        </div>
      </section>
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-all duration-300 z-50"
          aria-label="Scroll to top"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>
      )}
    </>
  );
};

export default Home;
