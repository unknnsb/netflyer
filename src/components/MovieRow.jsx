import React from "react";
import { useNavigate } from "react-router-dom";

const MovieRow = ({ movies, header }) => {
  const navigate = useNavigate();
  return (
    <div className="md:mt-2">
      {header && (
        <h2 className="text-2xl font-semibold text-white ml-3 mb-4">
          {header}
        </h2>
      )}
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300">
        <div className="flex gap-4 p-4 sm:p-0">
          {movies.map((movie, index) => (
            <div
              key={index}
              className="hover:transform hover:scale-110 transition-transform duration-300 ease-in-out ml-2 flex-none"
            >
              <div className="relative group">
                <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transform transition-transform scale-105">
                  <img
                    src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    alt={movie.title || movie.name}
                    className="w-36 h-auto"
                    onClick={() => {
                      if (movie.first_air_date) {
                        navigate(`/info/tv/${movie.id}`);
                      } else {
                        navigate(`/info/movie/${movie.id}`);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieRow;
