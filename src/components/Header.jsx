import React, { useState, useEffect } from "react";
import axios from "axios";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import { useUser } from "@clerk/clerk-react";
import "../styles/Header.css";

const Header = () => {
  const [blackHeader, setBlackHeader] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [notFoundMessage, setNotFoundMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  const fetchSearchResults = async () => {
    try {
      setIsLoading(true); // Set loading state
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/multi?api_key=bb2818a2abb39fbdf6da79343e5e376b&query=${searchQuery}`
      );
      setSearchResults(response.data.results);
      if (response.data.results.length === 0) {
        setNotFoundMessage(`Not Found for: ${searchQuery}`);
      } else {
        setNotFoundMessage("");
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false); // Disable loading state after 3 seconds
      }, 1000);
    }
  };

  const toggleSearchInput = () => {
    setShowSearchInput(!showSearchInput);
    setSearchResults([]);
    setSearchQuery("");
    setNotFoundMessage("");
  };

  const clearSearchResults = () => {
    setSearchResults([]);
    setSearchQuery("");
    setNotFoundMessage("");
    setShowSearchInput(false);
  };

  useEffect(() => {
    const scrollListener = () => {
      setBlackHeader(window.scrollY > 15);
    };

    window.addEventListener("scroll", scrollListener);

    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  }, []);

  const onClick = (id, item) => {
    window.location.href = `/movie/${id}`;
    if (item.released_date) {
      window.location.href = `/movie/${id}`;
    } else if (item.first_air_date) {
      window.location.href = `/tv/${id}`;
    }
  };

  return (
    <header className={`header ${blackHeader ? "black" : ""}`}>
      <div className="header--logo">
        <a className="logo" href="/" title="Netflyer">
          <img
            src="/logo.png"
            className="icon-logoUpdate"
            alt="Netflyer Logo"
          />
        </a>
      </div>
      <div className="header--user">
        <img src={`${user.profileImageUrl}`} alt={`${user.username} profile`} />
      </div>
      <div className="header--search">
        {!showSearchInput && (
          <button className="search-icon" onClick={toggleSearchInput}>
            <AiOutlineSearch />
          </button>
        )}
        {showSearchInput && (
          <div className="search-input">
            <input
              type="text"
              placeholder="Search movies and TV series..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={fetchSearchResults}>Search</button>
            <button onClick={clearSearchResults}>
              <AiOutlineClose />
            </button>
          </div>
        )}
      </div>
      {searchResults.length > 0 && (
        <div className="search-results">
          <div className="close-button">
            <button onClick={clearSearchResults}>
              <AiOutlineClose />
            </button>
          </div>
          {isLoading ? (
            <div className="loading">
              <img
                src="https://cdn.lowgif.com/small/0534e2a412eeb281-the-counterintuitive-tech-behind-netflix-s-worldwide.gif"
                alt="loading"
              />
            </div>
          ) : (
            <>
              {notFoundMessage && (
                <p className="not-found">{notFoundMessage}</p>
              )}
              {searchResults.map((result) => (
                <div key={result.id} className="search-result">
                  <a
                    style={{
                      textDecoration: "none",
                      color: "#fff",
                    }}
                    onClick={() => onClick(result.id, result)}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w200/${result.poster_path}`}
                      alt={result.title || result.name}
                    />
                    <p>{result.title || result.name}</p>
                  </a>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
