import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  collection,
  getDocs,
  where,
  query,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import Header from "../components/Header";
import Loading from "../components/Loading";

const WatchListItem = ({ item, removeFromWatchlist }) => (
  <li className="flex mb-4" key={item.id}>
    <img
      className="w-16 h-24 rounded-md object-cover mr-4"
      src={`https://image.tmdb.org/t/p/w92${item.poster}`}
      alt={item.title}
    />
    <div className="flex flex-col">
      <p className="text-white text-lg font-semibold">{item.title}</p>
      <p className="text-gray-400 text-sm">
        {item.isTvShow ? "(TV Show)" : "(Movie)"}
      </p>
      <div className="mt-2">
        <button
          className="px-4 py-2 rounded-md bg-red-600 text-white mr-2"
          onClick={() => removeFromWatchlist(item.id)}
        >
          Remove
        </button>
        <button
          className="px-4 py-2 rounded-md bg-green-600 text-white"
          onClick={() =>
            (window.location.href = item.isTvShow
              ? `/tv/${item.id}`
              : `/movie/${item.id}`)
          }
        >
          Watch
        </button>
      </div>
    </div>
  </li>
);

const WatchList = () => {
  const { user, isLoaded } = useUser();
  const [watchlistItems, setWatchlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (user) {
        const watchlistRef = collection(db, `watchlist/${user.id}/items`);
        const querySnapshot = await getDocs(watchlistRef);

        const items = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });

        setWatchlistItems(items);
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, [user]);

  const removeFromWatchlist = async (itemId) => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, `watchlist/${user.id}/items`, itemId));
      setWatchlistItems((prevItems) =>
        prevItems.filter((item) => item.id !== itemId)
      );
      setLoading(false);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const renderWatchlist = (isTvShow) => {
    const filteredItems = watchlistItems.filter(
      (item) => item.isTvShow === isTvShow
    );

    if (filteredItems.length === 0) {
      return <p className="text-white">Watch List Is Empty...</p>;
    }

    return (
      <ul className="mt-4">
        {filteredItems.map((item) => (
          <WatchListItem
            key={item.id}
            item={item}
            removeFromWatchlist={removeFromWatchlist}
          />
        ))}
      </ul>
    );
  };

  if (!isLoaded) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen">
      <Header changeOnScroll={false} />
      <div className="max-w-screen-md mt-20 mx-auto p-4">
        <h2 className="text-2xl text-white font-semibold mb-4">Watch List</h2>
        {loading ? (
          <div className="flex justify-center items-center">
            <Loading />
          </div>
        ) : (
          <div>
            <h3 className="text-lg text-white font-semibold mb-2">TV Shows</h3>
            {renderWatchlist(true)}
            <h3 className="text-lg text-white font-semibold mt-4">Movies</h3>
            {renderWatchlist(false)}
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchList;
