import Loading from "../components/Loading";
import MovieRow from "../components/MovieRow";
import { auth, db } from "../services/Firebase";
import { API_KEY, URL } from "../services/Tmdb";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FaCheck, FaArrowLeft, FaPlay, FaPlus, FaStar } from "react-icons/fa";
import { RxVideo } from "react-icons/rx";
import { Link, useNavigate, useParams } from "react-router-dom";

const Info = () => {
  const { type, id } = useParams();
  const [result, setResult] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cast, setCast] = useState([]);
  const [recommendation, setRecommendation] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [showRelated, setRelated] = useState(false);
  const [episodeLoading, setEpisodeLoading] = useState(false);
  const [addingToWatchList, setAddingToWatchList] = useState(false);
  const [watchList, setWatchList] = useState(true);
  const navigate = useNavigate();
  const [userUid, setUserUid] = useState();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/");
      } else {
        setUserUid(user.uid);
        const docRef = doc(db, "watchlist", user.uid);
        setAddingToWatchList(true);
        getDoc(docRef).then((docSnapshot) => {
          if (docSnapshot.exists()) {
            setWatchList(true);
          } else {
            setWatchList(false);
          }
        });
        setAddingToWatchList(false);
      }
    });
  }, []);

  const addToWatchList = async () => {
    setAddingToWatchList(true);
    await setDoc(doc(db, "watchlist", userUid), {
      id: id,
      type: type,
    }).then(() => {
      setWatchlist(true)
      setAddingToWatchList(false);
    });
  };
  const removeFromWatchList = async () => {
    setAddingToWatchList(true);
    await deleteDoc(doc(db, "watchlist", userUid), {
      id: id,
      type: type,
    }).then(() => {
      setAddingToWatchList(false);
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mediaType = type === "tv" ? "tv" : "movie";
        const [res1, res2, res3] = await Promise.all([
          axios.get(`${URL}/${mediaType}/${id}`, {
            params: { api_key: API_KEY },
          }),
          axios.get(`${URL}/${mediaType}/${id}/credits`, {
            params: { api_key: API_KEY },
          }),
          axios.get(`${URL}/${mediaType}/${id}/recommendations`, {
            params: { api_key: API_KEY },
          }),
        ]);

        setResult(res1.data);
        setCast(res2.data.cast);
        setRecommendation(res3.data.results);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id, type]);

  useEffect(() => {
    if (type === "tv") {
      axios
        .get(`${URL}/tv/${id}?api_key=${API_KEY}&language=en-US`)
        .then((response) => {
          setSeasons(response.data.seasons);
        })
        .catch((error) => {
          console.error("Error fetching seasons:", error);
        });

      setEpisodeLoading(true);
      axios
        .get(
          `${URL}/tv/${id}/season/${selectedSeason}?api_key=${API_KEY}&language=en-US`
        )
        .then((response) => {
          setEpisodes(response.data.episodes);
          setEpisodeLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching episodes:", error);
        });
    }
  }, [type, selectedSeason]);

  const formatDate = (dateString) => {
    if (!dateString) {
      return "Release date unavailable";
    }

    const dateOptions = { year: "numeric", month: "long", day: "numeric" };
    const dateParts = dateString.split("-");

    if (dateParts.length !== 3) {
      return "Invalid date format";
    }

    const formattedDate = new Date(
      dateParts[0],
      dateParts[1] - 1,
      dateParts[2]
    );
    return formattedDate.toLocaleDateString(undefined, dateOptions);
  };

  const toggleOverview = () => {
    setExpanded(!expanded);
  };

  const watchMovie = (id) => {
    navigate(`/watch/movie/${id}`);
  };
  const watchTvShow = (id, season, episode) => {
    navigate(`/watch/tv/${id}/${season}/${episode}`);
  };
  const trailer = (type, id) => {
    navigate(`/watch/trailer/${type}/${id}`);
  };

  if (type == "tv" && result.name) {
    document.title = `Netflyer - ${result.name}`;
  } else if (type == "movie" && result.title) {
    document.title = `Netflyer - ${result.title}`;
  }

  return (
    <div className="relative">
      {loading ? (
        <Loading />
      ) : (
        <div>
          <div
            className="absolute inset-0 h-72 bg-cover bg-center w-full"
            style={{
              backgroundImage: `linear-gradient(to top, #202020, transparent), url(https://image.tmdb.org/t/p/original${result.backdrop_path})`,
            }}
          ></div>

          <header className="absolute top-0 left-0 container p-2 text-white flex items-center">
            <Link to="/">
              <FaArrowLeft className="text-xl" />
            </Link>
          </header>

          <div className="absolute top-64 left-0 p-4 text-white">
            {type === "tv" ? (
              <>
                {result.name && (
                  <h1
                    className={
                      result.name.length > 30
                        ? "text-[20px] font-bold"
                        : "text-2xl font-bold"
                    }
                  >
                    {result.name}
                  </h1>
                )}
                {result.first_air_date && (
                  <h2 className="flex items-center text-[10px] mt-2 font-bold gap-1">
                    {`${result.number_of_seasons} Seasons - ${result.number_of_episodes} Episodes`}
                  </h2>
                )}
              </>
            ) : (
              <>
                {result.title && (
                  <h1
                    className={
                      result.title.length > 30
                        ? "text-[20px] font-bold"
                        : "text-2xl font-bold"
                    }
                  >
                    {result.title}
                  </h1>
                )}
                {result.release_date && (
                  <h2 className="flex items-center text-[10px] mt-2 font-bold gap-1">
                    <>
                      <FaStar className="text-sm" /> {result.vote_average} -{" "}
                      {formatDate(result.release_date)}
                    </>
                  </h2>
                )}
              </>
            )}
          </div>

          <button
            onClick={() =>
              type == "movie" ? watchMovie(result.id) : watchTvShow(id, 1, 1)
            }
            className="absolute top-80 flex items-center justify-center mt-4 bg-red-500 gap-1 rounded-lg text-center ml-5 text-white w-[90%] p-2 border-none outline-none"
          >
            <FaPlay /> Play
          </button>

          {result.overview && (
            <p
              className={`text-sm p-2 text-gray-300 ${
                expanded ? "mb-2" : "mb-0"
              } relative top-96`}
            >
              {expanded || result.overview.length <= 120
                ? result.overview
                : `${result.overview.slice(0, 120)}...`}
              {result.overview.length > 120 && (
                <span
                  className="cursor-pointer text-blue-500 ml-1"
                  onClick={toggleOverview}
                >
                  {expanded ? "Read less" : "Read more"}
                </span>
              )}
            </p>
          )}

          <div className="relative flex gap-5 top-[360px] text-white p-2 ml-2 mt-8">
            <button
              onClick={() => {
                if (type == "tv") {
                  trailer("tv", id);
                } else {
                  trailer("movie", id);
                }
              }}
              className="flex items-center flex-col"
            >
              <RxVideo className="text-2xl" />
              <p className="text-center text-[14px] mt-2 text-gray-300">
                Trailer
              </p>
            </button>
            {addingToWatchList ? (
              <div
                className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
              >
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                  Loading...
                </span>
              </div>
            ) : (
              <>
                {watchList ? (
                  <>
                    {addingToWatchList ? (
                      <div
                        className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                        role="status"
                      >
                        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                          Loading...
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center flex-col">
                        <FaCheck
                          onClick={() => removeFromWatchList()}
                          className="text-red-500 text-2xl"
                        />

                        <p className="text-center text-[14px] mt-2 text-gray-400">
                          My List
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {addingToWatchList ? (
                      <div
                        className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                        role="status"
                      >
                        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                          Loading...
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToWatchList()}
                        className="flex items-center flex-col"
                      >
                        <FaPlus className="text-2xl" />
                        <p className="text-center text-[14px] mt-2 text-gray-400">
                          My List
                        </p>
                      </button>
                    )}
                  </>
                )}
              </>
            )}
          </div>

          {type === "movie" ? (
            <div className="relative top-[350px] ml-2">
              <MovieRow title="RELATED" movies={recommendation} />
            </div>
          ) : (
            <div className={`flex flex-col relative top-[350px] ml-2`}>
              <div className="tabs mt-2 w-full sm:w-80 md:w-60 lg:w-40 xl:w-30">
                <h2
                  onClick={() => setRelated(false)}
                  className={`text-red-500 text-lg cursor-pointer mb-2 inline-block px-4 py-2 rounded-t-lg ${
                    showRelated === false ? "border-b-2 border-red-500" : ""
                  }`}
                >
                  EPISODES
                </h2>
                <h2
                  onClick={() => setRelated(true)}
                  className={`text-red-500 text-lg cursor-pointer mb-2 inline-block px-4 py-2 rounded-t-lg ${
                    showRelated === true ? "border-b-2 border-red-500" : ""
                  }`}
                >
                  RELATED
                </h2>
                <div
                  className={`tab-content bg-dark bg-opacity-75 p-4 rounded-b-lg ${
                    showRelated === true ? "hidden" : ""
                  }`}
                >
                  <div className="season-select mb-4">
                    <select
                      id="season"
                      className="ml-2 mr-2 p-2 bg-dark text-white border border-gray-600 rounded-md"
                      value={selectedSeason}
                      onChange={(event) =>
                        setSelectedSeason(parseInt(event.target.value))
                      }
                    >
                      {seasons.map((season) =>
                        season.season_number !== 0 &&
                        season.name !== "Specials" ? (
                          <option
                            key={season.season_number}
                            value={season.season_number}
                          >
                            {`Season ${season.season_number}`}
                          </option>
                        ) : null
                      )}
                    </select>
                  </div>

                  <div className="tab-pane" id="episodes">
                    {episodeLoading ? (
                      <div
                        className="text-white flex justify-center items-center h-16 w-16 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"
                        role="status"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                    ) : (
                      episodes.map((episode, index) => (
                        <div
                          className="text-white mb-4 p-4 rounded-md flex flex-col md:flex-row"
                          key={index}
                        >
                          <div className="w-full relative mb-2 md:mb-0">
                            <img
                              onClick={() =>
                                watchTvShow(id, selectedSeason, index + 1)
                              }
                              src={
                                episode.runtime == null
                                  ? "https://placehold.co/600x338/png"
                                  : `https://image.tmdb.org/t/p/w500${episode.still_path}`
                              }
                              alt={`Episode ${index + 1}: ${episode.name}`}
                              className="w-[350px] h-[200px] rounded max-w-[400px]"
                            />
                            <div className="absolute top-1/2 left-[178px] transform -translate-x-1/2 -translate-y-1/2">
                              <span className="text-white text-4xl">
                                <FaPlay />
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col justify-between flex-grow ml-0 md:ml-4">
                            <h2 className="text-white text-lg font-semibold">
                              {`Episode ${index + 1}: ${episode.name}`}
                            </h2>
                            <p className="text-gray-400 text-sm mt-2 md:mt-1 max-h-20 overflow-hidden">
                              {episode.overview.length > 150
                                ? `${episode.overview.slice(0, 150)}...`
                                : episode.overview}
                            </p>
                            <p className="text-zinc-400 text-sm mt-2 md:mt-1">
                              {episode.runtime == null ? "Not Released" : ""}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div className={showRelated === true ? "block" : "hidden"}>
                  <MovieRow title="" movies={recommendation} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Info;
