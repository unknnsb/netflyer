import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import "../styles/WatchListAdd.css";
import Header from "../components/Header";

const WatchListAdd = () => {
  const { id } = useParams();
  const location = useLocation();
  const isTvShowParam = new URLSearchParams(location.search).get("tv");
  const [details, setDetails] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/${
            isTvShowParam === "true" ? "tv" : "movie"
          }/${id}?api_key=bb2818a2abb39fbdf6da79343e5e376b`
        );
        setDetails(response.data);
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    };

    fetchDetails();
  }, [id, isTvShowParam]);

  const addToWatchList = async () => {
    if (user) {
      const data = {
        id: id,
        title: details.title || details.name,
        poster: details.poster_path,
        isTvShow: isTvShowParam === "true",
      };
      setLoading(true);
      try {
        await setDoc(doc(db, `watchlist/${user.id}/items`, id), data);
        setMessage(
          `Added The ${isTvShowParam === "true" ? "TV Show" : "Movie"} "${
            details.title || details.name
          }" to watch list`
        );
      } catch (error) {
        console.error("Error adding to watch list:", error);
      }
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="loading">
        <img
          src="https://cdn.lowgif.com/small/0534e2a412eeb281-the-counterintuitive-tech-behind-netflix-s-worldwide.gif"
          alt="loading"
        ></img>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="watchlist-container">
        <h2>Add to Watch List</h2>
        <div className="watchlist-details">
          {details.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w300${details.poster_path}`}
              alt={details.title || details.name}
            />
          )}
          <h3>{details.title || details.name}</h3>
          <button onClick={addToWatchList}>Add to Watch List</button>
        </div>
        {loading && (
          <div className="loading">
            <img
              src="https://cdn.lowgif.com/small/0534e2a412eeb281-the-counterintuitive-tech-behind-netflix-s-worldwide.gif"
              alt="loading"
            ></img>
          </div>
        )}
        {message && <p className="success">{message}</p>}
      </div>
    </>
  );
};

export default WatchListAdd;
