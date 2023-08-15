import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const apiKey = "bb2818a2abb39fbdf6da79343e5e376b";
  const baseUrl = "https://api.themoviedb.org/3/search/multi"; // Fetch both movies and TV series

  const fetchResults = async () => {
    try {
      const response = await fetch(
        `${baseUrl}?api_key=${apiKey}&query=${query}`
      );
      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  useEffect(() => {
    if (query !== "") {
      fetchResults();
    }
  }, [query]);

  const onClick = (res) => {
    if (res.first_air_date) {
      navigate(`/tv/${res.id}`);
    } else {
      navigate(`/movie/${res.id}`);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-zinc-900 text-white p-8">
        <div className="container mt-20 mx-auto">
          <h1 className="text-3xl mb-4">Search Movies and TV Series</h1>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for movies and TV series..."
            className="w-full p-2 rounded-md bg-zinc-800 text-white"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {results.map((item) => (
              <div
                onClick={() => onClick(item)}
                key={item.id}
                className="bg-zinc-800 p-4 rounded-md"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  alt={`${item.title || item.name} Poster`}
                  className="mb-2"
                />
                <h2 className="text-xl font-semibold">
                  {item.title || item.name}
                </h2>
                <p className="text-gray-400">
                  {item.release_date || item.first_air_date}
                </p>
                <p className="mt-2">{item.overview}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchPage;
