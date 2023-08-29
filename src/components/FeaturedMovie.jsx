import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlay, FaPlus, FaInfoCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const FeaturedMovie = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);

  useEffect(() => {
    // Fetch trending movie data from TMDB API
    axios.get('https://api.themoviedb.org/3/trending/movie/week?api_key=bb2818a2abb39fbdf6da79343e5e376b')
      .then(response => {
        setTrendingMovies(response.data.results);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const randomIndex = Math.floor(Math.random() * trendingMovies.length);
  const featuredMovie = trendingMovies[randomIndex];

  return (
    <div className="relative">
      {featuredMovie && (
        <motion.div
          key={featuredMovie.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-gradient-to-t from-202020 to-transparent"
        >
          <img
            src={`https://image.tmdb.org/t/p/original/${featuredMovie.backdrop_path}`}
            alt={featuredMovie.title}
            className="object-cover h-96 sm:h-screen w-full"
          />
          <div className="absolute z-20 bottom-0 p-4 sm:p-8 text-center bg-gradient-to-t from-black to-transparent w-full">
            <h1 className="text-2xl sm:text-4xl font-bold mb-2 text-white">{featuredMovie.title}</h1>
            <div className="flex justify-center items-center space-x-4">
              <button className="p-2 bg-red-600 rounded-lg text-white">
                <FaPlay className="h-6 w-6" />
              </button>
              <button className="p-2 bg-gray-800 rounded-lg text-white">
                <FaPlus className="h-6 w-6" />
              </button>
              <button className="p-2 bg-gray-800 rounded-lg text-white">
                <FaInfoCircle className="h-6 w-6" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FeaturedMovie;

