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
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Navbar />
          <br />
          <br />
          <br />
          <div className="container p-3">
            <h1 className="text-2xl font-bold text-white">Search</h1>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-[#444343] mt-2 p-2 rounded-lg outline-none border-none w-full text-gray-100"
              placeholder="What do you want to search?"
            />
            <div>
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
                  className="hover:opacity-20 transition-opacity duration-100 flex items-center gap-1 text-white mt-4 text-sm border-zinc-600 border-b p-1"
                >
                  <FaSearch />
                  <h2>
                    {result.title || result.name} (
                    {getDate(result.release_date || result.first_air_date)})
                  </h2>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SearchPage;
