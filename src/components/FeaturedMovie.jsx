import { TMDB_API_KEY, TMDB_URL, endpoints } from "../services/Tmdb";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaPlay, FaInfoCircle, FaPlus } from "react-icons/fa";

const FeaturedMovies = () => {
  const [featuredMovies, setFeaturedMovies] = useState([]);

  useEffect(() => {
    axios
      .get(`${TMDB_URL}${endpoints.trending}?api_key=${TMDB_API_KEY}`)
      .then((response) => {
        setFeaturedMovies(response.data.results);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
      {featuredMovies.map((movie) => (
        <div
          key={movie.id}
          className="relative group overflow-hidden rounded-lg shadow-md"
        >
          <img
            src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
            alt={movie.title}
            className="w-full h-auto transform scale-100 group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-black bg-opacity-80 p-4 text-white text-center">
              <button className="text-2xl p-2 hover:bg-red-500 hover:text-white rounded-full mx-2">
                <FaPlay />
              </button>
              <button className="text-2xl p-2 hover:bg-red-500 hover:text-white rounded-full mx-2">
                <FaInfoCircle />
              </button>
              <button className="text-2xl p-2 hover:bg-red-500 hover:text-white rounded-full mx-2">
                <FaPlus />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedMovies;
