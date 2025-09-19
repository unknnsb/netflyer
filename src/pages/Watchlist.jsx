import Spinner from "../components/Loading";
import Navbar from "../components/Navbar";
import { auth } from "../services/Firebase";
import { db } from "../services/Firebase";
import { BACKEND_URL } from "../services/Api";
import {
  Card,
  CardBody,
  Spinner as NextSpinner,
  Button,
  Image,
  Chip,
} from "@heroui/react";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Calendar, Play, Heart, Film, Tv } from "lucide-react";

const WatchlistPage = () => {
  const [watchlistData, setWatchlistData] = useState([]);
  const [watchlistLoading, setWatchlistLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [userID, setUserID] = useState(null);

  const fetchWatchlistData = async (userID) => {
    try {
      const q = query(collection(db, "watchlist"), where("userID", "==", userID));
      const querySnapshot = await getDocs(q);
      const userWatchlist = [];

      querySnapshot.forEach((doc) => {
        userWatchlist.push(doc.data());
      });

      const promises = userWatchlist.map(async ({ type, id }) => {
        const url = `${BACKEND_URL}/api/info/${type}/${id}`;
        const response = await fetch(url);
        return await response.json();
      });

      const watchlistDetails = await Promise.all(promises);
      setWatchlistData(watchlistDetails);
      setWatchlistLoading(false);
    } catch (error) {
      console.error("Error fetching watchlist:", error);
      setWatchlistLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const userID = user.uid;
          setUserID(userID);
          fetchWatchlistData(userID).then(() => {
            setLoading(false);
          });
        } else {
          setLoading(true);
          window.location.href = "/";
        }
      });
    };
    fetchUserData();
  }, []);

  const removeFromWatchlist = async (id, type) => {
    try {
      const q = query(collection(db, "watchlist"), where("userID", "==", userID));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (doc) => {
        setWatchlistLoading(true);
        const data = doc.data();
        if (data.type == type && data.id == id) {
          const docRef = doc.ref;
          await deleteDoc(docRef).then(() => {
            setWatchlistLoading(false);
            fetchWatchlistData(userID);
          });
        }
      });
    } catch (error) {
      console.error("Error removing from watchlist:", error);
      setWatchlistLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">
            My Watchlist
          </h1>
          <p className="text-zinc-400 text-lg">
            {watchlistData.length} {watchlistData.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </motion.div>

        {watchlistLoading ? (
          <div className="flex items-center justify-center py-20">
            <NextSpinner color="primary" size="lg" />
          </div>
        ) : watchlistData.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-zinc-900 rounded-full mb-6">
              <Heart className="w-10 h-10 text-zinc-600" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-zinc-300">Your watchlist is empty</h2>
            <p className="text-zinc-500 mb-8 max-w-md mx-auto">
              Start adding movies and TV shows to your watchlist to keep track of what you want to watch.
            </p>
            <Button
              color="primary"
              size="lg"
              className="rounded-xl font-semibold"
              onPress={() => window.location.href = "/discover"}
            >
              Discover Content
            </Button>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          >
            <AnimatePresence>
              {watchlistData.map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  layout
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="bg-zinc-900/50 border border-zinc-800 rounded-2xl shadow-xl group hover:shadow-2xl transition-all duration-300">
                    <div className="relative overflow-hidden rounded-t-2xl">
                      <Image
                        src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`}
                        alt={item.title || item.name}
                        className="w-full aspect-[2/3] object-cover group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                        onClick={() => {
                          const path = item.title ? `/info/movie/${item.id}` : `/info/tv/${item.id}`;
                          window.location.href = path;
                        }}
                        removeWrapper
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button
                          isIconOnly
                          color="primary"
                          className="rounded-full shadow-lg"
                          size="lg"
                        >
                          <Play className="w-5 h-5" />
                        </Button>
                      </div>
                      <div className="absolute top-3 right-3">
                        <Chip
                          startContent={item.title ? <Film className="w-3 h-3" /> : <Tv className="w-3 h-3" />}
                          color={item.title ? "primary" : "secondary"}
                          variant="solid"
                          size="sm"
                          className="bg-black/60 text-white backdrop-blur-sm"
                        >
                          {item.title ? "Movie" : "TV"}
                        </Chip>
                      </div>
                    </div>

                    <CardBody className="p-4 space-y-3">
                      <h2 className="text-lg font-semibold line-clamp-2 group-hover:text-blue-400 transition-colors">
                        {item.title || item.name}
                      </h2>

                      <div className="flex items-center gap-2 text-sm text-zinc-500">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(item.release_date || item.first_air_date).getFullYear()}
                        </span>
                      </div>

                      <Button
                        color="danger"
                        variant="light"
                        startContent={<Trash2 className="w-4 h-4" />}
                        className="w-full rounded-lg font-medium"
                        onPress={() => {
                          const type = item.title ? "movie" : "tv";
                          removeFromWatchlist(item.id, type);
                        }}
                      >
                        Remove
                      </Button>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WatchlistPage;

