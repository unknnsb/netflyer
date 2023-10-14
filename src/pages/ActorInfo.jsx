import Spinner from "../components/Loading";
import MovieRow from "../components/MovieRow";
import Navbar from "../components/Navbar";
import React, { useState, useEffect } from "react";
import { FaImdb } from "react-icons/fa";
import { useParams } from "react-router-dom";

const ActorInfoPage = () => {
  const { id } = useParams();
  const [actorInfo, setActorInfo] = useState(null);
  const [movieCredits, setMovieCredits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFullBio, setShowFullBio] = useState(false);

  useEffect(() => {
    const fetchActorInfo = async () => {
      try {
        const TMDB_API_KEY = "bb2818a2abb39fbdf6da79343e5e376b";
        const [actorResponse, movieCreditsResponse] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/person/${id}?language=en-US&api_key=${TMDB_API_KEY}`
          ),
          fetch(
            `https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${TMDB_API_KEY}`
          ),
        ]);

        if (!actorResponse.ok || !movieCreditsResponse.ok) {
          throw new Error("Network response was not ok");
        }

        const actorData = await actorResponse.json();
        const movieCreditsData = await movieCreditsResponse.json();

        setActorInfo(actorData);
        setMovieCredits(movieCreditsData.cast);
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

  return (
    <div className="bg-dark text-white">
      <Navbar />
      <div
        className="bg-cover bg-center relative"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/w1280/${actorInfo.profile_path})`,
        }}
      >
        <div className="bg-gradient-to-t from-stone-700 to-transparent p-8">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/3 md:pr-4 mb-4 md:mb-0">
                <img
                  src={`https://image.tmdb.org/t/p/w500/${actorInfo.profile_path}`}
                  alt="Actor Profile"
                  className="w-64 h-64 md:w-80 md:h-80 rounded-lg shadow-2xl mx-auto md:mx-0"
                />
              </div>
              <div className="md:w-2/3">
                <h1
                  className="text-4xl font-bold mb-4 cursor-pointer"
                  onClick={() => {
                    window.location.href = actorInfo.homepage;
                  }}
                >
                  {actorInfo.name}
                </h1>
                <p>Birthday: {actorInfo.birthday}</p>
                <p>Place of Birth: {actorInfo.place_of_birth}</p>
                <p className="mt-4 text-xl">
                  {showFullBio
                    ? actorInfo.biography
                    : `${actorInfo.biography.slice(0, 200)}...`}
                  <button
                    className="text-blue-500 cursor-pointer"
                    onClick={toggleFullBio}
                  >
                    {showFullBio ? "Read Less" : "Read More"}
                  </button>
                </p>
                <h2 className="text-2xl mt-4">Movie Credits:</h2>
                <MovieRow movies={movieCredits} header={null} />
                <p className="mt-2 text-lg flex items-center">
                  <span className="bg-yellow-500 p-1 rounded-md">IMDb</span>:{" "}
                  <a
                    href={`https://www.imdb.com/name/${actorInfo.imdb_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white flex items-center"
                  >
                    <FaImdb className="ml-2" /> IMDb
                  </a>
                </p>
                <p className="mt-2 text-lg flex items-center">
                  <span className="bg-red-500 p-1 rounded-md">Popularity</span>:{" "}
                  {actorInfo.popularity}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActorInfoPage;
