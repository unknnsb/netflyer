import Row from "../components/CastRow";
import Spinner from "../components/Loading";
import MovieRow from "../components/MovieRow";
import Navbar from "../components/Navbar";
import { auth, db } from "../services/Firebase";
import { TMDB_URL, TMDB_API_KEY } from "../services/Tmdb";
import {
  Card,
  CardFooter,
  Image,
  CardBody,
  Divider,
  Chip,
  Button,
  Spinner as CSpinner,
  Select,
  SelectItem,
  Tabs,
  Tab,
} from "@nextui-org/react";
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
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import "react-horizontal-scrolling-menu/dist/styles.css";
import { FaStar, FaRegStar, FaPlay, FaTrash, FaPlus } from "react-icons/fa";
import { FiCheck, FiX } from "react-icons/fi";
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
  const [showFullText, setShowFullText] = useState(false);
  const [similar, setSimilar] = useState([]);
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

    const fetchSimilar = async () => {
      try {
        const response = await fetch(
          `${TMDB_URL}/${type}/${id}/similar?api_key=${TMDB_API_KEY}`
        );
        if (response.ok) {
          const data = await response.json();
          setSimilar(data.results);
        }
      } catch (error) {
        console.error("Error fetching similar:", error);
      }
    };

    fetchSimilar();
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
        timeout: 3000,
        cancel: "Cancel",
        type: "dark",
      });
    }
    if (!userID) {
      return createToast("Please wait. Try again after 2 seconds.", {
        cancel: "Cancel",
        timeout: 2000,
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

  const toggleText = () => {
    setShowFullText(!showFullText);
  };

  const seasonItems = [];
  for (
    let seasonNumber = 1;
    seasonNumber <= details.number_of_seasons;
    seasonNumber++
  ) {
    seasonItems.push(
      <SelectItem
        key={seasonNumber.toString()}
        value={seasonNumber.toString()}
        textValue={`Season ${seasonNumber}`}
        onClick={() => {
          setSelectedSeason(seasonNumber);
        }}
      >
        Season {seasonNumber}
      </SelectItem>
    );
  }

  return (
    <div className="h-screen w-full">
      <Navbar />
      <div className="h-screen absolute top-0 z-20">
        <Card radius="none" className="text-white">
          <Image
            src={`https://image.tmdb.org/t/p/w1280/${details.backdrop_path}`}
            className="z-0 w-full md:h-full h-[600px] object-cover"
            radius="none"
          />
          <div className="z-10 w-full h-full absolute top-0 left-0 bg-gradient-to-b from-transparent to-[#202020]"></div>
          <div className="md:mt-3 mt-[200px]">
            <CardFooter
              radius="none"
              className="flex md:flex-row flex-col items-start overflow-hidden py-1 absolute bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10"
            >
              <div className="md:w-1/3 flex justify-center w-full h-full md:pr-8 mb-4 md:mb-0">
                <Image
                  src={`https://image.tmdb.org/t/p/w300/${details.poster_path}`}
                  alt="Poster"
                  radius="lg"
                  className="w-48 md:w-64 shadow-lg mx-auto md:mx-0 md:mt-0 mt-4"
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
                  <p className="text-base md:text-lg">
                    {details.overview.length > 155 && !showFullText
                      ? `${details.overview.substring(0, 155)}...`
                      : details.overview}
                    {details.overview.length > 155 && (
                      <Button
                        className="ml-1"
                        size="md"
                        color="danger"
                        variant="ghost"
                        onClick={toggleText}
                      >
                        {showFullText ? "Read Less" : "Read More"}
                      </Button>
                    )}
                  </p>
                </div>
                <p className="text-base mt-1 mb-1 flex md:text-lg">
                  <span className="flex">
                    <Chip size="md" className="bg-opacity-60">
                      IMDB
                    </Chip>
                    : <span className="ml-1">{details.vote_average}</span>
                  </span>
                </p>
                <p className="text-base md:text-lg">
                  {type === "movie" ? (
                    <span>
                      <Chip size="md" className="bg-opacity-60">
                        Release Date
                      </Chip>
                      : {details.release_date}
                    </span>
                  ) : (
                    <span>
                      <Chip size="md" className="bg-opacity-60">
                        Release Date
                      </Chip>
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
                  <Chip size="md" className="bg-opacity-60">
                    Genre
                  </Chip>
                  : {details.genres.map((genre) => genre.name).join(", ")}
                </p>
                {type === "tv" && (
                  <p className="text-base md:text-lg mb-2">
                    <Chip size="md" className="bg-opacity-60">
                      Total Seasons
                    </Chip>
                    : {details.number_of_seasons}
                  </p>
                )}
                <div className="flex">
                  <Button
                    variant="shadow"
                    color="danger"
                    radius="full"
                    startContent={<FaPlay />}
                    onClick={() => {
                      if (type === "tv") {
                        navigate(`/watch/${type}/${id}/${selectedSeason}/1`);
                      } else {
                        navigate(`/watch/${type}/${id}`);
                      }
                    }}
                  >
                    Play
                  </Button>
                  {watchlistLoading ? (
                    <Button
                      disabled
                      variant="shadow"
                      color="danger"
                      radius="full"
                      className="ml-2"
                    >
                      <CSpinner color="white" size="md" />
                    </Button>
                  ) : (
                    <>
                      {watchlist ? (
                        <Button
                          onClick={() => {
                            removeFromWatchlist(id, type);
                          }}
                          variant="shadow"
                          color="danger"
                          radius="full"
                          className="ml-2"
                          endContent={<FaTrash />}
                        >
                          Remove From Watchlist
                        </Button>
                      ) : (
                        <Button
                          onClick={() => {
                            addToWatchList(id, type);
                          }}
                          variant="shadow"
                          color="danger"
                          radius="full"
                          className="ml-2"
                          endContent={<FaPlus />}
                        >
                          WatchList
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </CardFooter>
          </div>
        </Card>
      </div>

      <div className="bg-[#202020] lg:mt-[450px] md:mt-[530px] mt-[740px] mb-2">
        <h2 className="text-2xl ml-2 md:text-3xl font-semibold mb-2 text-white">
          Cast
        </h2>
        <Row items={cast} />
      </div>

      {type === "tv" && (
        <div className="ml-2 pt-2">
          <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-white">
            Seasons
          </h2>
          <div className="text-white">
            <Select
              label="Select Season"
              variant="flat"
              placeholder="Select an season"
              className="max-w-xs mb-2"
              defaultSelectedKeys={"1"}
            >
              {seasonItems}
            </Select>
          </div>
        </div>
      )}

      {type === "tv" && (
        <div className="p-3 text-white z-20">
          <h2 className="text-xl md:text-2xl font-semibold mb-2">
            Episodes - Season {selectedSeason}{" "}
            <span className="text-sm text-gray-600">({episodes.length})</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {episodes.map((episode) => (
              <Card key={episode.id} className="text-center mb-6" shadow>
                <Image
                  onClick={() =>
                    navigate(
                      `/watch/${type}/${id}/${selectedSeason}/${episode.episode_number}`
                    )
                  }
                  isZoomed
                  src={
                    episode.still_path
                      ? `https://image.tmdb.org/t/p/original/${episode.still_path}`
                      : "/not-found.png"
                  }
                  alt={episode.name}
                  className="w-full h-auto rounded-lg cursor-pointer"
                />
                <CardBody>
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
                    <Button
                      className="hover:underline mt-2"
                      color="danger"
                      variant="solid"
                      onClick={() => toggleOverview(episode.id)}
                    >
                      {expandedOverview[episode.id] ? "Read Less" : "Read More"}
                    </Button>
                  )}
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      )}
      <div>
        <Tabs aria-label="Similar" variant="underlined">
          <Tab
            className="text-2xl ml-2 text-white mb-2"
            key="similar"
            title="Similar"
          >
            <MovieRow items={similar} />
          </Tab>
          <Tab
            className="text-2xl text-white mb-2"
            key="recommendations"
            title="Recommendations"
          >
            <MovieRow items={recommendations} />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default InfoPage;
