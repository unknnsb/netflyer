import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import { TMDB_API_KEY, endpoints, TMDB_URL } from "../services/Tmdb";
import {
  Input,
  Card,
  CardBody,
  Image,
  Button,
  Tabs,
  Tab,
} from "@nextui-org/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [movieResults, setMovieResults] = useState([]);
  const [tvResults, setTvResults] = useState([]);
  const [animeResults, setAnimeResults] = useState([]);
  const [animeMovieResults, setAnimeMovieResults] = useState([]);
  const [selectedTab, setSelectedTab] = useState("movie");
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (!query) {
      return;
    } else if (selectedTab === "movie") {
      axios
        .get(`${TMDB_URL}${endpoints.searchMovie}`, {
          params: {
            with_text_query: query,
            api_key: TMDB_API_KEY,
          },
        })
        .then((res) => {
          setMovieResults(res.data.results);
        });
    } else if (selectedTab === "tv") {
      axios
        .get(`${TMDB_URL}${endpoints.searchTv}`, {
          params: {
            with_text_query: query,
            api_key: TMDB_API_KEY,
          },
        })
        .then((res) => {
          setTvResults(res.data.results);
        });
    } else if (selectedTab === "anime") {
      axios
        .get(`${TMDB_URL}${endpoints.searchAnime}`, {
          params: {
            with_text_query: query,
            api_key: TMDB_API_KEY,
          },
        })
        .then((res) => {
          setAnimeResults(res.data.results);
        });
      axios
        .get(`${TMDB_URL}${endpoints.searchAnimeMovie}`, {
          params: {
            with_text_query: query,
            api_key: TMDB_API_KEY,
          },
        })
        .then((res) => {
          setAnimeMovieResults(res.data.results);
        });
    }
  }, [query, selectedTab]);

  const handleClick = (id, tvShow) => {
    if (tvShow) {
      navigate(`/info/tv/${id}`);
    } else {
      navigate(`/info/movie/${id}`);
    }
  };

  const getDate = (date) => {
    const dateObject = new Date(date);
    const year = dateObject.getFullYear();
    return year;
  };

  return (
    <div className="text-white">
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Search</h1>
        <div className="relative mb-4">
          <Input
            value={query}
            startContent={<FaSearch />}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What do you want to search?"
          />
          <Tabs
            selectedKey={selectedTab}
            onSelectionChange={setSelectedTab}
            className="flex mt-4"
            variant="underlined"
          >
            <Tab key="movie" title="Movies">
              <div className="text-center mb-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {movieResults.map((movie) => (
                    <Card
                      key={movie.id}
                      className="cursor-pointer hover:opacity-75 transition-opacity duration-300"
                    >
                      <Image
                        onClick={() =>
                          (window.location.href = `/info/movie/${movie.id}`)
                        }
                        src={
                          movie.poster_path
                            ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                            : "/not-found.png"
                        }
                        alt={movie.title || movie.name}
                        className="w-full rounded-lg"
                        fallbackSrc="/not-found.png"
                      />
                      <CardBody>
                        <p className="mt-2 text-sm font-semibold">
                          {movie.title || movie.name} (
                          {getDate(movie.release_date || movie.first_air_date)})
                        </p>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </div>
            </Tab>
            <Tab key="tv" title="TV Shows">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {tvResults.map((tvShow) => (
                  <Card
                    key={tvShow.id}
                    className="cursor-pointer hover:opacity-75 transition-opacity duration-300"
                  >
                    <Image
                      onClick={() =>
                        (window.location.href = `/info/tv/${tvShow.id}`)
                      }
                      src={
                        tvShow.poster_path
                          ? `https://image.tmdb.org/t/p/w500/${tvShow.poster_path}`
                          : "/not-found.png"
                      }
                      alt={tvShow.name}
                      className="w-full rounded-lg"
                      fallbackSrc="/not-found.png"
                    />
                    <CardBody>
                      <p className="mt-2 text-sm font-semibold">
                        {tvShow.name} ({getDate(tvShow.first_air_date)})
                      </p>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </Tab>
            <Tab key="anime" title="Anime">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {animeResults.map((anime) => (
                  <Card
                    key={anime.id}
                    className="cursor-pointer hover:opacity-75 transition-opacity duration-300"
                  >
                    <Image
                      onClick={() =>
                        (window.location.href = `/info/tv/${anime.id}`)
                      }
                      src={
                        anime.poster_path
                          ? `https://image.tmdb.org/t/p/w500/${anime.poster_path}`
                          : "/not-found.png"
                      }
                      alt={anime.title || anime.name}
                      className="w-full rounded-lg"
                      fallbackSrc="/not-found.png"
                    />
                    <CardBody>
                      <p className="mt-2 text-sm font-semibold">
                        {anime.title || anime.name} (
                        {getDate(anime.release_date || anime.first_air_date)})
                      </p>
                    </CardBody>
                  </Card>
                ))}
              </div>
              <h2 className="text-3xl font-bold mb-4">Anime Movies</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {animeMovieResults.map((animeMovie) => (
                  <Card
                    key={animeMovie.id}
                    className="cursor-pointer hover:opacity-75 transition-opacity duration-300"
                  >
                    <Image
                      onClick={() =>
                        (window.location.href = `/info/movie/${animeMovie.id}`)
                      }
                      src={
                        animeMovie.poster_path
                          ? `https://image.tmdb.org/t/p/w500/${animeMovie.poster_path}`
                          : "/not-found.png"
                      }
                      alt={animeMovie.title || animeMovie.name}
                      className="w-full rounded-lg"
                      fallbackSrc="/not-found.png"
                    />
                    <CardBody>
                      <p className="mt-2 text-sm font-semibold">
                        {animeMovie.title || animeMovie.name} (
                        {getDate(
                          animeMovie.release_date || animeMovie.first_air_date
                        )}
                        )
                      </p>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
