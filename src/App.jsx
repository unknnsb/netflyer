import Check from "./components/Check";
import HeroSection from "./components/Hero";
import Loading from "./components/Loading";
import Row from "./components/MovieRow";
import Header from "./components/Navbar";
import { TMDB_URL, TMDB_API_KEY, endpoints } from "./services/Tmdb";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [trendingTvData, setTrendingTvData] = useState(null);
  const [trendingMoviesData, setTrendingMoviesData] = useState(null);
  const [trendingData, setTrendingData] = useState(null);
  const [airingTodayData, setAiringTodayData] = useState(null);
  const [popularData, setPopularData] = useState(null);
  const [animeData, setAnimeData] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDataPromises = [
      fetchEndpointData(endpoints.trending_tv, setTrendingTvData),
      fetchEndpointData(endpoints.trending_movies, setTrendingMoviesData),
      fetchEndpointData(endpoints.trending, setTrendingData),
      fetchEndpointData(endpoints.airing_today, setAiringTodayData),
      fetchEndpointData(endpoints.popular, setPopularData),
      fetchEndpointData(endpoints.anime, setAnimeData),
    ];

    Promise.all(fetchDataPromises)
      .then(() => {
        setLoading(false); // Hide loading once all data is fetched
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const fetchEndpointData = (endpoint, setStateFunction) => {
    return axios
      .get(`${TMDB_URL}${endpoint}`, {
        params: {
          api_key: TMDB_API_KEY,
        },
      })
      .then((response) => {
        setStateFunction(response.data.results);
      })
      .catch((error) => {
        console.error(`Error fetching data from ${endpoint}:`, error);
      });
  };
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Header />
          <Check />
          <HeroSection />
          <Row items={trendingMoviesData} title="Trending Movies" />
          <Row items={trendingTvData} title="Trending TV" />
          <Row items={animeData} title="Anime" />
          <Row items={popularData} title="Popular" />
          <Row items={airingTodayData} title="Airing Today" />
        </>
      )}
    </>
  );
};

export default App;
