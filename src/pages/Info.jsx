import Spinner from "../components/Loading";
import Navbar from "../components/Navbar";
import { TMDB_URL, TMDB_API_KEY } from "../services/Tmdb";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const InfoPage = () => {
  const { type, id } = useParams();
  const [details, setDetails] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [episodes, setEpisodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOverview, setExpandedOverview] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const navigate = useNavigate();

  const toggleOverview = (episodeId) => {
    setExpandedOverview((prevState) => ({
      ...prevState,
      [episodeId]: !prevState[episodeId],
    }));
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(
          `${TMDB_URL}/${type}/${id}?api_key=${TMDB_API_KEY}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setDetails(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false); // Mark loading as complete
      }
    };

    fetchDetails();
  }, [type, id]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch(
          `${TMDB_URL}/${type}/${id}/recommendations?api_key=${TMDB_API_KEY}`
        );
        if (response.ok) {
          const data = await response.json();
          setRecommendations(data.results);
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    fetchRecommendations();
  }, [type, id]);

  // Fetch episodes for the selected season
  useEffect(() => {
    const fetchEpisodes = async () => {
      if (type === "tv") {
        const response = await fetch(
          `${TMDB_URL}/${type}/${id}/season/${selectedSeason}?api_key=${TMDB_API_KEY}`
        );
        if (response.ok) {
          const data = await response.json();
          setEpisodes(data.episodes);
        }
      }
    };

    fetchEpisodes();
  }, [type, id, selectedSeason]);

  if (isLoading) {
    return <Spinner />; // Display a loading spinner while data is loading
  }

  return (
    <>
      <Navbar />
      <div className="bg-dark text-white">
        <div
          className="h-80 md:h-screen bg-cover relative"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/w500/${details.poster_path})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              {type === "movie" ? details.title : details.name}
            </h1>
          </div>
        </div>

        <div className="container mx-auto p-8">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">
              Overview
            </h2>
            <p className="text-lg">{details.overview}</p>
          </div>
          <p className="text-lg">
            Release Date: {details.release_date || details.first_air_date}
          </p>
          <div className="mb-6">
            <p className="text-lg">
              Genre: {details.genres.map((genre) => genre.name).join(", ")}
            </p>
            {type === "tv" && (
              <p className="text-lg">
                Total Seasons: {details.number_of_seasons}
              </p>
            )}
            <button
              type="button"
              className="bg-red-700 hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 text-white font-semibold text-lg px-6 py-2 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
              onClick={() => {
                if (type === "tv") {
                  navigate(`/watch/${type}/${id}/${selectedSeason}/1`);
                } else {
                  navigate(`/watch/${type}/${id}`);
                }
              }}
            >
              Play
            </button>
          </div>

          {type === "tv" && (
            <div className="mb-4">
              <h2 className="text-2xl md:text-3xl font-semibold mb-2">
                Seasons
              </h2>
              <div className="flex space-x-4 overflow-x-auto">
                {[...Array(details.number_of_seasons).keys()].map(
                  (seasonNumber) => (
                    <button
                      key={seasonNumber + 1}
                      className={`${
                        selectedSeason === seasonNumber + 1
                          ? "bg-red-500 text-white"
                          : "bg-gray-400 text-black"
                      } px-4 py-2 rounded-lg`}
                      onClick={() => setSelectedSeason(seasonNumber + 1)}
                    >
                      Season {seasonNumber + 1}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
          {type === "tv" && (
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold mb-2">
                Episodes - Season {selectedSeason}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {episodes.map((episode) => (
                  <div key={episode.id} className="text-center mb-6">
                    <img
                      src={
                        episode.still_path
                          ? `https://image.tmdb.org/t/p/original/${episode.still_path}`
                          : "/not-found.png"
                      }
                      alt={episode.name}
                      className="w-full h-auto rounded-lg"
                      onClick={() => {
                        navigate(
                          `/watch/${type}/${id}/${selectedSeason}/${episode.episode_number}`
                        );
                      }}
                    />
                    <h3 className="text-lg mt-2 mb-2 overflow-hidden">
                      {episode.episode_number}.{" "}
                      {episode.name.length > 30
                        ? `${episode.name.substring(0, 30)}...`
                        : episode.name}
                    </h3>
                    <p
                      className={`text-sm ${
                        expandedOverview[episode.id]
                          ? "overflow-visible"
                          : "overflow-hidden"
                      }`}
                    >
                      {expandedOverview[episode.id]
                        ? episode.overview
                        : episode.overview.substring(0, 100)}
                    </p>
                    {episode.overview.length > 100 && (
                      <button
                        className="text-blue-500 hover:underline mt-2"
                        onClick={() => toggleOverview(episode.id)}
                      >
                        {expandedOverview[episode.id]
                          ? "Read Less"
                          : "Read More"}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">
              More like this
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.map((recommendation) => (
                <div
                  onClick={() => {
                    if (recommendation.first_air_date) {
                      navigate(`/info/tv/${recommendation.id}`);
                    } else {
                      navigate(`/info/movie/${recommendation.id}`);
                    }
                  }}
                  key={recommendation.id}
                  className="hover:transform hover:scale-110 transition-transform duration-300 ease-in-out text-center mb-6"
                >
                  <img
                    src={
                      recommendation.poster_path
                        ? `https://image.tmdb.org/t/p/w500/${recommendation.poster_path}`
                        : "/not-found.png"
                    }
                    alt={recommendation.title || recommendation.name}
                    className="w-full h-auto rounded-lg"
                  />
                  <h3 className="text-lg mt-2 mb-2 overflow-hidden">
                    {recommendation.title || recommendation.name}
                  </h3>
                  <p
                    className={`text-sm ${
                      expandedOverview[recommendation.id]
                        ? "overflow-visible"
                        : "overflow-hidden"
                    }`}
                  >
                    {expandedOverview[recommendation.id]
                      ? recommendation.overview
                      : recommendation.overview.substring(0, 100)}
                  </p>
                  {recommendation.overview.length > 100 && (
                    <button
                      className="text-blue-500 hover:underline mt-2"
                      onClick={() => toggleOverview(recommendation.id)}
                    >
                      {expandedOverview[recommendation.id]
                        ? "Read Less"
                        : "Read More"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InfoPage;
