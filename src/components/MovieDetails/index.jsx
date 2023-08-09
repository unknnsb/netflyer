import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const MovieDetails = ({ match }) => {
  const [movieDetails, setMovieDetails] = useState(null);

  const API_KEY = "bb2818a2abb39fbdf6da79343e5e376b";
  const API_BASE = "https://api.themoviedb.org/3";

  let { id } = useParams();

  useEffect(() => {
    // Fetch movie details using match.params.id
    const fetchMovieDetails = async () => {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=bb2818a2abb39fbdf6da79343e5e376b`
      );
      const data = await response.json();
      console.log(data);
      setMovieDetails(data);
    };

    fetchMovieDetails();
  }, [id]);

  if (!movieDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{movieDetails.original_title}</h1>
      <p>{movieDetails.overview}</p>
      {/* Display other details */}
    </div>
  );
};

export default MovieDetails;
