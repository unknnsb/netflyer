import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MovieRow from "../components/MovieRow";
import Header from "../components/Header";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useUser } from "@clerk/clerk-react";
import RecommendationCard from "../components/RecommendationCard";
import Loading from "../components/Loading";

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

const TvDetails = () => {
  const [tvDetails, setTvDetails] = useState(null);
  const [allEpisodesVisibleBySeason, setAllEpisodesVisibleBySeason] = useState(
    {}
  );
  const [selectedSeasonNumber, setSelectedSeasonNumber] = useState(1);
  const [recommendations, setRecommendations] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [credits, setCredits] = useState([]);
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useUser();
  const { id } = useParams();

  useEffect(() => {
    const fetchTvDetails = async () => {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${id}?api_key=bb2818a2abb39fbdf6da79343e5e376b`
      );
      const data = await response.json();
      setTvDetails(data);
    };
    fetchTvDetails();
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

  useEffect(() => {
    const fetchEpisodes = async () => {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${id}/season/${selectedSeasonNumber}?api_key=bb2818a2abb39fbdf6da79343e5e376b`
      );
      const data = await response.json();
      const filteredEpisodes = data.episodes.filter(
        (episode) => episode.season_number !== 0
      );
      setEpisodes(filteredEpisodes);
    };
    fetchEpisodes();
  }, [id, selectedSeasonNumber]);

  useEffect(() => {
    const fetchCredits = async () => {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${id}/credits?api_key=bb2818a2abb39fbdf6da79343e5e376b`
      );
      const data = await response.json();
      setCredits(data.cast);
    };
    fetchCredits();
  }, [id]);

  const shareOnTwitter = () => {
    const shareUrl = `https://twitter.com/intent/tweet?url=${window.location.href}`;
    window.open(shareUrl, "_blank");
  };

  const shareOnFacebook = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`;
    window.open(shareUrl, "_blank");
  };

  const watch = (season, episode) => {
    navigate(`/watch/tv/${id}/${season}/${episode}`);
  };

  const addToWatchList = () => {
    navigate(`/list/add/${id}?tv=true`);
  };

  const toggleEpisodesVisibility = (seasonNumber) => {
    setAllEpisodesVisibleBySeason((prevState) => ({
      ...prevState,
      [seasonNumber]: !prevState[seasonNumber],
    }));
  };

  const renderEpisodes = (seasonNumber) => {
    const displayedEpisodes = allEpisodesVisibleBySeason[seasonNumber]
      ? episodes
      : episodes.slice(0, 10);
    return displayedEpisodes.map((episode) => (
      <button
        key={episode.id}
        onClick={() => watch(seasonNumber, episode.episode_number)}
        className="bg-red-500 ml-3 hover:bg-red-600 text-white px-4 py-2 rounded-md focus:outline-none"
      >
        Episode {episode.episode_number}: {episode.name}
      </button>
    ));
  };

  if (!tvDetails) {
    return <Loading />;
  }

  return (
    <div>
      <Header changeOnScroll={false} />
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1">
            <img
              src={`https://image.tmdb.org/t/p/w500${tvDetails.poster_path}`}
              alt={tvDetails.original_name}
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
          <div className="col-span-2 space-y-4 md:mt-20">
            <h1 className="text-2xl font-bold">{tvDetails.name}</h1>
            <p className="text-gray-600">{tvDetails.overview}</p>
            <button
              onClick={() => setShowFullOverview(!showFullOverview)}
              className="text-red-500 hover:underline focus:outline-none"
            >
              Read More
            </button>
            <button
              className="bg-red-500 ml-2 hover:bg-red-600 text-white px-4 py-2 rounded-md focus:outline-none"
              onClick={addToWatchList}
            >
              Add to Watch List
            </button>
            <div className="flex items-center space-x-2">
              <p className="text-gray-600">Share:</p>
              <button
                className="text-red-500 hover:text-red-600 focus:outline-none"
                onClick={shareOnTwitter}
              >
                Twitter
              </button>
              <button
                className="text-red-500 hover:text-red-600 focus:outline-none"
                onClick={shareOnFacebook}
              >
                Facebook
              </button>
            </div>
            <div className="mt-4">
              <div className="flex items-center space-x-4">
                <p className="text-gray-600">Select Season:</p>
                <select
                  value={selectedSeasonNumber}
                  onChange={(e) =>
                    setSelectedSeasonNumber(Number(e.target.value))
                  }
                  className="bg-gray-100 p-2 text-black rounded-md focus:outline-none"
                >
                  {tvDetails.seasons.map((season) => (
                    <option
                      key={season.season_number}
                      value={season.season_number}
                    >
                      Season {season.season_number}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => toggleEpisodesVisibility(selectedSeasonNumber)}
                  className="text-red-500 hover:underline focus:outline-none"
                >
                  {allEpisodesVisibleBySeason[selectedSeasonNumber]
                    ? "Show Less Episodes"
                    : "Show All Episodes"}
                </button>
              </div>
              <div className="mt-2 space-y-2">
                {renderEpisodes(selectedSeasonNumber)}
              </div>
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
              {credits.length > 0 && (
                <Slider {...sliderSettings}>
                  {credits.map((credit) => (
                    <div key={credit.id} className="cast-item">
                      <img
                        src={`https://image.tmdb.org/t/p/w500${credit.profile_path}`}
                        alt={credit.name}
                        onClick={() => openWikipediaPage(credit.original_name)}
                        className="w-full h-auto rounded-lg cursor-pointer"
                      />
                      <p className="mt-2">
                        <strong>{credit.name}</strong> as {credit.character}
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

export default TvDetails;
