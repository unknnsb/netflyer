import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Header.css";
import { AiOutlineSearch } from "react-icons/ai";
import { useUser } from "@clerk/clerk-react";

const Header = () => {
  const [blackHeader, setBlackHeader] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const { user } = useUser();

  const fetchSearchResults = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/multi?api_key=bb2818a2abb39fbdf6da79343e5e376b&query=${searchQuery}`
      );
      setSearchResults(response.data.results);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const toggleSearchInput = () => {
    setShowSearchInput(!showSearchInput);
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
          </div>
        )}
      </div>
      {searchResults.length > 0 && (
        <div className="search-results">
          <button className="close-button" onClick={toggleSearchInput}>
            X
          </button>
          {searchResults.map((result) => (
            <div key={result.id} className="search-result">
              <a
                style={{
                  textDecoration: "none",
                  color: "#fff",
                }}
                href={`/tv/${result.id}`}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w200/${result.poster_path}`}
                  alt={result.title || result.name}
                />
                <p>{result.title || result.name}</p>
              </a>
            </div>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
