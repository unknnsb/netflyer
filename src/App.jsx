import BottomBar from "./components/BottomBar";
import FeaturedMovie from "./components/FeaturedMovie";
import Loading from "./components/Loading";
import { auth, db } from "./services/Firebase";
import { API_KEY, URL, endpoints } from "./services/Tmdb";
import axios from "axios";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieRow from "./components/MovieRow";

const App = () => {
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(true);
  const [trending_tv, setTrendingTv] = useState([]);
  const [trending_movies, setTrendingMovies] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [popular, setPopular] = useState([]);
  const [airingToday, setAiringToday] = useState([]);

  const navigate = useNavigate();

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      navigate("/signup");
    } else {
      const userRef = doc(db, "users", user.uid);
      getDoc(userRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            setUsername(userData.username);
            setAvatar(userData.avatar);
            setLoading(false);
          }
        })
        .catch((error) => {
          console.error("Error fetching account data:", error);
          alert("Error fetching account data:", error);
        });
    }
  });

  const handleLogOut = () => {
    signOut(auth).then(() => {
      navigate("/login");
    });
  };

  useEffect(() => {
    axios
      .get(`${URL}${endpoints.trending_tv}`, {
        params: {
          api_key: API_KEY,
        },
      })
      .then((res) => setTrendingTv(res.data.results));
    axios
      .get(`${URL}${endpoints.popular}`, {
        params: {
          api_key: API_KEY,
        },
      })
      .then((res) => setPopular(res.data.results));
    axios
      .get(`${URL}${endpoints.trending_movies}`, {
        params: {
          api_key: API_KEY,
        },
      })
      .then((res) => setTrendingMovies(res.data.results));
    axios
      .get(`${URL}${endpoints.airing_today}`, {
        params: {
          api_key: API_KEY,
        },
      })
      .then((res) => setAiringToday(res.data.results));
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="page">
          <FeaturedMovie />
          <MovieRow title="Tv Shows Trending Week" movies={trending_tv} />
          <MovieRow title="Movies Trending Week" movies={trending_movies} />
          <MovieRow title="Popular" movies={popular} />
          <BottomBar selected={0} />
        </div>
      )}
    </>
  );
};

export default App;
