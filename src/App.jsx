import Check from "./components/Check";
import HeroSection from "./components/Hero";
import Loading from "./components/Loading";
import Row from "./components/MovieRow";
import Header from "./components/Navbar";
import { TMDB_URL, TMDB_API_KEY, endpoints } from "./services/Tmdb";
import axios from "axios";
import React, { useEffect, useState } from "react";

const useFetchData = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    trending_tv: null,
    trending_movies: null,
    trending: null,
    airing_today: null,
    popular: null,
    anime: null,
  });

  useEffect(() => {
    const fetchDataPromises = Object.entries(endpoints).map(([key, endpoint]) =>
      axios
        .get(`${TMDB_URL}${endpoint}`, { params: { api_key: TMDB_API_KEY } })
        .then((response) => [key, response.data.results])
    );

    Promise.all(fetchDataPromises)
      .then((results) => {
        setData(Object.fromEntries(results));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return { loading, data };
};

const App = () => {
  const { loading, data } = useFetchData();

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Header />
          <Check />
          <HeroSection />
          <div className="mt-[540px] lg:mt-[450px] md:mt-[530px]">
            {data.trending_movies && (
              <Row items={data.trending_movies} title="Trending Movies" />
            )}
          </div>
          {data.trending_tv && (
            <Row items={data.trending_tv} title="Trending TV" />
          )}
          {data.anime && <Row items={data.anime} title="Anime" />}
          {data.popular && <Row items={data.popular} title="Popular" />}
          {data.airing_today && (
            <Row items={data.airing_today} title="Airing Today" />
          )}
        </>
      )}
    </>
  );
};

export default App;
