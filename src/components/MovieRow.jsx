import React from "react";
import { useNavigate } from "react-router-dom";

const MovieRow = ({ movies, header }) => {
  const navigate = useNavigate();

  const isMobile = window.innerWidth <= 768; // You can adjust the breakpoint as needed

  return (
    <div className="md:mt-2">
      {header && (
        <h2 className="text-2xl font-semibold text-white ml-3 mb-4">
          {header}
        </h2>
      )}
      <div className="flex overflow-x-auto">
        {movies.map((movie, index) => (
          <div
            key={index}
            className={`${
              isMobile
                ? "cursor-pointer"
                : "hover:transform hover:scale-105 transition-transform duration-300 ease-in-out"
            } ml-4 md:ml-6 lg:ml-8 flex-none`}
            onClick={() => {
              if (movie.first_air_date) {
                navigate(`/info/tv/${movie.id}`);
              } else {
                navigate(`/info/movie/${movie.id}`);
              }
            }}
          >
            <div className="relative group">
              <div className="bg-black rounded-lg overflow-hidden shadow-md hover:shadow-lg">
                <img
                  src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                  alt={movie.title || movie.name}
                  className="w-40 h-auto"
                />
                {!isMobile && (
                  <div
                    style={{
                      backgroundColor: "rgba(0,0,0,0.6)",
                    }}
                    className="absolute inset-0 flex flex-col items-center justify-center opacity-0 md:group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <h3 className="text-2xl font-semibold text-center text-white">
                      {movie.title || movie.name}
                    </h3>
                    <button
                      onClick={() => {
                        if (movie.first_air_date) {
                          navigate(`/info/tv/${movie.id}`);
                        } else {
                          navigate(`/info/movie/${movie.id}`);
                        }
                      }}
                      className="bg-red-600 text-white rounded-full px-4 py-2 hover:bg-red-700 transition-all duration-300"
                    >
                      Watch Now
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieRow;
