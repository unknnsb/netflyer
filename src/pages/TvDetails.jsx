import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MovieRow from "../components/MovieRow";
import Header from "../components/Header";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/TvDetails.css";
import { useUser } from "@clerk/clerk-react";

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
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [showFullOverview, setShowFullOverview] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [allEpisodesVisible, setAllEpisodesVisible] = useState(false);
  const [episodes, setEpisodes] = useState([]);
  const [credits, setCredits] = useState([]);
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useUser();
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

  useEffect(() => {
    const fetchEpisodes = async () => {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${id}/season/${selectedSeason}?api_key=bb2818a2abb39fbdf6da79343e5e376b`
      );
      const data = await response.json();
      const filteredEpisodes = data.episodes.filter(
        (episode) => episode.season_number !== 0
      );
      setEpisodes(filteredEpisodes);
    };
    fetchEpisodes();
  }, [id, selectedSeason]);

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

  if (!tvDetails || !isLoaded) {
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

  const watch = (season, episode) => {
    navigate(`/watch/tv/${id}/${season}/${episode}`);
  };

  const renderSeasonSelector = () => {
    const options = [];
    for (let i = 1; i <= tvDetails.number_of_seasons; i++) {
      options.push(
        <option key={i} value={i}>
          Season {i}
        </option>
      );
    }
    return (
      <select
        value={selectedSeason}
        onChange={(e) => setSelectedSeason(Number(e.target.value))}
      >
        {options}
      </select>
    );
  };

  const renderEpisodes = () => {
    const displayedEpisodes = allEpisodesVisible
      ? episodes
      : episodes.slice(0, 10);
    return displayedEpisodes.map((episode) => (
      <button
        key={episode.id}
        onClick={() => watch(selectedSeason, episode.episode_number)}
      >
        Episode {episode.episode_number}: {episode.name}
      </button>
    ));
  };

  const openWikipediaPage = (originalName) => {
    const wikipediaUrl = `https://en.wikipedia.org/wiki/${originalName}`;
    window.open(wikipediaUrl, "_blank");
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
          <h1>{tvDetails.name}</h1>
          <p>{overview}</p>
          {tvDetails.overview.length > 150 && (
            <button onClick={() => setShowFullOverview(!showFullOverview)}>
              {showFullOverview ? "Read Less" : "Read More"}
            </button>
          )}
          <button
            className="add-to-list"
            onClick={() => (window.location.href = `/list/add/${id}?tv=true`)}
          >
            Add to List
          </button>
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
          <div className="tvSelector">
            <div className="seasonSelector">{renderSeasonSelector()}</div>
            <div className="episodeList">
              {renderEpisodes()}
              {episodes.length > 10 && !allEpisodesVisible && (
                <button onClick={() => setAllEpisodesVisible(true)}>
                  View All Episodes
                </button>
              )}
              {allEpisodesVisible && (
                <button onClick={() => setAllEpisodesVisible(false)}>
                  Hide All Episode
                </button>
              )}
            </div>
          </div>
          <MovieRow
            title="Recommended Shows"
            items={{ results: recommendations }}
          />
          <div className="cast-carousel">
            <h2>Cast</h2>
            {credits.length > 0 && (
              <Slider {...sliderSettings}>
                {credits.map((credit) => (
                  <div key={credit.id} className="cast-item">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${credit.profile_path}`}
                      alt={credit.name}
                      onClick={() => openWikipediaPage(credit.original_name)}
                    />
                    <p>
                      <strong>{credit.name}</strong> as {credit.character}
                    </p>
                  </div>
                ))}
              </Slider>
            )}
          </div>
          <div className="social-sharing">
            <p>Share:</p>
            <a href="#" onClick={shareOnTwitter}>
              Twitter
            </a>
            <a href="#" onClick={shareOnFacebook}>
              Facebook
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default TvDetails;
