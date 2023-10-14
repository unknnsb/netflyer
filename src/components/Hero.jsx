import { TMDB_API_KEY } from "../services/Tmdb";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaPlay, FaInfo, FaPlus } from "react-icons/fa";
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
        <div
          className="relative h-full w-full bg-cover bg-center"
          style={{
            backgroundImage: `url('https://image.tmdb.org/t/p/original/${randomMovie.backdrop_path}')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent"></div>
          <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-8">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white">
              {randomMovie.title || randomMovie.name}
            </h1>
            <div className="flex justify-start mt-4 space-x-4">
              <button className="text-lg md:text-xl p-2 md:p-3 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all duration-300">
                <FaPlay
                  onClick={() => {
                    if (randomMovie.first_air_date) {
                      navigate(`/watch/tv/${randomMovie.id}/1/1`);
                    } else {
                      navigate(`/watch/movie/${randomMovie.id}`);
                    }
                  }}
                />
              </button>
              <button
                onClick={() => {
                  if (randomMovie.first_air_date) {
                    navigate(`/info/tv/${randomMovie.id}`);
                  } else {
                    navigate(`/info/movie/${randomMovie.id}`);
                  }
                }}
                className="text-lg md:text-xl p-2 md:p-3 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all duration-300"
              >
                <FaInfo />
              </button>
              <button className="text-lg md:text-xl p-2 md:p-3 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all duration-300">
                <FaPlus />
              </button>
            </div>
            <div className="mt-4 text-white opacity-70 text-sm">
              {randomMovie.overview}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSection;
