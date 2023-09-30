import React from "react";

const MovieRow = ({ movies, header }) => {
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
            <div key={index} className="ml-2 flex-none">
              <div className="relative group">
                <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transform transition-transform scale-105">
                  <img
                    src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    alt={movie.title || movie.name}
                    className="w-36 h-auto"
                  />
                </div>
                <div className="bg-white bg-opacity-75 absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">
                      {movie.title || movie.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {movie.first_air_date
                        ? `First Air Date: ${movie.first_air_date}`
                        : `Release Date: ${movie.release_date}`}
                    </p>
                  </div>
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
