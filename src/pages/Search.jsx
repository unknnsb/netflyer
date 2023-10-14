import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import { TMDB_API_KEY, endpoints, TMDB_URL } from "../services/Tmdb";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    axios
      .get(`${TMDB_URL}${endpoints.search}`, {
        params: {
          query: query,
          api_key: TMDB_API_KEY,
        },
      })
      .then((res) => setResults(res.data.results));
  }, [query]);

  const handleClick = (id, tvShow) => {
    if (tvShow) {
      navigate(`/info/tv/${id}`);
    } else {
      navigate(`/info/movie/${id}`);
    }
  };

  const getDate = (date) => {
    const dateObject = new Date(date);
    const year = dateObject.getFullYear();
    return year;
  };

  return (
    <div className="bg-dark mt-10 text-white min-h-screen">
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Search</h1>
        <div className="relative mb-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-stone-800 text-white w-full py-2 pl-10 pr-4 rounded-full focus:outline-none focus:shadow-outline"
            placeholder="What do you want to search?"
          />
          <div className="absolute top-0 left-0 mt-[10px] ml-4">
            <FaSearch />
          </div>
        </div>
        {loading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map((result) => (
              <div
                onClick={() => {
                  if (result.first_air_date) {
                    handleClick(result.id, true);
                  } else {
                    handleClick(result.id, false);
                  }
                }}
                key={result.id}
                className="cursor-pointer hover:opacity-75 transition-opacity duration-300"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500/${result.poster_path}`}
                  alt={result.title || result.name}
                  className="w-full rounded-lg"
                />
                <p className="mt-2 text-sm font-semibold">
                  {result.title || result.name} (
                  {getDate(result.release_date || result.first_air_date)})
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
