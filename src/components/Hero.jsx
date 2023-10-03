import { TMDB_API_KEY } from "../services/Tmdb";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaPlay, FaInfoCircle, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [randomMovie, setRandomMovie] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(
        `https://api.themoviedb.org/3/trending/all/day?api_key=${TMDB_API_KEY}&language=en-US&page=1`
      )
      .then((response) => {
        const movies = response.data.results;
        const randomIndex = Math.floor(Math.random() * movies.length);
        setRandomMovie(movies[randomIndex]);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div className="relative h-screen overflow-hidden">
      {randomMovie && (
        <>
          <div
            className={`absolute inset-0 flex justify-center items-end transition-opacity duration-500 ${
              randomMovie ? "opacity-100" : "opacity-0"
            }`}
            style={{
              background: "linear-gradient(to top, #202020, transparent)",
            }}
          >
            <div className="text-white text-center p-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4">
                {randomMovie.title || randomMovie.name}
              </h1>
              <div className="flex justify-center space-x-6 mt-4">
                <button className="text-2xl p-2 rounded-full hover:bg-red-500 hover:text-white transition-all duration-300">
                  <FaPlay />
                </button>
                <button
                  onClick={() => {
                    if (randomMovie.first_air_date) {
                      navigate(`/info/tv/${randomMovie.id}`);
                    } else {
                      navigate(`/info/movie/${randomMovie.id}`);
                    }
                  }}
                  className="text-2xl p-2 rounded-full hover:bg-red-500 hover:text-white transition-all duration-300"
                >
                  <FaInfoCircle />
                </button>
                <button className="text-2xl p-2 rounded-full hover:bg-red-500 hover:text-white transition-all duration-300">
                  <FaPlus />
                </button>
              </div>
            </div>
          </div>
          <img
            src={`https://image.tmdb.org/t/p/original/${randomMovie.poster_path}`}
            alt={randomMovie.title || randomMovie.name}
            className="w-full h-full object-cover object-top"
          />
        </>
      )}
    </div>
  );
};

export default HeroSection;
