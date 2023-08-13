import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaTwitter, FaFacebook, FaInstagram } from "react-icons/fa";
import Header from "../components/Header";
import { useUser } from "@clerk/clerk-react";
import Slider from "react-slick";
import Loading from "../components/Loading";
import RecommendationCard from "../components/RecommendationCard";

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
  const [casts, setCasts] = useState([]);
  const { isLoaded, isSignedIn } = useUser();
  const [shareUrl, setShareUrl] = useState("");
  const navigate = useNavigate();

  if (!isSignedIn) {
    navigate("/sign-in");
  }

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
    setShareUrl(window.location.href);
  }, [id]);

  if (!movieDetails || !isLoaded) {
    return <Loading />;
  }

  const overview = showFullOverview
    ? movieDetails.overview
    : movieDetails.overview.slice(0, 150) +
      (movieDetails.overview.length > 150 ? "..." : "");
  return (
    <div>
      <Header changeOnScroll={false} />
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1">
            <img
              src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
              alt={movieDetails.title || movieDetails.name}
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
          <div className="col-span-2 space-y-4 md:mt-20">
            <h1 className="text-2xl font-bold">
              {movieDetails.original_title}
            </h1>
            <p className="text-gray-600">{overview}</p>
            {movieDetails.overview.length > 150 && (
              <button
                onClick={() => setShowFullOverview(!showFullOverview)}
                className="text-red-500 hover:underline focus:outline-none"
              >
                {showFullOverview ? "Read Less" : "Read More"}
              </button>
            )}
            <button
              className="bg-red-500 ml-2 hover:bg-red-600 text-white px-4 py-2 rounded-md focus:outline-none"
              onClick={() => (window.location.href = `/watch/movie/${id}`)}
            >
              Watch
            </button>
            <button
              className="bg-red-500 ml-2 hover:bg-red-600 text-white px-4 py-2 rounded-md focus:outline-none"
              onClick={() => (window.location.href = `/list/add/${id}`)}
            >
              Add To List
            </button>
            <p className="text-gray-600">
              Letterboxd:{" "}
              <a
                className="text-red-500 hover:underline"
                href={`https://letterboxd.com/tmdb/${id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {movieDetails.original_title}
              </a>
            </p>
            <p>Release Date: {movieDetails.release_date}</p>
            <p>Runtime: {movieDetails.runtime} minutes</p>
            <p>
              Genres:{" "}
              {movieDetails.genres.map((genre) => genre.name).join(", ")}
            </p>
            <div className="flex items-center space-x-2">
              <p className="text-gray-600">Share:</p>
              <a
                href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=Check%20out%20${movieDetails.original_title}%20on%20Netflyer `}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter className="text-red-500 hover:text-red-600" />
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook className="text-red-500 hover:text-red-600" />
              </a>
              <a
                href={`https://www.instagram.com/?url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className="text-red-500 hover:text-red-600" />
              </a>
            </div>
            <div className="mt-6">
              <h2 className="text-xl font-semibold">People Also Watch</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                {recommendations.map((recommendation) => (
                  <RecommendationCard
                    key={recommendation.id}
                    movie={recommendation}
                  />
                ))}
              </div>
            </div>
            <div className="mt-6">
              <h2 className="text-xl font-semibold">Cast</h2>
              {casts.length > 0 && (
                <Slider {...sliderSettings}>
                  {casts.map((cast) => (
                    <div key={cast.id} className="cast-item">
                      <img
                        src={`https://image.tmdb.org/t/p/w500${cast.profile_path}`}
                        alt={cast.name}
                        className="w-full h-auto rounded-lg"
                      />
                      <p className="mt-2">
                        <strong>{cast.name}</strong> as {cast.character}
                      </p>
                    </div>
                  ))}
                </Slider>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
