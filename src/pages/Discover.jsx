import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { TMDB_API_KEY } from "../services/Tmdb";
import { Button, Image, Spinner } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

const Discover = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedTVShows, setTopRatedTVShows] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          popularMoviesResponse,
          topRatedTVShowsResponse,
          trendingResponse,
        ] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`
          ),
          fetch(
            `https://api.themoviedb.org/3/tv/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=1`
          ),
          fetch(
            `https://api.themoviedb.org/3/trending/all/day?api_key=${TMDB_API_KEY}`
          ),
        ]);

        const popularMoviesData = await popularMoviesResponse.json();
        const topRatedTVShowsData = await topRatedTVShowsResponse.json();
        const trendingData = await trendingResponse.json();

        setPopularMovies(popularMoviesData.results);
        setTopRatedTVShows(topRatedTVShowsData.results);
        setTrending(trendingData.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <Spinner color="primary" size="xl" />
      </div>
    );
  }

  const renderItems = (items, type) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-lg bg-gray-800 overflow-hidden shadow-lg"
        >
          <Image
            src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
            alt={item.title || item.name}
            className="cursor-pointer transition-transform duration-300 hover:scale-105"
            onClick={() => navigate(`/info/${type}/${item.id}`)}
          />
          <div className="p-2">
            <h3 className="text-lg font-semibold truncate">
              {item.title || item.name}
            </h3>
            <p className="text-sm text-gray-400">
              {item.release_date || item.first_air_date}
            </p>
            <p className="text-sm text-gray-400">
              {item.vote_average
                ? `Rating: ${item.vote_average}`
                : `Popularity: ${item.popularity}`}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-8 p-8 bg-gray-900 text-white">
        <section className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Discover</h1>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Popular Movies</h2>
          {renderItems(popularMovies, "movie")}
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Top Rated TV Shows</h2>
          {renderItems(topRatedTVShows, "tv")}
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Trending</h2>
          {renderItems(trending, "all")}
        </section>
      </div>
    </>
  );
};

export default Discover;
