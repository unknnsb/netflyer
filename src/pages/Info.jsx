import Row from "../components/CastRow";
import Spinner from "../components/Loading";
import MovieRow from "../components/MovieRow";
import Navbar from "../components/Navbar";
import { auth, db } from "../services/Firebase";
import { BACKEND_URL } from "../services/Api";
import {
  Spinner as CSpinner,
  Button,
  Card,
  CardBody,
  Select,
  SelectItem,
  Textarea,
  Chip,
  Avatar,
} from "@heroui/react";
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
  serverTimestamp,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { Play, Trash2, Plus, Star, Calendar, Clock, Heart, MessageSquare, ThumbsUp, Eye } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { createToast } from "vercel-toast";
import { motion, AnimatePresence } from "framer-motion";

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
      likeCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    setNewReview("");
    fetchReviews();
  };

  const handleLikeReview = async (reviewId) => {
    const reviewRef = doc(db, "reviews", reviewId);
    const reviewSnap = await getDoc(reviewRef);

    if (!reviewSnap.exists()) return;

    const reviewData = reviewSnap.data();
    const currentLikes = Array.isArray(reviewData.likes) ? reviewData.likes : [];

    if (!currentLikes.includes(userUID)) {
      await updateDoc(reviewRef, {
        likes: [...currentLikes, userUID],
        likeCount: (reviewData.likeCount || 0) + 1,
        updatedAt: serverTimestamp()
      });
      fetchReviews();
    }
  };

  const handleUnlikeReview = async (reviewId) => {
    const reviewRef = doc(db, "reviews", reviewId);
    const reviewSnap = await getDoc(reviewRef);

    if (!reviewSnap.exists()) return;

    const reviewData = reviewSnap.data();
    const currentLikes = Array.isArray(reviewData.likes) ? reviewData.likes : [];

    if (currentLikes.includes(userUID)) {
      await updateDoc(reviewRef, {
        likes: currentLikes.filter((uid) => uid !== userUID),
        likeCount: Math.max((reviewData.likeCount || 1) - 1, 0),
        updatedAt: serverTimestamp()
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
      title: details.title || details.name,
      posterPath: details.poster_path,
      addedAt: serverTimestamp()
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
    seasonItems.push({
      key: seasonNumber.toString(),
      label: `Season ${seasonNumber}`,
    });
  }
  seasonItems.push({
    key: "0",
    label: "Specials",
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Section */}
      <div className="relative">
        <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            src={`https://image.tmdb.org/t/p/w1280/${details.backdrop_path}`}
            alt="Backdrop"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-6 relative -mt-40 md:-mt-48 z-10"
        >
          <div className="flex flex-col lg:flex-row items-start gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-shrink-0"
            >
              <img
                src={`https://image.tmdb.org/t/p/w400/${details.poster_path}`}
                alt="Poster"
                className="w-48 md:w-64 lg:w-72 rounded-2xl shadow-2xl"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex-1 space-y-6"
            >
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                  {type === "movie" ? details.title : details.name}
                </h1>

                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center gap-2 bg-yellow-500/20 rounded-full px-3 py-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-semibold">{details.vote_average?.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {type === "movie" ? details.release_date?.split('-')[0] : details.first_air_date?.split('-')[0]}
                    </span>
                  </div>
                  {type === "tv" && (
                    <Chip variant="bordered" size="sm">
                      {details.number_of_seasons} Season{details.number_of_seasons !== 1 ? 's' : ''}
                    </Chip>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Overview</h2>
                <p className="text-lg text-zinc-300 leading-relaxed">
                  {details.overview.length > 200 && !showFullText
                    ? `${details.overview.substring(0, 200)}...`
                    : details.overview}
                  {details.overview.length > 200 && (
                    <button
                      className="ml-2 text-blue-400 hover:text-blue-300 font-medium"
                      onClick={toggleText}
                    >
                      {showFullText ? "Show Less" : "Show More"}
                    </button>
                  )}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {details.genres.map((genre) => (
                    <Chip key={genre.id} variant="flat" size="sm" className="bg-zinc-800 text-zinc-300">
                      {genre.name}
                    </Chip>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Button
                  color="primary"
                  size="lg"
                  startContent={<Play className="w-5 h-5" />}
                  className="rounded-xl font-semibold shadow-lg shadow-blue-500/25"
                  onPress={() => {
                    if (type === "tv") {
                      navigate(`/watch/${type}/${id}/${selectedSeason}/1`);
                    } else {
                      navigate(`/watch/${type}/${id}`);
                    }
                  }}
                >
                  Play Now
                </Button>

                {watchlistLoading ? (
                  <Button
                    size="lg"
                    variant="bordered"
                    className="rounded-xl"
                    isLoading
                  >
                    Loading
                  </Button>
                ) : watchlist ? (
                  <Button
                    color="danger"
                    variant="bordered"
                    size="lg"
                    startContent={<Trash2 className="w-5 h-5" />}
                    className="rounded-xl"
                    onPress={() => removeFromWatchlist(id, type)}
                  >
                    Remove
                  </Button>
                ) : (
                  <Button
                    color="secondary"
                    variant="bordered"
                    size="lg"
                    startContent={<Plus className="w-5 h-5" />}
                    className="rounded-xl"
                    onPress={() => addToWatchList(id, type)}
                  >
                    Watchlist
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div className="container mx-auto px-6 py-12 space-y-16">
        {/* Cast Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-8">Cast & Crew</h2>
          <Row items={cast} />
        </motion.section>

        {/* TV Season Selection */}
        {type === "tv" && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-6 mb-8">
              <h2 className="text-3xl font-bold">Episodes</h2>
              <Select
                selectedKeys={[selectedSeason.toString()]}
                onSelectionChange={(keys) => setSelectedSeason(Number(Array.from(keys)[0]))}
                className="max-w-xs"
                radius="lg"
                variant="bordered"
              >
                {seasonItems.map((season) => (
                  <SelectItem key={season.key}>
                    {season.label}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {episodes.map((episode, index) => (
                <motion.div
                  key={episode.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    className="bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-800/50 hover:border-zinc-700 transition-all duration-300 cursor-pointer group"
                    isPressable
                    onPress={() =>
                      navigate(
                        `/watch/${type}/${id}/${selectedSeason}/${episode.episode_number}`
                      )
                    }
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={
                          episode.still_path
                            ? `https://image.tmdb.org/t/p/w500/${episode.still_path}`
                            : "/not-found.png"
                        }
                        alt={episode.name}
                        className="w-full aspect-video object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Play className="w-12 h-12 text-white" />
                      </div>
                      <div className="absolute top-3 left-3">
                        <Chip size="sm" className="bg-black/60 text-white">
                          Episode {episode.episode_number}
                        </Chip>
                      </div>
                    </div>

                    <CardBody className="p-4 space-y-3">
                      <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-blue-400 transition-colors">
                        {episode.name}
                      </h3>
                      <p className="text-sm text-zinc-400 line-clamp-3">
                        {expandedOverview[episode.id] || episode.overview.length <= 100
                          ? episode.overview
                          : `${episode.overview.substring(0, 100)}...`}
                      </p>
                      {episode.overview.length > 100 && (
                        <button
                          className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleOverview(episode.id);
                          }}
                        >
                          {expandedOverview[episode.id] ? "Show Less" : "Show More"}
                        </button>
                      )}
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Similar & Recommendations */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-12"
        >
          {similar.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold mb-8">Similar Content</h2>
              <MovieRow items={similar} />
            </div>
          )}

          {recommendations.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold mb-8">Recommendations</h2>
              <MovieRow items={recommendations} />
            </div>
          )}
        </motion.section>

        {/* Reviews Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-blue-400" />
            <h2 className="text-3xl font-bold">Reviews</h2>
            <Chip variant="flat" size="sm">
              {reviews.length}
            </Chip>
          </div>

          {user ? (
            <Card className="bg-zinc-900/50 border border-zinc-800 rounded-2xl">
              <CardBody className="p-6 space-y-4">
                <Textarea
                  variant="bordered"
                  placeholder="Share your thoughts about this content..."
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  className="text-white"
                  radius="lg"
                  minRows={3}
                />
                <div className="flex justify-end">
                  <Button
                    color="primary"
                    onPress={handleAddReview}
                    className="rounded-lg font-semibold"
                    isDisabled={!newReview.trim()}
                  >
                    Post Review
                  </Button>
                </div>
              </CardBody>
            </Card>
          ) : (
            <Card className="bg-zinc-900/50 border border-zinc-800 rounded-2xl">
              <CardBody className="p-6 text-center">
                <MessageSquare className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                <p className="text-zinc-400 mb-4">Sign in to write a review and share your thoughts</p>
                <Button
                  color="primary"
                  variant="bordered"
                  onPress={() => navigate("/login")}
                  className="rounded-lg"
                >
                  Sign In
                </Button>
              </CardBody>
            </Card>
          )}

          <div className="space-y-6">
            <AnimatePresence>
              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors rounded-2xl">
                    <CardBody className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar
                            name={review.userName.charAt(0).toUpperCase()}
                            size="sm"
                            className="bg-blue-500"
                          />
                          <h3 className="font-semibold">{review.userName}</h3>
                        </div>
                        {review.userId === userUID && (
                          <Button
                            isIconOnly
                            color="danger"
                            variant="light"
                            size="sm"
                            onPress={() => handleDeleteReview(review.id)}
                            className="rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <p className="text-zinc-300 leading-relaxed">{review.text}</p>

                      {review.userId !== userUID && user && (
                        <div className="flex items-center gap-4 pt-2">
                          <Button
                            size="sm"
                            variant={review.likes.includes(userUID) ? "solid" : "bordered"}
                            color="primary"
                            startContent={<ThumbsUp className="w-4 h-4" />}
                            onPress={() =>
                              review.likes.includes(userUID)
                                ? handleUnlikeReview(review.id)
                                : handleLikeReview(review.id)
                            }
                            className="rounded-lg"
                          >
                            {review.likes.length}
                          </Button>
                        </div>
                      )}

                      {!user && review.likes.length > 0 && (
                        <div className="flex items-center gap-2 pt-2 text-sm text-zinc-500">
                          <ThumbsUp className="w-4 h-4" />
                          <span>{review.likes.length} likes</span>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default InfoPage;

