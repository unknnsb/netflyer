import React from "react";

const FeaturedMovie = ({
  item: {
    overview,
    genres,
    first_air_date,
    number_of_seasons,
    original_name,
    backdrop_path,
    vote_average,
    id,
  },
}) => {
  const firstDate = new Date(first_air_date);
  const genresNames = genres.map(({ name }) => name);
  const description =
    overview.length > 180 ? overview.substring(0, 180) + "..." : overview;

  return (
    <section
      className="featured bg-cover bg-center h-screen"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${backdrop_path})`,
      }}
    >
      <div className="featured--vertical w-full h-full bg-gradient-to-t from-black to-transparent">
        <div className="featured--horizontal w-full h-full bg-gradient-to-r from-black via-transparent to-transparent flex flex-col justify-center pl-8 pb-28 pt-7">
          <span className="featured--name text-5xl font-bold">
            {original_name}
          </span>
          <div className="featured--info text-lg font-bold mt-3">
            <span className="featured--points text-green-500">
              {vote_average} rating -{" "}
            </span>
            <span className="featured--year">{firstDate.getFullYear()} - </span>
            <span className="featured--seasons">
              {number_of_seasons} season
              {number_of_seasons !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="featured--description text-lg text-gray-500 mt-3 max-w-2xl">
            {description}
          </div>
          <div className="featured--buttons mt-3">
            <a
              href={`/tv/${id}`}
              className="featured--watchbutton inline-block text-lg font-bold py-3 px-6 rounded-lg text-black bg-white mr-3 transition-all duration-200 ease-in-out hover:opacity-70"
            >
              ► Play
            </a>
            <a
              href={`/list/add/${id}?tv=true`}
              className="featured--mylistbutton inline-block text-lg font-bold py-3 px-6 rounded-lg text-white bg-gray-800 transition-all duration-200 ease-in-out hover:opacity-70"
            >
              + Add To List
            </a>
          </div>
          <span className="featured--genres text-lg text-gray-500 mt-3">
            Genres: <strong> {genresNames.join(", ")} </strong>
          </span>
        </div>
      </div>
    </section>
  );
};

export default FeaturedMovie;
