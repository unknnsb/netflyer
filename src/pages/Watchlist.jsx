import Spinner from "../components/Loading";
import Navbar from "../components/Navbar";
import { auth } from "../services/Firebase";
import { db } from "../services/Firebase";
import { TMDB_API_KEY } from "../services/Tmdb";
import {
  Card,
  CardBody,
  Spinner as NextSpinner,
  Button,
  Image,
} from "@nextui-org/react";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";

const WatchlistPage = () => {
  const [watchlistData, setWatchlistData] = useState([]);
  const [watchlistLoading, setWatchlistLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [userID, setUserID] = useState(null);

  const fetchWatchlistData = async (userID) => {
    const apiKey = TMDB_API_KEY;

    const q = query(collection(db, "watchlist"), where("userID", "==", userID));
    const querySnapshot = await getDocs(q);

    const userWatchlist = [];
    querySnapshot.forEach((doc) => {
      userWatchlist.push(doc.data());
    });

    // Fetch details for each watchlist item
    const promises = userWatchlist.map(async ({ type, id }) => {
      const url = `https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}`;
      const response = await fetch(url);
      return await response.json();
    });

    const watchlistDetails = await Promise.all(promises);
    setWatchlistData(watchlistDetails);
    setWatchlistLoading(false);
  };

  useEffect(() => {
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
  }, []);

  const removeFromWatchlist = async (id, type) => {
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
  };

  if (loading) {
    <Spinner />;
  }

  return (
    <>
      <Navbar />
      <div className="p-2">
        <h1 className="text-3xl font-bold mb-6">My Watchlist</h1>
        <div>
          {watchlistLoading ? (
            <div className="flex items-center justify-center">
              <NextSpinner color="primary" size="xl" className="mb-6 mt-2" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {watchlistData.map((item) => (
                <Card key={item.id}>
                  <Image
                    isZoomed
                    src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`}
                    alt={item.title || item.name}
                    onClick={() => {
                      if (item.title) {
                        window.location.href = `/info/movie/${item.id}`;
                      } else {
                        window.location.href = `/info/tv/${item.id}`;
                      }
                    }}
                  />
                  <div className="p-4">
                    <h2 className="text-lg font-semibold mb-2">
                      {item.title || item.name}
                    </h2>
                    <div className="flex gap-2">
                      <p className="text-sm text-gray-300 mb-1">
                        {item.release_date || item.first_air_date}
                      </p>
                      {item.first_air_date ? (
                        <p className="text-sm text-gray-300 mb-4 font-bold">
                          Tv
                        </p>
                      ) : (
                        <p className="text-sm text-gray-300 mb-4 font-bold">
                          Movie
                        </p>
                      )}
                    </div>
                    <Button
                      variant="flat"
                      color="danger"
                      onClick={() => {
                        if (item.title) {
                          removeFromWatchlist(item.id, "movie");
                        } else {
                          removeFromWatchlist(item.id, "tv");
                        }
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WatchlistPage;
