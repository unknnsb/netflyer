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
import "../styles/WatchList.css";

const WatchListItem = ({ item, removeFromWatchlist }) => (
  <li className="watchlist-item" key={item.id}>
    <div className="item-content">
      <img
        className="item-poster"
        src={`https://image.tmdb.org/t/p/w92${item.poster}`}
        alt={item.title}
      />
      <div className="item-details">
        <p className="item-title">{item.title}</p>
        <p className="item-type">{item.isTvShow ? "(TV Show)" : "(Movie)"}</p>
        <button
          className="remove-button"
          onClick={() => removeFromWatchlist(item.id)}
        >
          Remove
        </button>
        <button
          className="play-list"
          onClick={ () =>
            item.isTvShow
              ? (window.location.href = `/tv/${item.id}`)
              : (window.location.href = `/movie/${item.id}`)
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
      return <p className="empty-message">Watch List Is Empty...</p>;
    }

    return (
      <ul className="watchlist">
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
    return (
      <div className="loading">
        <img
          className="loading-gif"
          src="https://cdn.lowgif.com/small/0534e2a412eeb281-the-counterintuitive-tech-behind-netflix-s-worldwide.gif"
          alt="loading"
        ></img>
      </div>
    );
  }

  return (
    <div className="watchlist-container">
      <Header />
      <h2 className="watchlist-title">Watch List</h2>
      {loading ? (
        <div className="loading">
          <img
            className="loading-gif"
            src="https://cdn.lowgif.com/small/0534e2a412eeb281-the-counterintuitive-tech-behind-netflix-s-worldwide.gif"
            alt="loading"
          ></img>
        </div>
      ) : (
        <div>
          <h3 className="watchlist-category">TV Shows</h3>
          {renderWatchlist(true)}
          <h3 className="watchlist-category">Movies</h3>
          {renderWatchlist(false)}
        </div>
      )}
    </div>
  );
};

export default WatchList;
