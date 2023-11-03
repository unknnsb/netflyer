import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import { TMDB_API_KEY, endpoints, TMDB_URL } from "../services/Tmdb";
import { ANIME } from "@consumet/extensions";
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
      // const pkg = async () => {
      //   const anime = new ANIME.Gogoanime();
      //   await anime.search(query).then(async (res) => {
      //     setAnimeResults(res.results);
      //     const firstAnime = res.results[0];
      //     const animeInfo = await anime.fetchAnimeInfo(firstAnime.id);
      //     console.log(animeInfo);
      //   });
      // };
      // pkg();
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
    <div className="bg-dark mt-10 text-white min-h-screen">
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Search</h1>
        <div className="relative mb-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-stone-800 text-white w-full py-2 pl-10 pr-4 rounded-full focus:outline-none focus:shadow-outline"
            placeholder="What do you want to search?"
          />
          <div className="absolute top-0 left-0 mt-[10px] ml-4">
            <FaSearch />
          </div>
          {/* Tabs */}
          <div className="flex mt-4">
            <button
              onClick={() => setSelectedTab("movie")}
              className={`px-4 py-2 mr-4 rounded-full ${
                selectedTab === "movie" ? "bg-white text-dark" : "bg-stone-800"
              }`}
            >
              Movies
            </button>
            <button
              onClick={() => setSelectedTab("tv")}
              className={`px-4 py-2 mr-4 rounded-full ${
                selectedTab === "tv" ? "bg-white text-dark" : "bg-stone-800"
              }`}
            >
              TV Shows
            </button>
            <button
              onClick={() => setSelectedTab("anime")}
              className={`px-4 py-2 mr-4 rounded-full ${
                selectedTab === "anime" ? "bg-white text-dark" : "bg-stone-800"
              }`}
            >
              Anime
            </button>
          </div>
        </div>
        {loading ? (
          <Loading />
        ) : (
          <div>
            {selectedTab === "movie" ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {movieResults.map((movie) => (
                  <div
                    onClick={() => handleClick(movie.id, false)}
                    key={movie.id}
                    className="cursor-pointer hover:opacity-75 transition-opacity duration-300"
                  >
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                          : "/not-found.png"
                      }
                      alt={movie.title || movie.name}
                      className="w-full rounded-lg"
                    />
                    <p className="mt-2 text-sm font-semibold">
                      {movie.title || movie.name} (
                      {getDate(movie.release_date || movie.first_air_date)})
                    </p>
                  </div>
                ))}
              </div>
            ) : selectedTab === "tv" ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {tvResults.map((tvShow) => (
                  <div
                    onClick={() => handleClick(tvShow.id, true)}
                    key={tvShow.id}
                    className="cursor-pointer hover:opacity-75 transition-opacity duration-300"
                  >
                    <img
                      src={
                        tvShow.poster_path
                          ? `https://image.tmdb.org/t/p/w500/${tvShow.poster_path}`
                          : "/not-found.png"
                      }
                      alt={tvShow.name}
                      className="w-full rounded-lg"
                    />
                    <p className="mt-2 text-sm font-semibold">{tvShow.name}</p>
                  </div>
                ))}
              </div>
            ) : selectedTab === "anime" ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {animeResults.map((anime) => (
                    <div
                      onClick={() => handleClick(anime.id, true)}
                      key={anime.id}
                      className="cursor-pointer hover:opacity-75 transition-opacity duration-300"
                    >
                      <img
                        src={
                          anime.poster_path
                            ? `https://image.tmdb.org/t/p/w500/${anime.poster_path}`
                            : "/not-found.png"
                        }
                        alt={anime.title}
                        className="w-full rounded-lg"
                      />
                      <p className="mt-2 text-sm font-semibold">
                        {anime.title}
                      </p>
                    </div>
                  ))}
                </div>
                <h2 className="mt-4 text-2xl font-bold mb-3">Anime Movies</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {animeMovieResults.map((anime) => (
                    <div
                      onClick={() => handleClick(anime.id, false)}
                      key={anime.id}
                      className="cursor-pointer hover:opacity-75 transition-opacity duration-300"
                    >
                      <img
                        src={
                          anime.poster_path
                            ? `https://image.tmdb.org/t/p/w500/${anime.poster_path}`
                            : "/not-found.png"
                        }
                        alt={anime.title}
                        className="w-full rounded-lg"
                      />
                      <p className="mt-2 text-sm font-semibold">
                        {anime.title}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div>
                <h2 className="mt-4 text-2xl font-bold">
                  Search Results for "{query}" Not Found.
                </h2>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
