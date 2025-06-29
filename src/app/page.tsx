"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";

interface Problem {
  contestId: number;
  index: string;
  name: string;
  rating: number;
  tags: string[];
}

// Official Codeforces Rating Color System
const getRatingColor = (rating: number) => {
  if (rating <= 1199) return "rating-gray";
  if (rating <= 1399) return "rating-green";
  if (rating <= 1599) return "rating-cyan";
  if (rating <= 1899) return "rating-blue";
  if (rating <= 2099) return "rating-purple";
  if (rating <= 2299) return "rating-orange";
  if (rating <= 2399) return "rating-orange-dark";
  if (rating <= 2599) return "rating-red";
  if (rating <= 2999) return "rating-red-dark";
  if (rating <= 3999) return "rating-red-legend";
  return "rating-eponym";
};

const getRatingTextColor = (rating: number) => {
  if (rating <= 1199) return "text-gray-500";
  if (rating <= 1399) return "text-green-500";
  if (rating <= 1599) return "text-cyan-500";
  if (rating <= 1899) return "text-blue-500";
  if (rating <= 2099) return "text-purple-500";
  if (rating <= 2299) return "text-orange-400";
  if (rating <= 2399) return "text-orange-500";
  if (rating <= 2599) return "text-red-500";
  if (rating <= 2999) return "text-red-600";
  if (rating <= 3999) return "text-red-700";
  return "text-yellow-400";
};

// Codeforces Rating Titles
const getRatingTitle = (rating: number) => {
  if (rating <= 1199) return "Newbie";
  if (rating <= 1399) return "Pupil";
  if (rating <= 1599) return "Specialist";
  if (rating <= 1899) return "Expert";
  if (rating <= 2099) return "Candidate Master";
  if (rating <= 2299) return "Master";
  if (rating <= 2399) return "International Master";
  if (rating <= 2599) return "Grandmaster";
  if (rating <= 2999) return "International Grandmaster";
  if (rating <= 3999) return "Legendary Grandmaster";
  return "eponym";
};

