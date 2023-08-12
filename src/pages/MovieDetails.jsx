import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaTwitter, FaFacebook, FaInstagram } from "react-icons/fa"; // Import social media icons
import MovieRow from "../components/MovieRow";
import Header from "../components/Header";
import "../styles/MovieDetails.css";
import { useUser } from "@clerk/clerk-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};

const MovieDetails = () => {
  const { id } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [showFullOverview, setShowFullOverview] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [casts, setCasts] = useState([]); // Added state for casts
  const { isLoaded, user, isSignedIn } = useUser();
  const [shareUrl, setShareUrl] = useState(""); // Added state for sharing URL

  useEffect(() => {
    const fetchData = async (url, setDataCallback) => {
      const response = await fetch(url);
      const data = await response.json();
      setDataCallback(data);
    };

    fetchData(
      `https://api.themoviedb.org/3/movie/${id}?api_key=bb2818a2abb39fbdf6da79343e5e376b`,
      setMovieDetails
    );
    fetchData(
      `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=bb2818a2abb39fbdf6da79343e5e376b`,
      (data) => setRecommendations(data.results.slice(0, 10))
    );
    fetchData(
      `https://api.themoviedb.org/3/movie/${id}/casts?api_key=bb2818a2abb39fbdf6da79343e5e376b`,
      (data) => setCasts(data.cast)
    );

    // Update the share URL in the state
    setShareUrl(window.location.href);
  }, [id]);

  if (!movieDetails || !isLoaded) {
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
    ? movieDetails.overview
    : movieDetails.overview.slice(0, 150) +
      (movieDetails.overview.length > 150 ? "..." : "");

  return (
    <>
      <Header />
      <div className="movieDetails">
        <div className="movie-info">
          <div className="image-container">
            <a href={`/watch/movie/${id}`}>
              <img
                src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
                alt={movieDetails.title || movieDetails.name}
              />
              <div className="overlay">
                <img src="/play.png" alt="Video Logo" className="video-logo" />
              </div>
            </a>
          </div>
          <h1>{movieDetails.original_title}</h1>
          <p>{overview}</p>
          {movieDetails.overview.length > 150 && (
            <button onClick={() => setShowFullOverview(!showFullOverview)}>
              {showFullOverview ? "Read Less" : "Read More"}
            </button>
          )}
          <button
            className="add-to-list"
            onClick={() => (window.location.href = `/list/add/${id}?tv=false`)}
          >
            Add to List
          </button>
          <p>
            Letterboxd:{" "}
            <a
              className="letterboxd"
              href={`https://letterboxd.com/tmdb/${id}`}
            >
              {movieDetails.original_title}
            </a>
          </p>
          <p>Release Date: {movieDetails.release_date}</p>
          <p>Runtime: {movieDetails.runtime} minutes</p>
          <p>
            Genres: {movieDetails.genres.map((genre) => genre.name).join(", ")}
          </p>
          {/* Social media sharing buttons */}
          <div className="social-sharing">
            <p>Share:</p>
            <a
              href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=Check%20out%20${movieDetails.original_title}%20on%20Netflyer `}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter />
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook />
            </a>
            <a
              href={`https://www.instagram.com/?url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram />
            </a>
          </div>
          {recommendations.length === 0 ? (
            <>Recommended Movies: 0</>
          ) : (
            <MovieRow
              title="Recommended Movies"
              items={{ results: recommendations }}
            />
          )}
          <div>
            <h2>Cast</h2>
            {casts.length > 0 && (
              <Slider {...sliderSettings}>
                {casts.map((cast) => (
                  <div key={cast.id} className="cast-item">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${cast.profile_path}`}
                      alt={cast.name}
                    />
                    <p>
                      <strong>{cast.name}</strong> as {cast.character}
                    </p>
                  </div>
                ))}
              </Slider>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieDetails;
