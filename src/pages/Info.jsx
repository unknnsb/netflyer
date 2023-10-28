import Spinner from "../components/Loading";
import Navbar from "../components/Navbar";
import { auth, db } from "../services/Firebase";
import { TMDB_URL, TMDB_API_KEY } from "../services/Tmdb";
import { onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { FiCheck, FiStar, FiX } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { createToast } from "vercel-toast";

const InfoPage = () => {
  const { type, id } = useParams();
  const [details, setDetails] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [episodes, setEpisodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOverview, setExpandedOverview] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [cast, setCast] = useState([]);
  const [user, setUser] = useState(false);
  const [userID, setUserID] = useState();
  const [watchlistLoading, setWatchlistLoading] = useState(true);
  const [watchlist, setWatchlist] = useState(false);
  const navigate = useNavigate();

  const toggleOverview = (episodeId) => {
    setExpandedOverview((prevState) => ({
      ...prevState,
      [episodeId]: !prevState[episodeId],
    }));
  };

  const qFunc = async (user_id) => {
    const q = query(
      collection(db, "watchlist"),
      where("userID", "==", user_id)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      if (doc.data().type === type && doc.data().id === id) {
        setWatchlist(true);
        setWatchlistLoading(false);
      }
    });
    setWatchlistLoading(false);
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(true);
        setUserID(user.uid);
        qFunc(user.uid);
      } else {
        setUser(false);
        setWatchlistLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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

        const castResponse = await fetch(
          `${TMDB_URL}/${type}/${id}/credits?api_key=${TMDB_API_KEY}`
        );
        if (castResponse.ok) {
          const castData = await castResponse.json();
          setCast(castData.cast);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
    if (type === "tv" && id === "95479") {
      alert(
        "NOTE: The Second Season Episodes Of Jujutsu Kaisen Shows In Season 1 So Scroll Down To See Second Season Episodes"
      );
    } else {
      return;
    }
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
    return <Spinner />;
  }

  let inProduction = "Unknown";
  if (details.last_episode_to_air) {
    const { episode_type, season_number } = details.last_episode_to_air;

    if (episode_type === "finale") {
      inProduction = "Ended";
    } else if (episode_type === "standard") {
      inProduction = `Now Airing: Season ${season_number}`;
    }
  }

  const onPerson = (actorId) => {
    navigate(`/actor/${actorId}`);
  };

  const addToWatchList = async (itemId, itemType) => {
    if (!user) {
      return createToast("You need to be logged in to use this feature.", {
        action: {
          text: "Login",
          callback(toast) {
            navigate("/login");
            toast.destroy();
          },
        },
        cancel: "Cancel",
        type: "dark",
      });
    }
    if (!userID) {
      return createToast("Please wait. Try again after 2 seconds.", {
        cancel: "Cancel",
        type: "dark",
      });
    }
    setWatchlistLoading(true);
    const docRef = await addDoc(collection(db, "watchlist"), {
      type: itemType,
      id: itemId,
      userID: userID,
    }).then(() => {
      setWatchlistLoading(false);
    });
    qFunc(userID);
  };

  const removeFromWatchlist = async (id, type) => {
    setWatchlistLoading(true);
    const q = query(collection(db, "watchlist"), where("userID", "==", userID));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      const data = doc.data();
      if (data.type === type && data.id === id) {
        const docRef = doc.ref;
        await deleteDoc(docRef).then(() => {
          setWatchlist(false);
          setWatchlistLoading(false);
        });
      }
      qFunc(userID);
    });
  };

  return (
    <>
      <Navbar />
      <div
        className="bg-dark text-white opacity-80 relative"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/w1280/${details.backdrop_path})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent"></div>
        <div className="container mx-auto p-4 md:p-8 relative">
          <div className="md:flex mt-10">
            <div className="md:w-1/3 md:pr-8 mb-4 md:mb-0">
              <img
                src={`https://image.tmdb.org/t/p/w300/${details.poster_path}`}
                alt="Poster"
                className="w-48 md:w-64 rounded-lg shadow-lg mx-auto md:mx-0"
              />
            </div>
            <div className="md:w-2/3">
              <h1
                onClick={() => {
                  window.location.href = details.homepage;
                }}
                className="text-3xl md:text-5xl font-bold mb-2"
              >
                {type === "movie" ? details.title : details.name}
              </h1>
              <div className="mb-4">
                <h2 className="text-xl md:text-2xl font-semibold mb-2">
                  Overview
                </h2>
                <p className="text-base md:text-lg">{details.overview}</p>
              </div>
              <p className="text-base mt-1 mb-1 flex md:text-lg">
                <span className="bg-slate-700 p-1 bg-opacity-50 rounded-md">
                  IMDB
                </span>
                : {details.vote_average} <FiStar className="mt-1 ml-1" />
              </p>
              <p className="text-base md:text-lg">
                {type === "movie" ? (
                  <span>
                    <span className="bg-slate-700 p-1 bg-opacity-60 rounded-md">
                      Release Date
                    </span>
                    : {details.release_date}
                  </span>
                ) : (
                  <span>
                    <span className="bg-slate-700 p-1 bg-opacity-60 rounded-md">
                      Release Date
                    </span>
                    : {details.first_air_date} - {inProduction}
                  </span>
                )}
              </p>
              <p
                className={
                  type === "tv"
                    ? "text-base mt-1 mb-1 md:text-lg"
                    : "text-base mt-1 mb-2 md:text-lg"
                }
              >
                <span className="bg-slate-700 p-1 bg-opacity-50 rounded-md">
                  Genre
                </span>
                : {details.genres.map((genre) => genre.name).join(", ")}
              </p>
              {type === "tv" && (
                <p className="text-base md:text-lg mb-2">
                  <span className="bg-slate-700 p-1 bg-opacity-60 rounded-md">
                    Total Seasons
                  </span>
                  : {details.number_of_seasons}
                </p>
              )}
              <div className="flex">
                <button
                  type="button"
                  className="bg-red-700 hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 text-white font-semibold text-base md:text-lg px-6 py-2 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
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
                {watchlistLoading ? (
                  <button className="bg-red-700 flex items-center ml-2 hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 text-white font-semibold text-base md:text-lg px-6 py-2 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                    <div
                      className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                      role="status"
                    >
                      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                        Loading...
                      </span>
                    </div>
                  </button>
                ) : (
                  <>
                    {watchlist ? (
                      <button
                        type="button"
                        onClick={() => {
                          removeFromWatchlist(id, type);
                        }}
                        className="bg-red-700 flex items-center ml-2 hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 text-white font-semibold text-base md:text-lg px-6 py-2 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                      >
                        <FiX className="mr-1 text-lg font-bold" />
                        Remove WatchList
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          addToWatchList(id, type);
                        }}
                        className="bg-red-700 flex items-center ml-2 hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 text-white font-semibold text-base md:text-lg px-6 py-2 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                      >
                        <FiCheck className="mr-1 text-lg font-bold" />
                        WatchList
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-4 ml-2">
        <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-white">
          Cast
        </h2>
        <div className="flex space-x-2 overflow-x-auto md:space-x-4">
          {cast.map((actor) => (
            <div
              onClick={() => onPerson(actor.id)}
              key={actor.id}
              className="w-56 md:w-64 p-2"
            >
              <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out relative">
                <img
                  src={
                    actor.profile_path
                      ? `https://image.tmdb.org/t/p/w200/${actor.profile_path}`
                      : "/not-found.png"
                  }
                  alt={actor.name}
                  className="max-w-[900px] h-52 object-cover rounded-t-lg cursor-pointer"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent p-4">
                  <p className="text-sm md:text-base font-semibold text-white mb-1 text-center">
                    {actor.name.length > 15
                      ? `${actor.name.substring(0, 15)}...`
                      : actor.name}
                  </p>
                  <p className="text-xs md:text-sm text-gray-500 text-center">
                    {actor.character}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {type === "tv" && (
        <div className="mb-2 ml-2">
          <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-white">
            Seasons
          </h2>
          <div className="flex p-2 space-x-2 md:space-x-4 overflow-x-auto">
            {[...Array(details.number_of_seasons).keys()].map(
              (seasonNumber) => (
                <button
                  key={seasonNumber + 1}
                  className={`${
                    selectedSeason === seasonNumber + 1
                      ? "bg-red-500 text-white"
                      : "bg-gray-400 text-black"
                  } px-2 md:px-4 py-1 md:py-2 rounded-lg text-base md:text-lg`}
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
        <div className="p-3 text-white">
          <h2 className="text-xl md:text-2xl font-semibold mb-2">
            Episodes - Season {selectedSeason}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {episodes.map((episode) => (
              <div key={episode.id} className="text-center mb-6">
                <img
                  src={
                    episode.still_path
                      ? `https://image.tmdb.org/t/p/original/${episode.still_path}`
                      : "/not-found.png"
                  }
                  alt={episode.name}
                  className="w-full h-auto rounded-lg cursor-pointer"
                  onClick={() => {
                    navigate(
                      `/watch/${type}/${id}/${selectedSeason}/${episode.episode_number}`
                    );
                  }}
                />
                <h3 className="text-base md:text-lg mt-2 mb-2 overflow-hidden">
                  {episode.episode_number}.{" "}
                  {episode.name.length > 30
                    ? `${episode.name.substring(0, 30)}...`
                    : episode.name}
                </h3>
                <p
                  className={`text-xs md:text-sm ${
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
                    {expandedOverview[episode.id] ? "Read Less" : "Read More"}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl ml-2 text-white md:text-3xl font-semibold mb-2">
          You May Also Like This
        </h2>
        <div className="grid p-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((recommendation) => (
            <div
              onClick={() => {
                if (recommendation.first_air_date) {
                  window.location.href = `/info/tv/${recommendation.id}`;
                } else {
                  window.location.href = `/info/movie/${recommendation.id}`;
                }
              }}
              key={recommendation.id}
              className="hover:transform hover:scale-105 transition-transform duration-500 ease-in-out text-white text-center mb-6"
            >
              <img
                src={
                  recommendation.poster_path
                    ? `https://image.tmdb.org/t/p/w500/${recommendation.poster_path}`
                    : "/not-found.png"
                }
                alt={recommendation.title || recommendation.name}
                className="w-full h-100 rounded-lg cursor-pointer"
              />
              <h3 className="text-base md:text-lg mt-2 mb-2 overflow-hidden">
                {recommendation.title || recommendation.name}
              </h3>
              <p
                className={`text-xs md:text-sm ${
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
    </>
  );
};

export default InfoPage;
