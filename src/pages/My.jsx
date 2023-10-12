import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import { TMDB_API_KEY } from "../services/Tmdb";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PasswordPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [correctPassword] = useState("1199");
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [tvSeries, setTvSeries] = useState({});
  const [firstMovie, setFirstMovie] = useState({});
  const [secondMovie, setSecondMovie] = useState({});
  const [lost, setLost] = useState([]);
  const [dark, setDark] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTVSeriesAndMovies = () => {
    const tvSeriesId = 1396;
    const firstMovieId = 37165;
    const secondMovieId = 496243;
    const lostId = 4607;
    const darkId = 70523;

    axios
      .get(`https://api.themoviedb.org/3/tv/${tvSeriesId}`, {
        params: {
          api_key: TMDB_API_KEY,
        },
      })
      .then((res) => {
        setTvSeries(res.data);
      });
    axios
      .get(`https://api.themoviedb.org/3/tv/${lostId}`, {
        params: {
          api_key: TMDB_API_KEY,
        },
      })
      .then((res) => {
        setLost(res.data);
      });
    axios
      .get(`https://api.themoviedb.org/3/tv/${darkId}`, {
        params: {
          api_key: TMDB_API_KEY,
        },
      })
      .then((res) => {
        setDark(res.data);
      });

    axios
      .get(`https://api.themoviedb.org/3/movie/${firstMovieId}`, {
        params: {
          api_key: TMDB_API_KEY,
        },
      })
      .then((res) => {
        setFirstMovie(res.data);
      });

    axios
      .get(`https://api.themoviedb.org/3/movie/${secondMovieId}`, {
        params: {
          api_key: TMDB_API_KEY,
        },
      })
      .then((res) => {
        setSecondMovie(res.data);
        setLoading(false);
      });
  };

  useEffect(() => {
    const isPasswordVerified = localStorage.getItem("passwordVerified");
    if (isPasswordVerified === "true") {
      setPasswordVerified(true);
      fetchTVSeriesAndMovies();
    } else {
      setLoading(false);
    }
  }, []);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      setPasswordVerified(true);
      localStorage.setItem("passwordVerified", "true");
      fetchTVSeriesAndMovies();
    } else {
      navigate("/");
    }
  };

  return (
    <div className="bg-dark h-screen text-white font-poppins">
      {loading ? (
        <Loading />
      ) : passwordVerified ? (
        <>
          <Navbar />
          <h1 className="text-2xl mt-14 ml-2 p-2 font-bold">
            Here Is My Recommendations Akshay:
          </h1>
          <div className="flex flex-col items-center">
            <div className="grid grid-cols-1 p-2 sm:grid-cols-2 gap-6 mb-8">
              {tvSeries.name && (
                <div className="bg-stone-800 rounded-lg p-4">
                  <img
                    onClick={() => {
                      navigate(`/info/tv/${tvSeries.id}`);
                    }}
                    src={`https://image.tmdb.org/t/p/w500/${tvSeries.poster_path}`}
                    alt={tvSeries.name}
                    className="w-full h-auto rounded-lg"
                  />
                  <p className="text-xl mt-2">{tvSeries.name}</p>
                </div>
              )}
              {dark.name && (
                <div className="bg-stone-800 rounded-lg p-4">
                  <img
                    onClick={() => {
                      navigate(`/info/tv/${dark.id}`);
                    }}
                    src={`https://image.tmdb.org/t/p/w500/${dark.poster_path}`}
                    alt={dark.name}
                    className="w-full h-auto rounded-lg"
                  />
                  <p className="text-xl mt-2">{dark.name}</p>
                </div>
              )}
              {lost.name && (
                <div className="bg-stone-800 rounded-lg p-4">
                  <img
                    onClick={() => {
                      navigate(`/info/tv/${lost.id}`);
                    }}
                    src={`https://image.tmdb.org/t/p/w500/${lost.poster_path}`}
                    alt={lost.name}
                    className="w-full h-auto rounded-lg"
                  />
                  <p className="text-xl mt-2">{lost.name}</p>
                </div>
              )}
              {firstMovie.title && (
                <div className="bg-stone-800 rounded-lg p-4">
                  <img
                    onClick={() => {
                      navigate(`/info/movie/${firstMovie.id}`);
                    }}
                    src={`https://image.tmdb.org/t/p/w500/${firstMovie.poster_path}`}
                    alt={firstMovie.title}
                    className="w-full h-auto rounded-lg"
                  />
                  <p className="text-xl mt-2">{firstMovie.title}</p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 p-2 sm:grid-cols-2 gap-6">
              {secondMovie.title && (
                <div className="bg-stone-800 rounded-lg p-4">
                  <img
                    onClick={() => {
                      navigate(`/info/movie/${secondMovie.id}`);
                    }}
                    src={`https://image.tmdb.org/t/p/w500/${secondMovie.poster_path}`}
                    alt={secondMovie.title}
                    className="w-full h-auto rounded-lg"
                  />
                  <p className="text-xl mt-2">{secondMovie.title}</p>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center">
          <h1 className="text-3xl mb-4">
            Enter Password to Access Recommendations
          </h1>
          <form
            onSubmit={handlePasswordSubmit}
            className="flex flex-col items-center"
          >
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-64 p-2 rounded mb-2"
            />
            <button
              type="submit"
              className="bg-red-500 text-white py-2 px-4 rounded"
            >
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PasswordPage;
