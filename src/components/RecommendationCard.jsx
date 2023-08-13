const RecommendationCard = ({ movie }) => {
  const onClick = (id) => {
    if (movie.first_air_date) {
      window.location.href = `/tv/${id}`;
    } else {
      window.location.href = `/movie/${id}`;
    }
  };
  return (
    <div
      onClick={() => onClick(movie.id)}
      className="border rounded-lg overflow-hidden shadow-md"
    >
      <img
        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
        alt={movie.title || movie.name}
        className="w-full h-auto"
      />
      <div className="p-3">
        <h3 className="text-lg font-semibold">{movie.title || movie.name}</h3>
        <p className="text-gray-600">{movie.overview.slice(0, 100)}...</p>
      </div>
    </div>
  );
};

export default RecommendationCard;
