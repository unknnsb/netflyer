import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MovieRow from "../MovieRow";
import "./styles.css";

const MovieDetails = () => {
  const [movieDetails, setMovieDetails] = useState(null);
  const [showFullOverview, setShowFullOverview] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [showIframe, setShowIframe] = useState(false);

  let { id } = useParams();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=bb2818a2abb39fbdf6da79343e5e376b`
      );
      const data = await response.json();
      setMovieDetails(data);
    };

    fetchMovieDetails();
  }, [id]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=bb2818a2abb39fbdf6da79343e5e376b`
      );
      const data = await response.json();
      setRecommendations(data.results.slice(0, 10));
    };

    fetchRecommendations();
  }, [id]);

  useEffect(() => {
    const iframeTimeout = setTimeout(() => {
      setShowIframe(true);
    }, 2000);

    return () => {
      clearTimeout(iframeTimeout);
    };
  }, []);

  if (!movieDetails) {
    return <div>Loading...</div>;
  }

  const overview = showFullOverview
    ? movieDetails.overview
    : movieDetails.overview.slice(0, 150) +
      (movieDetails.overview.length > 150 ? "..." : "");

  return (
    <div className="movieDetails">
      {showIframe ? (
        <>
          <div className="movie-info">
            <iframe
              title="Stream Movie"
              src={`https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1`}
            />
            <h1>{movieDetails.original_title}</h1>
            <p>{overview}</p>
            {movieDetails.overview.length > 150 && (
              <button onClick={() => setShowFullOverview(!showFullOverview)}>
                {showFullOverview ? "Read Less" : "Read More"}
              </button>
            )}

            <p>Release Date: {movieDetails.release_date}</p>
            <p>Runtime: {movieDetails.runtime} minutes</p>
            <p>
              Genres:{" "}
              {movieDetails.genres.map((genre) => genre.name).join(", ")}
            </p>
            <MovieRow
              title="Recommended Movies"
              items={{ results: recommendations }}
            />
          </div>
        </>
      ) : (
        <>
          <div className="movie-info">
            <img
              src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
              alt={movieDetails.title || movieDetails.name}
            />
            <h1>{movieDetails.original_title}</h1>
            <p>{overview}</p>
            {movieDetails.overview.length > 150 && (
              <button onClick={() => setShowFullOverview(!showFullOverview)}>
                {showFullOverview ? "Read Less" : "Read More"}
              </button>
            )}

            <p>Release Date: {movieDetails.release_date}</p>
            <p>Runtime: {movieDetails.runtime} minutes</p>
            <p>
              Genres:{" "}
              {movieDetails.genres.map((genre) => genre.name).join(", ")}
            </p>
            <MovieRow
              title="Recommended Movies"
              items={{ results: recommendations }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default MovieDetails;
