import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import MovieRow from "./MovieRow";
import Header from "./Header";
import "./styles/TvDetails.css";

const TvDetails = () => {
  const [tvDetails, setTvDetails] = useState(null);
  const [showFullOverview, setShowFullOverview] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const navigate = useNavigate();

  let { id } = useParams();

  useEffect(() => {
    const fetchtvDetails = async () => {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${id}?api_key=bb2818a2abb39fbdf6da79343e5e376b`
      );
      const data = await response.json();
      setTvDetails(data);
    };

    fetchtvDetails();
  }, [id]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${id}/recommendations?api_key=bb2818a2abb39fbdf6da79343e5e376b`
      );
      const data = await response.json();
      setRecommendations(data.results.slice(0, 10));
    };

    fetchRecommendations();
  }, [id]);

  if (!tvDetails) {
    return (
      <div className="loading">
        <img
          src="https://cdn.lowgif.com/small/0534e2a412eeb281-the-counterintuitive-tech-behind-netflix-s-worldwide.gif"
          alt="loading"
        ></img>
      </div>
    );
  }

  const overview = showFullOverview
    ? tvDetails.overview
    : tvDetails.overview.slice(0, 150) +
      (tvDetails.overview.length > 150 ? "..." : "");

  const watch = (num) => {
    navigate(`/watch/tv/${id}/${num}`);
  };

  return (
    <>
      <Header />
      <div className="tvDetails">
        <div className="tv-info">
          <div className="image-container">
            <a href={`/watch/tv/${id}/1`}>
              <img
                src={`https://image.tmdb.org/t/p/w500${tvDetails.poster_path}`}
                alt={tvDetails.original_name}
              />
              <div className="overlay">
                <img src="/play.png" alt="Video Logo" className="video-logo" />
              </div>
            </a>
          </div>
          <h1>{tvDetails.original_name}</h1>
          <p>{overview}</p>
          {tvDetails.overview.length > 150 && (
            <button onClick={() => setShowFullOverview(!showFullOverview)}>
              {showFullOverview ? "Read Less" : "Read More"}
            </button>
          )}

          <p>Release Date: {tvDetails.first_air_date}</p>
          <p>
            Ended:{" "}
            {tvDetails.next_episode_to_air === null
              ? tvDetails.last_air_date
              : "Not Ended"}
          </p>
          <p>Runtime: {tvDetails.episode_run_time} minutes</p>
          <p>Total Episode: {tvDetails.number_of_episodes}</p>
          <p>Total Seasons: {tvDetails.number_of_seasons}</p>

          {tvDetails.genres ? (
            <p>
              Genres: {tvDetails.genres.map((genre) => genre.name).join(", ")}
            </p>
          ) : (
            <p>Loading genres...</p>
          )}
          <div className="episodeList">
            <button onClick={() => watch(1)}>EP 1</button>
            <button onClick={() => watch(2)}>EP 2</button>
            <button onClick={() => watch(3)}>EP 3</button>
          </div>
          <MovieRow
            title="Recommended Shows"
            items={{ results: recommendations }}
          />
        </div>
      </div>
    </>
  );
};

export default TvDetails;