export default function Home() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(null);
  const [selectedEndDifficulty, setSelectedEndDifficulty] = useState<number | null>(null);
  const [tag, setTag] = useState<string>("");
  const [randomProblems, setRandomProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Validate form inputs
    if (!selectedDifficulty || !selectedEndDifficulty) {
      alert("Please select both starting and ending difficulty levels.");
      return;
    }
    
    if (selectedDifficulty > selectedEndDifficulty) {
      alert("Starting difficulty should be less than or equal to ending difficulty.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setRandomProblems([]); // Clear previous results
      
      const response = await fetch(
        `https://codeforces.com/api/problemset.problems?tags=${tag || ""}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

      if (data.status === "OK") {
        const filteredProblems = data.result.problems.filter(
          (problem: Problem) =>
            problem.rating >= selectedDifficulty &&
            problem.rating <= selectedEndDifficulty
        );

        if (filteredProblems.length > 0) {
          const selectedProblems: Problem[] = [];
          const problemSet = new Set();

          while (
            selectedProblems.length < 5 &&
            problemSet.size < filteredProblems.length
          ) {
            const randomIndex = Math.floor(
              Math.random() * filteredProblems.length
            );
            const randomProblem = filteredProblems[randomIndex];

            if (!problemSet.has(randomIndex)) {
              selectedProblems.push(randomProblem);
              problemSet.add(randomIndex);
            }
          }

          setRandomProblems(selectedProblems);
        } else {
          setError(`No problems found for the selected difficulty range (${selectedDifficulty}-${selectedEndDifficulty}). Try a different range.`);
        }
      } else {
        setError("Failed to fetch problems data from Codeforces API.");
      }
    } catch (error) {
      console.error("Error fetching problems:", error);
      setError("There was an error fetching the problems. Please check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDifficultyChange = (
    event: ChangeEvent<HTMLSelectElement>,
    isEndRange = false
  ) => {
    const value = parseInt(event.target.value, 10);
    isEndRange ? setSelectedEndDifficulty(value) : setSelectedDifficulty(value);
  };

  const handleTagChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setTag(event.target.value);
  };

  const openCodeforces = () => {
    window.open('https://codeforces.com', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-gray-100 flex flex-col text-base">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233B82F6' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      {/* Header Section */}
      <header className="relative z-10 header-glass">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-yellow-500 to-red-500 rounded-lg flex items-center justify-center logo-glow">
                <Image
                  src="/images.png"
                  width={48}
                  height={48}
                  alt="CF Logo"
                  className="rounded"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold cf-gradient-text">Codeforces Problem Finder</h1>
                <p className="text-xs text-gray-500">Powered by Codeforces API</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <a 
                href="https://codeforces.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-blue-600 via-yellow-500 to-red-600 hover:from-blue-700 hover:via-yellow-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 focus-ring"
              >
                BIKASH KUMAR YADAV
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 text-base">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12 hero-glow">
            <p className="text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Select random Codeforces problems based on your preferred topics and difficulty levels. Perfect for competitive programming practice.
            </p>
            <div className="flex flex-wrap justify-center  text-sm gap-4 text-gray-400 mb-8">
              <div className="difficulty-indicator bg-gray-900/30 text-gray-400 border border-gray-500/30">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span className="text-xs">≤ 1199</span>
              </div>
              <div className="difficulty-indicator bg-green-900/30 text-green-400 border border-green-500/30">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs">1200–1399</span>
              </div>
              <div className="difficulty-indicator bg-cyan-900/30 text-cyan-400 border border-cyan-500/30">
                <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                <span className="text-xs">1400–1599</span>
              </div>
              <div className="difficulty-indicator bg-blue-900/30 text-blue-400 border border-blue-500/30">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-xs">1600–1899</span>
              </div>
              <div className="difficulty-indicator bg-purple-900/30 text-purple-400 border border-purple-500/30">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-xs">1900–2099</span>
              </div>
              <div className="difficulty-indicator bg-orange-900/30 text-orange-400 border border-orange-500/30">
                <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                <span className="text-xs">2100–2299</span>
              </div>
              <div className="difficulty-indicator bg-orange-900/30 text-orange-500 border border-orange-500/30">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-xs">2300–2399</span>
              </div>
              <div className="difficulty-indicator bg-red-900/30 text-red-500 border border-red-500/30">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-xs">2400–2599</span>
              </div>
              <div className="difficulty-indicator bg-red-900/30 text-red-600 border border-red-600/30">
                <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                <span className="text-xs">2600–2999</span>
              </div>
              <div className="difficulty-indicator bg-red-900/30 text-red-700 border border-red-700/30">
                <div className="w-3 h-3 bg-red-700 rounded-full"></div>
                <span className="text-xs">3000–3999</span>
              </div>
              
            </div>
          </div>

          {/* Main Form Card */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="glass border border-gray-700/50 rounded-2xl p-8 shadow-2xl hover:shadow-blue-500/10 transition-shadow duration-300">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-100 mb-2">Customize Your Problem Search</h3>
                <p className="text-gray-400"></p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Tag Selection */}
                <div>
                  <label htmlFor="tag-select" className="block  font-medium text-gray-300 mb-3">
                    Select DSA Topics
                  </label>
                  <select
                    id="tag-select"
                    className="form-input w-full focus-ring text-sm"
                    onChange={handleTagChange}
                    value={tag}
                    aria-describedby="tag-help"
                  >
                    <option value="">All Topics (default)</option>
                    {[
                      "*special problem",
                      "2-sat",
                      "binary search",
                      "bitmasks",
                      "brute force",
                      "combinatorics",
                      "constructive algorithms",
                      "data structures",
                      "dfs and similar",
                      "divide and conquer",
                      "dp",
                      "dsu",
                      "expression parsing",
                      "fft",
                      "flow",
                      "games",
                      "geometry",
                      "graph matchings",
                      "graphs",
                      "greedy",
                      "hashing",
                      "implementation",
                      "interactive",
                      "math",
                      "matrices",
                      "number theory",
                      "probabilities",
                      "shortest paths",
                      "sortings",
                      "strings",
                      "ternary search",
                      "trees",
                      "two pointers",
                    ].map((tagOption) => (
                      <option value={tagOption} key={tagOption} className="bg-gray-700">
                        {tagOption}
                      </option>
                    ))}
                  </select>
                  <p id="tag-help" className="mt-2 text-sm text-gray-500">
                    
                  </p>
                </div>

                {/* Difficulty Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="start-difficulty" className="block  font-medium text-gray-300 mb-3">
                      Min Difficulty Rating
                    </label>
                    <select
                      id="start-difficulty"
                      className="form-input w-full focus-ring text-sm"
                      onChange={(event) => handleDifficultyChange(event, false)}
                      value={selectedDifficulty || ""}
                      required
                    >
                      <option value="" disabled >
                         Select Min Rating
                      </option>
                      {[
                        800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800,
                        1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000, 3100, 3200, 3300, 3400, 3500, 3600, 3700, 3800, 3900, 4000,
                      ].map((rating) => (
                        <option key={rating} value={rating} className="bg-gray-700">
                          {rating}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="end-difficulty" className="block  font-medium text-gray-300 mb-3">
                      Max Difficulty Rating
                    </label>
                    <select
                      id="end-difficulty"
                      className="form-input w-full focus-ring text-sm"
                      onChange={(event) => handleDifficultyChange(event, true)}
                      value={selectedEndDifficulty || ""}
                      required
                    >
                      <option value="" disabled >
                        Select Max Rating
                      </option>
                      {[
                        800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800,
                        1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000, 3100, 3200, 3300, 3400, 3500, 3600, 3700, 3800, 3900, 4000,
                      ].map((rating) => (
                        <option key={rating} value={rating} className="bg-gray-700">
                          {rating}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 via-yellow-500 to-red-600 hover:from-blue-700 hover:via-yellow-600 hover:to-red-700 disabled:from-gray-600 disabled:via-gray-600 disabled:to-gray-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:transform-none disabled:cursor-not-allowed focus-ring"
                  aria-describedby="button-help"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Fetching Problems...
                    </div>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Generate Random Problems
                    </>
                  )}
                </button>
                <p id="button-help" className="text-sm text-gray-500 text-center">
                  Click to fetch 5 random Codeforces problems based on your selected filters
                </p>
              </form>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center">
              <div className="inline-flex items-center px-6 py-3 glass border border-gray-700/50 rounded-xl">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400 mr-3"></div>
                <span className="text-gray-300">Fetching problems from Codeforces...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="max-w-2xl mx-auto mb-8">
              <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-6 text-center">
                <div className="text-red-400 font-medium mb-2 flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Error
                </div>
                <div className="text-red-300">{error}</div>
              </div>
            </div>
          )}

          {/* Results */}
          {randomProblems.length > 0 && (
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-100 mb-2">
                  Selected Problems
                </h2>
                <p className="text-gray-400">
                  Here are 5 random problems matching your criteria
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {randomProblems.map((problem, index) => (
                  <div
                    key={index}
                    className="group glass border border-gray-700/50 rounded-xl p-6 hover:border-blue-500/50 hover:bg-gray-800/70 transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 card-hover problem-card"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRatingColor(problem.rating)} ${getRatingTextColor(problem.rating)} rating-badge`}>
                        {problem.rating} ({getRatingTitle(problem.rating)})
                      </div>
                      <div className="text-xs text-gray-500 bg-gray-700/50 px-2 py-1 rounded">
                        #{index + 1}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-100 mb-3 line-clamp-3 group-hover:text-blue-300 transition-colors duration-200">
                      {problem.name}
                    </h3>
                    
                    <div className="mt-auto">
                      <a
                        href={`https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-full py-4 bg-gradient-to-r from-blue-600 via-yellow-500 to-red-600 hover:from-blue-700 hover:via-yellow-600 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus-ring"
                        aria-label={`Open problem ${problem.name} on Codeforces`}
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Solve Problem
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer Section */}
      <footer className="relative z-10 footer-glass mt-auto text-base">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Built with Love */}
            <div className="text-center md:text-left">
              <h4 className="text-white font-semibold mb-3 text-sm flex items-center justify-center md:justify-start">
                Built with ❤️ by <br/> Bikash Kumar Yadav
              </h4>
            </div>

            {/* Codeforces Rating System */}
            <div className="text-center">
              <h4 className="text-white font-semibold mb-3 text-sm flex items-center justify-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Codeforces Rating System
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <span className="text-gray-500">Newbie: ≤ 1199</span>
                <span className="text-green-500">Pupil: 1200–1399</span>
                <span className="text-cyan-500">Specialist: 1400–1599</span>
                <span className="text-blue-500">Expert: 1600–1899</span>
                <span className="text-purple-500">Candidate Master: 1900–2099</span>
                <span className="text-orange-400">Master: 2100–2299</span>
                <span className="text-orange-500">International Master: 2300–2399</span>
                <span className="text-red-500">Grandmaster: 2400–2599</span>
                <span className="text-red-600">International Grandmaster: 2600–2999</span>
                <span className="text-red-700">Legendary Grandmaster: 3000–3999</span>
                <span className="text-yellow-400 col-span-2">eponym: ≥ 4000</span>
              </div>
            </div>

            {/* Helpful Links */}
            <div className="text-center md:text-right">
              <h4 className="text-white font-semibold mb-3 text-sm flex items-center justify-center md:justify-end">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Helpful Links
              </h4>
              <div className="space-y-2">
                <a href="https://codeforces.com" target="_blank" rel="noopener noreferrer" className="block text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm">
                  Codeforces Home
                </a>
                <a href="https://codeforces.com/problemset" target="_blank" rel="noopener noreferrer" className="block text-gray-400 hover:text-yellow-400 transition-colors duration-200 text-sm">
                  Problemset
                </a>
                <a href="https://codeforces.com/contests" target="_blank" rel="noopener noreferrer" className="block text-gray-400 hover:text-red-400 transition-colors duration-200 text-sm">
                  Contests
                </a>
                <a href="https://codeforces.com/ratings" target="_blank" rel="noopener noreferrer" className="block text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm">
                  Ratings
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800/50 pt-4 text-center">
            <p className="text-gray-500">
              ©2025 All rights reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
