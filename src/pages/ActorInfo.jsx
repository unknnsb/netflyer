import Spinner from "../components/Loading";
import Navbar from "../components/Navbar";
import React, { useState, useEffect } from "react";
import { FaImdb } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

const ActorInfoPage = () => {
  const { id } = useParams();
  const [actorInfo, setActorInfo] = useState(null);
  const [movieCredits, setMovieCredits] = useState([]);
  const [tvCredits, setTvCredits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFullBio, setShowFullBio] = useState(false);
  const [toggleTvShow, setToggleTvShow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActorInfo = async () => {
      try {
        const TMDB_API_KEY = "bb2818a2abb39fbdf6da79343e5e376b";
        const [actorResponse, movieCreditsResponse, tvCreditsResponse] =
          await Promise.all([
            fetch(
              `https://api.themoviedb.org/3/person/${id}?language=en-US&api_key=${TMDB_API_KEY}`
            ),
            fetch(
              `https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${TMDB_API_KEY}`
            ),
            fetch(
              `https://api.themoviedb.org/3/person/${id}/tv_credits?api_key=${TMDB_API_KEY}`
            ),
          ]);

        if (
          !actorResponse.ok ||
          !movieCreditsResponse.ok ||
          !tvCreditsResponse.ok
        ) {
          throw Error("Network response was not ok");
        }

        const actorData = await actorResponse.json();
        const movieCreditsData = await movieCreditsResponse.json();
        const tvCreditsData = await tvCreditsResponse.json();

        setActorInfo(actorData);
        setMovieCredits(movieCreditsData.cast);
        setTvCredits(tvCreditsData.cast);
      } catch (error) {
        console.error("Error fetching actor info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActorInfo();
  }, [id]);

  if (isLoading) {
    return <Spinner />;
  }

  const toggleFullBio = () => {
    setShowFullBio(!showFullBio);
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  return (
    <>
      <Navbar />
      <div className="bg-dark mt-5 md:mt-10 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2">
              <img
                src={`https://image.tmdb.org/t/p/w500/${actorInfo.profile_path}`}
                alt="Actor Profile"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="w-full mt-2 md:w-1/2 pl-2 md:pl-4">
              <h1
                className="text-3xl md:text-4xl lg:text-5xl font-bold cursor-pointer"
                onClick={() => {
                  window.location.href = actorInfo.homepage;
                }}
              >
                {actorInfo.name}
              </h1>
              <p className="text-sm md:text-base lg:text-lg">
                <span className="text-yellow-500">Birthday:</span>{" "}
                {actorInfo.birthday}
              </p>
              <p className="text-sm md:text-base lg:text-lg">
                <span className="text-yellow-500">Place of Birth:</span>{" "}
                {actorInfo.place_of_birth}
              </p>
              <p className="text-sm md:text-base lg:text-lg">
                {showFullBio
                  ? actorInfo.biography
                  : `${actorInfo.biography.slice(0, 200)}...`}
                <button className="text-blue-500" onClick={toggleFullBio}>
                  {showFullBio ? "Read Less" : "Read More"}
                </button>
              </p>
              <p className="text-sm md:text-base lg:text-lg">
                <span className="text-yellow-500">Gender:</span>{" "}
                {actorInfo.gender === 2 ? "Male" : "Female"}
              </p>
              <p className="text-sm md:text-base lg:text-lg">
                <span className="text-yellow-500">Known For:</span>{" "}
                {actorInfo.known_for_department}
              </p>
              <p className="text-sm md:text-base lg:text-lg">
                <span className="text-yellow-500">Popularity:</span>{" "}
                {actorInfo.popularity}
              </p>
            </div>
          </div>
        </div>

        <div className="flex md:ml-9 mt-4 md:mt-8">
          <h2
            className={
              toggleTvShow
                ? "text-2xl ml-3 md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4"
                : "text-2xl ml-3 md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4 border-b-red-500 border-b-2"
            }
            onClick={() => setToggleTvShow(false)}
          >
            Movies
          </h2>
          <span className="text-2xl ml-3 md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4">
            |
          </span>
          <h2
            className={
              toggleTvShow
                ? "text-2xl ml-3 md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4 border-b-red-500 border-b-2"
                : "text-2xl ml-3 md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4"
            }
            onClick={() => setToggleTvShow(true)}
          >
            TV Series
          </h2>
        </div>

        {toggleTvShow ? (
          <div className="container mx-auto">
            <div className="flex flex-wrap">
              {tvCredits.map((show, index) => (
                <div
                  className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 p-2"
                  key={index}
                >
                  <div className="rounded-lg bg-stone-900 overflow-hidden shadow-lg">
                    <img
                      onClick={() => {
                        navigate(`/info/tv/${show.id}`);
                      }}
                      src={
                        show.poster_path
                          ? `https://image.tmdb.org/t/p/w500/${show.poster_path}`
                          : "/not-found.png"
                      }
                      alt={show.name}
                      className="hover:transform hover:scale-105 transition-transform duration-300 ease-in-out w-full h-64 object-cover"
                    />
                    <div className="p-2">
                      <h3 className="text-lg md:text-xl lg:text-2xl font-semibold mb-2">
                        {truncateText(show.name, 16)}
                      </h3>
                      <p className="text-sm md:text-base lg:text-lg">
                        {show.first_air_date}
                      </p>
                      <p className="text-sm text-gray-600 font-bold md:text-base lg:text-lg">
                        {show.character}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="container mx-auto">
            <div className="flex flex-wrap">
              {movieCredits.map((movie, index) => (
                <div
                  className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 p-2"
                  key={index}
                >
                  <div className="rounded-lg bg-stone-900 overflow-hidden shadow-lg">
                    <img
                      onClick={() => {
                        navigate(`/info/movie/${movie.id}`);
                      }}
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                          : "/not-found.png"
                      }
                      alt={movie.title}
                      className="hover:transform hover:scale-105 transition-transform duration-300 ease-in-out w-full h-64 object-cover"
                    />
                    <div className="p-2">
                      <h3 className="text-lg md:text-xl lg:text-2xl font-semibold mb-2">
                        {truncateText(movie.title, 14)}
                      </h3>
                      <p className="text-sm md:text-base lg:text-lg">
                        {movie.release_date}
                      </p>
                      <p className="text-sm text-gray-600 font-bold md:text-base lg:text-lg">
                        {movie.character}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ActorInfoPage;
