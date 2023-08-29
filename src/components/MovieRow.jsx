import React from 'react';

const MovieRow = ({ title, movies }) => {
  const handleClick = (id, type) => {
    window.location.href = `/info/${type}/${id}`
  }
  return (
    <div className='mt-3 p-2 text-white'>
      <h2 className="font-bold mb-2 text-xl">
        {title}
      </h2>
      <div className="flex flex-no-wrap overflow-x-scroll scrolling-touch items-start mb-8">
        {movies.map((movie, index) => (
          <div key={index} onClick={() => {
            if (movie.first_air_date) {
              handleClick(movie.id, 'tv')
            } else {
              handleClick(movie.id, 'movie')
            }
          }} className="hover:scale-110 transform transition-transform duration-300 flex-none w-2/3 md:w-1/3 mr-4 md:pb-4">
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} className="rounded-md shadow-lg h-50" alt={movie.title} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default MovieRow;

