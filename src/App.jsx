import BottomBar from "./components/BottomBar";
import FeaturedMovie from "./components/FeaturedMovie";
import Loading from "./components/Loading";
import MovieRow from "./components/MovieRow";
import { auth, db } from "./services/Firebase";
import { API_KEY, URL, endpoints } from "./services/Tmdb";
import axios from "axios";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const App = () => {
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(true);
  const [originals, setOriginals] = useState([]);
  const [trending, setTrending] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

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
      .get(`${URL}${endpoints.originals}`, {
        params: {
          api_key: API_KEY,
        },
      })
      .then((res) => setOriginals(res.data.results));
    axios
      .get(`${URL}${endpoints.trending}`, {
        params: {
          api_key: API_KEY,
        },
      })
      .then((res) => setTrending(res.data.results));
    axios
      .get(`${URL}${endpoints.now_playing}`, {
        params: {
          api_key: API_KEY,
        },
      })
      .then((res) => setNowPlaying(res.data.results));
    axios
      .get(`${URL}${endpoints.popular}`, {
        params: {
          api_key: API_KEY,
        },
      })
      .then((res) => setPopular(res.data.results));
    axios
      .get(`${URL}${endpoints.top_rated}`, {
        params: {
          api_key: API_KEY,
        },
      })
      .then((res) => setTopRated(res.data.results));
    axios
      .get(`${URL}${endpoints.upcoming}`, {
        params: {
          api_key: API_KEY,
        },
      })
      .then((res) => setUpcoming(res.data.results));
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="page">
          <FeaturedMovie />
          <main className="px-4">
            <section className="mb-16">
              <MovieRow title="Top Trending" images={trending} />
            </section>
            <section className="mb-16">
              <MovieRow title="All-Time Trending TV Series" images={popular} />
            </section>
            <section className="mb-16">
              <MovieRow title="Latest TV Series" images={nowPlaying} />
            </section>
          </main>
          <BottomBar />
        </div>
      )}
    </>
  );
};

export default App;
