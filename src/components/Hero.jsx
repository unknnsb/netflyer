import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaPlay, FaInfo } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../services/Api";
import { motion } from "framer-motion";

const HeroSection = () => {
  const [randomMovie, setRandomMovie] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/weekly_trending`)
      .then((response) => {
        const movies = response.data.results;
        movies.sort((a, b) => {
          const dateA = new Date(a.release_date || a.first_air_date);
          const dateB = new Date(b.release_date || b.first_air_date);
          return dateB.getTime() - dateA.getTime();
        });
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
        <div className="relative overflow-hidden rounded-3xl shadow-xl">
          <img
            src={`https://image.tmdb.org/t/p/original/${randomMovie.backdrop_path}`}
            alt={randomMovie.title || randomMovie.name}
            className="w-full h-[600px] object-cover rounded-3xl"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black rounded-3xl"></div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="absolute bottom-0 left-0 w-full p-8 z-10 text-white bg-gradient-to-t from-black rounded-b-3xl"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 truncate max-w-full">
              {randomMovie.title || randomMovie.name}
            </h1>
            <p className="text-lg md:text-xl font-semibold mb-6 max-h-36 overflow-hidden text-ellipsis">
              {randomMovie.overview}
            </p>
            <div className="flex space-x-4">
              <button
                aria-label="Play"
                className="bg-blue-600 hover:bg-blue-700 transition-colors rounded-lg px-6 py-3 font-semibold flex items-center shadow-lg shadow-blue-500/40"
                onClick={() => {
                  if (randomMovie.first_air_date) {
                    navigate(`/watch/tv/${randomMovie.id}/1/1`);
                  } else {
                    navigate(`/watch/movie/${randomMovie.id}`);
                  }
                }}
              >
                <FaPlay className="mr-2" />
                Play
              </button>
              <button
                aria-label="More Info"
                className="bg-gray-800 hover:bg-gray-900 transition-colors rounded-lg px-6 py-3 font-semibold flex items-center"
                onClick={() => {
                  if (randomMovie.first_air_date) {
                    navigate(`/info/tv/${randomMovie.id}`);
                  } else {
                    navigate(`/info/movie/${randomMovie.id}`);
                  }
                }}
              >
                <FaInfo className="mr-2" />
                More Info
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default HeroSection;
