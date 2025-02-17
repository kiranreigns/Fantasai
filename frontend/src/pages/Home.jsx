import React from "react";
import { useState, useEffect } from "react";
import { Card, FormField, HomeLoader } from "../components";

const RenderCards = ({ data, title }) => {
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

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);

      try {
        const response = await fetch("http://localhost:8080/api/v1/post", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

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
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-exrabold text-[#222328] text-[32px] dark:text-gray-200">
          The Community Showcase
        </h1>
        <p className="mt-2 text-[#666e75] text-[16px] max-w [500px] dark:text-gray-400">
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
  );
};

export default Home;
