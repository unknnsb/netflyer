import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import classNames from "classnames";
import { useUser } from "@clerk/clerk-react";
import Loading from "./Loading";
import { AiOutlineSearch } from "react-icons/ai";
import { BsListCheck } from "react-icons/bs";

const Header = () => {
  const [scrollBgColor, setScrollBgColor] = useState("transparent");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const handleScroll = () => {
    setScrollBgColor(window.scrollY > 0 ? "black" : "transparent");
  };

  const handleSearchChange = async (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (!query) {
      setSearchResults([]);
      return;
    }

    const TMDB_API_KEY = "bb2818a2abb39fbdf6da79343e5e376b";
    const TMDB_API_URL = "https://api.themoviedb.org/3/search/multi";

    try {
      const response = await fetch(
        `${TMDB_API_URL}?api_key=${TMDB_API_KEY}&query=${query}`
      );
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const redirectToResult = (result) => {
    const path = result.first_air_date
      ? `/tv/${result.id}`
      : `/movie/${result.id}`;
    navigate(path);
  };

  if (!isLoaded) {
    return <Loading />;
  }

  return (
    <header
      className={classNames("fixed w-full top-0 z-50 transition duration-300", {
        "bg-transparent": scrollBgColor === "transparent",
        "bg-black": scrollBgColor === "black",
      })}
    >
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <img
            onClick={() => navigate("/")}
            src="/logo.png"
            alt="Netflix Logo"
            className="h-8 mr-6 "
          />
          <div className="relative md:block hidden">
            <input
              type="text"
              placeholder="Search Movie/Series/Anime..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg w-64"
            />
            {searchQuery && (
              <div className="absolute top-full left-0 mt-2 bg-white text-gray-800 rounded-lg py-2 px-4 shadow">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="mb-2 cursor-pointer"
                    onClick={() => redirectToResult(result)}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w92${result.poster_path}`}
                      alt={`${result.title || result.name} Poster`}
                      className="h-12 mr-2 rounded"
                    />
                    <span>{result.title || result.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            to="/list"
            className="text-white md:block hidden hover:text-gray-300"
          >
            Watch List
          </Link>
          <div className="flex items-center">
            <img
              src={`${user.profileImageUrl}`}
              alt={`${user.username} User Profile`}
              className="h-8 rounded-full"
            />
          </div>
        </div>
        <div className="md:hidden flex">
          <button
            onClick={() => navigate("/search")}
            className="text-white hover:text-gray-300"
          >
            <AiOutlineSearch className="h-6 w-6" />
          </button>
          <Link to="/list" className="text-white hover:text-gray-300 ml-4">
            <BsListCheck className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
