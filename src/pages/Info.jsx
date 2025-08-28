import Row from "../components/CastRow";
import Spinner from "../components/Loading";
import MovieRow from "../components/MovieRow";
import Navbar from "../components/Navbar";
import { auth, db } from "../services/Firebase";
import { BACKEND_URL } from "../services/Api";
import {
  Spinner as CSpinner,
} from "@nextui-org/react";
import { onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { FaPlay, FaTrash, FaPlus } from "react-icons/fa";
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
  const [userUID, setUserID] = useState();
  const [userName, setUserName] = useState("");
  const [watchlistLoading, setWatchlistLoading] = useState(true);
  const [watchlist, setWatchlist] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const [similar, setSimilar] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const navigate = useNavigate();

  const toggleOverview = (episodeId) => {
    setExpandedOverview((prevState) => ({
      ...prevState,
      [episodeId]: !prevState[episodeId],
    }));
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(true);
        setUserID(user.uid);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserName(userDoc.data().username);
        } else {
          // If user does not have a username, prompt for it
          let username = prompt("Please enter a username:");
          if (username) {
            await setDoc(doc(db, "users", user.uid), { username });
            setUserName(username);
          }
        }
        qFunc(user.uid);
      } else {
        setUser(false);
        setWatchlistLoading(false);
      }
    });
  }, []);

  const qFunc = async (user_id) => {
    const q = query(
      collection(db, "watchlist"),
      where("userID", "==", user_id)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      if (doc.data().type === type && doc.data().id === id) {
        setWatchlistLoading(false);
        setWatchlist(true);
      }
    });
    setWatchlistLoading(false);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const fetchDetails = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/info/${type}/${id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setDetails(data);

        const castResponse = await fetch(
          `${BACKEND_URL}/api/info/${type}/${id}/credits`
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
  }, [type, id]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/info/${type}/${id}/recommendations`
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
          `${BACKEND_URL}/api/info/${type}/${id}/similar`
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
          `${BACKEND_URL}/api/info/${type}/${id}/season/${selectedSeason}`
        );
        if (response.ok) {
          const data = await response.json();
          setEpisodes(data.episodes);
        }
      }
    };

    fetchEpisodes();
  }, [type, id, selectedSeason]);

  useEffect(() => {
    fetchReviews();
  }, [id, type]);

  const handleAddReview = async () => {
    if (newReview.trim() === "") return;

    await addDoc(collection(db, "reviews"), {
      userId: userUID,
      userName: userName,
      itemId: id,
      type: type,
      text: newReview,
      likes: [],
    });
    setNewReview("");
    fetchReviews();
  };

  const handleLikeReview = async (reviewId) => {
    const reviewRef = doc(db, "reviews", reviewId);
    const reviewDoc = await getDoc(reviewRef);

    if (reviewDoc.exists() && !Array.isArray(reviewDoc.data().likes)) {
      await updateDoc(reviewRef, {
        likes: [],
      });
    }

    if (reviewDoc.exists() && !reviewDoc.data().likes.includes(userUID)) {
      await updateDoc(reviewRef, {
        likes: [...reviewDoc.data().likes, userUID],
      });
      fetchReviews();
    }
  };

  const handleUnlikeReview = async (reviewId) => {
    const reviewRef = doc(db, "reviews", reviewId);
    const reviewDoc = await getDoc(reviewRef);

    if (reviewDoc.exists() && !Array.isArray(reviewDoc.data().likes)) {
      await updateDoc(reviewRef, {
        likes: [],
      });
    }

    if (reviewDoc.exists() && reviewDoc.data().likes.includes(userUID)) {
      await updateDoc(reviewRef, {
        likes: reviewDoc.data().likes.filter((uid) => uid !== userUID),
      });
      fetchReviews();
    }
  };

  const handleDeleteReview = async (reviewId) => {
    await deleteDoc(doc(db, "reviews", reviewId));
    fetchReviews();
  };

  const fetchReviews = async () => {
    const q = query(
      collection(db, "reviews"),
      where("itemId", "==", id),
      where("type", "==", type)
    );
    const querySnapshot = await getDocs(q);
    const reviewsData = [];
    querySnapshot.forEach((doc) => {
      const reviewData = doc.data();
      if (!Array.isArray(reviewData.likes)) {
        reviewData.likes = [];
      }
      reviewsData.push({ ...reviewData, id: doc.id });
    });
    setReviews(reviewsData);
  };

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
    if (!userUID) {
      return createToast("Please wait. Try again after 2 seconds.", {
        cancel: "Cancel",
        timeout: 2000,
        type: "dark",
      });
    }
    setWatchlistLoading(true);
    await addDoc(collection(db, "watchlist"), {
      type: itemType,
      id: itemId,
      userID: userUID,
    }).then(() => {
      setWatchlistLoading(false);
    });
    qFunc(userUID);
  };

  const removeFromWatchlist = async (id, type) => {
    setWatchlistLoading(true);
    const q = query(collection(db, "watchlist"), where("userID", "==", userUID));
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
      qFunc(userUID);
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
      <option key={seasonNumber} value={seasonNumber}>
        Season {seasonNumber}
      </option>
    );
  }

  seasonItems.push(
    <option key="0" value="0">
      Specials
    </option>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="relative">
        <div className="relative h-[400px] md:h-[500px]">
          <img
            src={`https://image.tmdb.org/t/p/w1280/${details.backdrop_path}`}
            alt="Backdrop"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900"></div>
        </div>
        <div className="container mx-auto px-4 py-6 relative">
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <img
              src={`https://image.tmdb.org/t/p/w300/${details.poster_path}`}
              alt="Poster"
              className="w-48 md:w-64 rounded-lg shadow-lg md:mr-8 mb-4 md:mb-0"
            />
            <div className="flex-1">
              <h1 className="text-3xl md:text-5xl font-bold mb-2">
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
                    <button
                      className="ml-1 text-primary-500"
                      onClick={toggleText}
                    >
                      {showFullText ? "Read Less" : "Read More"}
                    </button>
                  )}
                </p>
              </div>
              <p className="text-base md:text-lg mb-2">
                <span className="font-semibold">IMDB: </span>
                {details.vote_average}
              </p>
              <p className="text-base md:text-lg mb-2">
                <span className="font-semibold">Release Date: </span>
                {type === "movie"
                  ? details.release_date
                  : `${details.first_air_date} - ${inProduction}`}
              </p>
              <p className="text-base md:text-lg mb-2">
                <span className="font-semibold">Genre: </span>
                {details.genres.map((genre) => genre.name).join(", ")}
              </p>
              {type === "tv" && (
                <p className="text-base md:text-lg mb-2">
                  <span className="font-semibold">Total Seasons: </span>
                  {details.number_of_seasons}
                </p>
              )}
              <div className="flex mt-4">
                <button
                  className="flex items-center bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-md"
                  onClick={() => {
                    if (type === "tv") {
                      navigate(`/watch/${type}/${id}/${selectedSeason}/1`);
                    } else {
                      navigate(`/watch/${type}/${id}`);
                    }
                  }}
                >
                  <FaPlay className="mr-2" /> Play
                </button>
                {watchlistLoading ? (
                  <button
                    className="flex items-center bg-gray-500 text-white font-semibold py-2 px-4 rounded-md ml-2"
                    disabled
                  >
                    <CSpinner color="white" size="md" />
                  </button>
                ) : (
                  <>
                    {watchlist ? (
                      <button
                        className="flex items-center bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md ml-2"
                        onClick={() => {
                          removeFromWatchlist(id, type);
                        }}
                      >
                        <FaTrash className="mr-2" /> Remove From Watchlist
                      </button>
                    ) : (
                      <button
                        className="flex items-center bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md ml-2"
                        onClick={() => {
                          addToWatchList(id, type);
                        }}
                      >
                        <FaPlus className="mr-2" /> Add to Watchlist
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">Cast</h2>
        <Row items={cast} />
      </div>
      {type === "tv" && (
        <div className="container mx-auto px-4 py-6">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Seasons</h2>
          <div className="max-w-xs">
            <select
              className="w-full bg-gray-800 border border-gray-700 text-white py-2 px-3 rounded-md"
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(Number(e.target.value))}
            >
              {seasonItems}
            </select>
          </div>
        </div>
      )}
      {type === "tv" && (
        <div className="container mx-auto px-4 py-6">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">
            Episodes - Season {selectedSeason}
            <span className="text-sm text-gray-600 ml-2">
              ({episodes.length})
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {episodes.map((episode) => (
              <div
                key={episode.id}
                className="bg-gray-800 rounded-lg shadow-lg overflow-hidden"
              >
                <img
                  src={
                    episode.still_path
                      ? `https://image.tmdb.org/t/p/original/${episode.still_path}`
                      : "/not-found.png"
                  }
                  alt={episode.name}
                  className="w-full h-auto cursor-pointer"
                  onClick={() =>
                    navigate(
                      `/watch/${type}/${id}/${selectedSeason}/${episode.episode_number}`
                    )
                  }
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">
                    {episode.episode_number}.{" "}
                    {episode.name.length > 30
                      ? `${episode.name.substring(0, 30)}...`
                      : episode.name}
                  </h3>
                  <p
                    className={`text-sm ${expandedOverview[episode.id]
                      ? "overflow-visible"
                      : "overflow-hidden"
                      }`}
                  >
                    {expandedOverview[episode.id]
                      ? episode.overview
                      : `${episode.overview.substring(0, 100)}...`}
                  </p>
                  {episode.overview.length > 100 && (
                    <button
                      className="text-primary-500 mt-2"
                      onClick={() => toggleOverview(episode.id)}
                    >
                      {expandedOverview[episode.id] ? "Read Less" : "Read More"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="container mx-auto px-4 py-6">
        <section className="mb-4">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Similar</h2>
          <MovieRow items={similar} />
        </section>
        <section className="mb-4">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            Recommendations
          </h2>
          <MovieRow items={recommendations} />
        </section>
        <section className="mb-4">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Reviews</h2>
          {user ? (
            <div className="mb-4">
              <textarea
                className="w-full p-2 rounded bg-gray-800 text-white"
                placeholder="Write your review..."
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
              />
              <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleAddReview}
              >
                Add Review
              </button>
            </div>
          ) : (
            <p className="text-gray-400">Log in to write a review.</p>
          )}
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="p-4 bg-gray-800 rounded-lg">
                <h3 className="text-lg font-bold">{review.userName}</h3>
                <p className="text-gray-300">{review.text}</p>
                <div className="flex items-center mt-2">
                  {review.userId !== userUID && (
                    <>
                      <button
                        className="mr-2 px-2 py-1 bg-blue-500 text-white rounded"
                        onClick={() =>
                          review.likes.includes(userUID)
                            ? handleUnlikeReview(review.id)
                            : handleLikeReview(review.id)
                        }
                      >
                        {review.likes.includes(userUID) ? "Unlike" : "Like"}
                      </button>
                      <span>{review.likes.length} likes</span>
                    </>
                  )}
                  {review.userId === userUID && (
                    <button
                      className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
                      onClick={() => handleDeleteReview(review.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default InfoPage;

