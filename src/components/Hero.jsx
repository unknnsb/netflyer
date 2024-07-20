import { TMDB_API_KEY } from "../services/Tmdb";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaPlay, FaInfo } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [randomMovie, setRandomMovie] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(
        `https://api.themoviedb.org/3/trending/all/week?api_key=${TMDB_API_KEY}&language=en-US&page=1`
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
    <div className="relative">
      {randomMovie && (
        <div className="relative overflow-hidden">
          <img
            src={`https://image.tmdb.org/t/p/original/${randomMovie.backdrop_path}`}
            alt={randomMovie.title || randomMovie.name}
            className="w-full h-[600px] object-cover"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-gray-900"></div>
          <div className="absolute bottom-0 left-0 w-full p-6 z-10 text-white bg-gradient-to-b from-transparent to-gray-900">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4">
              {randomMovie.title || randomMovie.name}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl font-semibold mb-6">
              {randomMovie.overview}
            </p>
            <div className="flex">
              <button
                className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-md mr-2 flex items-center"
                onClick={() => {
                  if (randomMovie.first_air_date) {
                    navigate(`/watch/tv/${randomMovie.id}/1/1`);
                  } else {
                    navigate(`/watch/movie/${randomMovie.id}`);
                  }
                }}
              >
                <FaPlay className="mr-2" /> Play
              </button>
              <button
                className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded-md flex items-center"
                onClick={() => {
                  if (randomMovie.first_air_date) {
                    navigate(`/info/tv/${randomMovie.id}`);
                  } else {
                    navigate(`/info/movie/${randomMovie.id}`);
                  }
                }}
              >
                <FaInfo className="mr-2" /> More Info
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSection;

