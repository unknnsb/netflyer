import React from "react";
import "../styles/FeaturedMovie.css";

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
      className="featured"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${backdrop_path})`,
      }}
    >
      <div className="featured--vertical">
        <div className="featured--horizontal">
          <span className="featured--name">{original_name}</span>
          <div className="featured--info">
            <span className="featured--points">{vote_average} rating - </span>
            <span className="featured--year">{firstDate.getFullYear()} - </span>
            <span className="featured--seasons">
              {number_of_seasons} season
              {number_of_seasons !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="featured--description">{description}</div>
          <div className="featured--buttons">
            <a href={`/watch/${id}`} className="featured--watchbutton">
              ► Play
            </a>
            <a href={`/list/add/${id}`} className="featured--mylistbutton">
              + Add To List
            </a>
          </div>
          <span className="featured--genres">
            Genres: <strong> {genresNames.join(", ")} </strong>
          </span>
        </div>
      </div>
    </section>
  );
};

export default FeaturedMovie;
