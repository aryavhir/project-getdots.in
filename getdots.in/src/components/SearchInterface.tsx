import { useState, useEffect, useRef } from "react";
import { IoSearch } from "react-icons/io5";
import { HiOutlineExternalLink, HiOutlineLink } from "react-icons/hi";
import searchData from "../data/searchData.json";
import "./SearchInterface.css";

interface SearchResult {
  id: string;
  name: string;
  type: string;
  [key: string]: any;
}

const SearchInterface = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [settingsClicked, setSettingsClicked] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [filters, setFilters] = useState({
    Files: true,
    People: true,
    Chats: false,
    Lists: false,
  });

  const loadingTimeoutRef = useRef<number | null>(null);
  const closingTimeoutRef = useRef<number | null>(null);

  const allResults = [
    ...searchData.people,
    ...searchData.files,
    ...searchData.folders,
  ];

  const getFilteredResults = () => {
    if (!searchQuery) return [];

    let results = allResults.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // Apply tab filter
    if (activeTab === "Files") {
      results = results.filter(
        (item) =>
          item.type === "image" ||
          item.type === "video" ||
          item.type === "folder",
      );
    } else if (activeTab === "People") {
      results = results.filter((item) => item.type === "person");
    } else if (activeTab === "Chats") {
      results = []; // No chat data currently available
    } else if (activeTab === "All") {
      // Apply toggle filters for All tab
      if (!filters.Files) {
        results = results.filter(
          (item) =>
            item.type !== "image" &&
            item.type !== "video" &&
            item.type !== "folder",
        );
      }
      if (!filters.People) {
        results = results.filter((item) => item.type !== "person");
      }
    }

    return results;
  };

  const getTabCounts = () => {
    if (!searchQuery) return { All: 0, Files: 0, People: 0 };

    const searchResults = allResults.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // For All tab, apply toggle filters
    let allFilteredResults = searchResults;
    if (!filters.Files) {
      allFilteredResults = allFilteredResults.filter(
        (item) =>
          item.type !== "image" &&
          item.type !== "video" &&
          item.type !== "folder",
      );
    }
    if (!filters.People) {
      allFilteredResults = allFilteredResults.filter(
        (item) => item.type !== "person",
      );
    }

    return {
      All: allFilteredResults.length,
      Files: searchResults.filter((item) => item.type !== "person").length,
      People: searchResults.filter((item) => item.type === "person").length,
      Chats: 0, // No chat data in current dataset
    };
  };

  const clearSearch = () => {
    // Clear any pending timeouts
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    if (closingTimeoutRef.current) {
      clearTimeout(closingTimeoutRef.current);
    }

    // Start closing animation
    setIsClosing(true);
    setIsSearching(false);

    // After animation completes, clear all states
    closingTimeoutRef.current = setTimeout(() => {
      setSearchQuery("");
      setShowResults(false);
      setShowFilters(false);
      setIsClosing(false);
    }, 1200); // 1.2s to match CSS animation duration
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Cancel closing animation if user starts typing
    if (value.length > 0 && closingTimeoutRef.current) {
      clearTimeout(closingTimeoutRef.current);
      setIsClosing(false);
    }

    setSearchQuery(value);

    // Clear any existing loading timeout
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }

    if (value.length > 0) {
      setIsSearching(true);
      setShowResults(true);
      // Simulate search delay for loading animation
      loadingTimeoutRef.current = setTimeout(() => {
        setIsSearching(false);
      }, 800);
    } else {
      setShowResults(false);
      setIsSearching(false);
    }
  };

  const toggleFilter = (filterName: string) => {
    setFilters((prev) => {
      const newFilters = {
        ...prev,
        [filterName]: !prev[filterName as keyof typeof prev],
      };

      // If we're turning off a filter and we're currently on that tab, switch to All
      if (!newFilters[filterName as keyof typeof newFilters]) {
        if (
          (filterName === "Files" && activeTab === "Files") ||
          (filterName === "People" && activeTab === "People") ||
          (filterName === "Chats" && activeTab === "Chats")
        ) {
          setActiveTab("All");
        }
      }

      return newFilters;
    });
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;

    try {
      // Escape regex special characters to prevent syntax errors
      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const parts = text.split(new RegExp(`(${escapedQuery})`, "gi"));
      return parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={index} className="highlight">
            {part}
          </span>
        ) : (
          part
        ),
      );
    } catch (error) {
      // Fallback to plain text if regex fails
      return text;
    }
  };

  // Close filters when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowFilters(false);
    };

    if (showFilters) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showFilters]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      if (closingTimeoutRef.current) {
        clearTimeout(closingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`search-interface ${showResults ? "expanded" : "compact"}`}>
      <div className="search-container">
        {/* Single Search Input that transforms */}
        <div className={`search-wrapper ${showResults ? "expanded" : "compact"}`}>
          {/* Search Input Row */}
          <div className="search-input-row">
            <IoSearch className="search-icon" />
            <input
              type="text"
              placeholder={showResults ? "Search..." : "Searching is easier"}
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
              autoFocus={showResults}
            />
            
            {/* Show quick access in compact mode, clear button in expanded mode */}
            {!showResults ? (
              <div className="quick-access">
                <span className="shortcut-key">S</span>
                <span className="shortcut-text">quick access</span>
              </div>
            ) : (
              <button onClick={clearSearch} className="clear-button">
                Clear
              </button>
            )}
          </div>

          {/* Expanded Content - only shown when typing */}
          {showResults && (
            <div
              className={`search-results-container ${isClosing ? "closing" : ""}`}
            >
              {/* Tabs and Settings */}
              <div className="search-tabs">
                <div className="tabs">
                  {["All", "Files", "People", "Chats"]
                    .filter((tab) => {
                      // Hide tabs when their corresponding filter is disabled
                      if (tab === "Files" && !filters.Files) return false;
                      if (tab === "People" && !filters.People) return false;
                      if (tab === "Chats" && !filters.Chats) return false;
                      return true;
                    })
                    .map((tab) => {
                      const counts = getTabCounts();
                      const count = counts[tab as keyof typeof counts];
                      return (
                        <button
                          key={tab}
                          className={`tab ${activeTab === tab ? "active" : ""}`}
                          onClick={() => setActiveTab(tab)}
                        >
                          {tab === "Files" && (
                            <img src="/file.svg" className="tab-icon" alt="Files" />
                          )}
                          {tab === "People" && <img src="/people.svg" className="tab-icon" alt="People" />}
                          {tab === "Chats" && <img src="/vid.svg" className="tab-icon" alt="Chats" />}
                          {tab} <span className="count">{count}</span>
                        </button>
                      );
                    })}
                </div>

                <div className="settings-container">
                  <button
                    className={`settings-button ${showFilters ? "active" : ""} ${settingsClicked ? "clicked" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowFilters(!showFilters);
                      // Delay rotation by 100ms after press
                      setTimeout(() => {
                        setSettingsClicked(true);
                        setTimeout(() => setSettingsClicked(false), 300);
                      }, 100);
                    }}
                  >
                    <img
                      src="/setting-1.svg"
                      alt="Settings"
                      width="16"
                      height="16"
                    />
                  </button>

                  {showFilters && (
                    <div
                      className="filter-dropdown"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="filter-item">
                        <img src="/file.svg" className="filter-icon" alt="Files" />
                        <span>Files</span>
                        <label className="toggle">
                          <input
                            type="checkbox"
                            checked={filters.Files}
                            onChange={() => toggleFilter("Files")}
                          />
                          <span className="slider"></span>
                        </label>
                      </div>
                      <div className="filter-item">
                        <img src="/people.svg" className="filter-icon" alt="People" />
                        <span>People</span>
                        <label className="toggle">
                          <input
                            type="checkbox"
                            checked={filters.People}
                            onChange={() => toggleFilter("People")}
                          />
                          <span className="slider"></span>
                        </label>
                      </div>
                      <div className="filter-item">
                        <img src="/vid.svg" className="filter-icon" alt="Chats" />
                        <span>Chats</span>
                        <label className="toggle">
                          <input
                            type="checkbox"
                            checked={filters.Chats}
                            onChange={() => toggleFilter("Chats")}
                          />
                          <span className="slider"></span>
                        </label>
                      </div>
                      <div className="filter-item disabled">
                        <img src="/file.svg" className="filter-icon" alt="Lists" />
                        <span>Lists</span>
                        <label className="toggle disabled">
                          <input
                            type="checkbox"
                            checked={filters.Lists}
                            onChange={() => toggleFilter("Lists")}
                            disabled
                          />
                          <span className="slider"></span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {isSearching ? (
                <div className="skeleton-loading">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="skeleton-item">
                      <div className="skeleton-avatar"></div>
                      <div className="skeleton-content">
                        <div className="skeleton-title"></div>
                        <div className="skeleton-subtitle"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="search-results">
                  {getFilteredResults().length === 0 ? (
                    <div className="no-results">
                      <div className="no-results-text">No results found</div>
                      <div className="no-results-subtitle">
                        Try adjusting your search or filters
                      </div>
                    </div>
                  ) : (
                    getFilteredResults().map((result) => (
                      <SearchResultItem
                        key={result.id}
                        result={result}
                        searchQuery={searchQuery}
                        highlightText={highlightText}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SearchResultItem = ({
  result,
  searchQuery,
  highlightText,
}: {
  result: SearchResult;
  searchQuery: string;
  highlightText: (text: string, query: string) => React.ReactNode;
}) => {
  const [showActions, setShowActions] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleCopyLink = () => {
    // Copy a mock link to clipboard
    navigator.clipboard.writeText(`https://example.com/${result.id}`);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleNewTab = () => {
    // Open in new tab (mock functionality)
    window.open(`https://example.com/${result.id}`, "_blank");
  };
  if (result.type === "person") {
    return (
      <div
        className="result-item person-item"
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <div className="avatar-container">
          <img src={result.avatar} alt={result.name} className="avatar" />
          <div className={`status-dot ${result.statusColor}`}></div>
        </div>
        <div className="result-content">
          <h3 className="result-name">
            {highlightText(result.name, searchQuery)}
          </h3>
          <p className="result-meta">{result.status}</p>
        </div>
        {showActions && (
          <div className="result-actions">
            <button
              className="action-btn copy-btn"
              onClick={handleCopyLink}
              title={linkCopied ? "Link copied!" : "Copy link"}
            >
              <HiOutlineLink size={16} />
            </button>
            <button
              className="action-btn new-tab-btn"
              onClick={handleNewTab}
              title="New Tab"
            >
              <HiOutlineExternalLink size={16} />
              <span>New Tab</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  if (result.type === "folder") {
    return (
      <div
        className="result-item folder-item"
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <div className="result-icon">
          <img src="/folder.svg" alt="Folder" />
        </div>
        <div className="result-content">
          <h3 className="result-name">
            {highlightText(result.name, searchQuery)}
            <span className="file-count">{result.fileCount}</span>
          </h3>
          <p className="result-meta">
            in {result.location} • {result.lastEdited}
          </p>
        </div>
        {showActions && (
          <div className="result-actions">
            <button
              className="action-btn copy-btn"
              onClick={handleCopyLink}
              title={linkCopied ? "Link copied!" : "Copy link"}
            >
              <HiOutlineLink size={16} />
            </button>
            <button
              className="action-btn new-tab-btn"
              onClick={handleNewTab}
              title="New Tab"
            >
              <HiOutlineExternalLink size={16} />
              <span>New Tab</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  if (result.type === "image") {
    return (
      <div
        className="result-item file-item"
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <div className="result-icon image-icon">
          <img src="/jpg.svg" alt="Image" />
        </div>
        <div className="result-content">
          <h3 className="result-name">
            {highlightText(result.name, searchQuery)}
          </h3>
          <p className="result-meta">
            in {result.location} • {result.lastEdited}
          </p>
        </div>
        {showActions && (
          <div className="result-actions">
            <button
              className="action-btn copy-btn"
              onClick={handleCopyLink}
              title={linkCopied ? "Link copied!" : "Copy link"}
            >
              <HiOutlineLink size={16} />
            </button>
            <button
              className="action-btn new-tab-btn"
              onClick={handleNewTab}
              title="New Tab"
            >
              <HiOutlineExternalLink size={16} />
              <span>New Tab</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  if (result.type === "video") {
    return (
      <div
        className="result-item file-item"
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <div className="result-icon video-icon">
          <img src="/vid.svg" alt="Video" />
        </div>
        <div className="result-content">
          <h3 className="result-name">
            {highlightText(result.name, searchQuery)}
          </h3>
          <p className="result-meta">
            in {result.location} • {result.lastEdited}
          </p>
        </div>
        {showActions && (
          <div className="result-actions">
            <button
              className="action-btn copy-btn"
              onClick={handleCopyLink}
              title={linkCopied ? "Link copied!" : "Copy link"}
            >
              <HiOutlineLink size={16} />
            </button>
            <button
              className="action-btn new-tab-btn"
              onClick={handleNewTab}
              title="New Tab"
            >
              <HiOutlineExternalLink size={16} />
              <span>New Tab</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default SearchInterface;
