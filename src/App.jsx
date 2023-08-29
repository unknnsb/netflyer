import { onAuthStateChanged, signOut } from 'firebase/auth'
import { getDocs, collection, doc, getDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Slider from './components/Slider'
import Loading from './components/Loading'
import { auth, db } from './services/Firebase'
import BottomBar from './components/BottomBar'
import FeaturedMovie from './components/FeaturedMovie'

const App = () => {
  const [username, setUsername] = useState('')
  const [avatar, setAvatar] = useState('')
  const [loading, setLoading] = useState(true)
  const [topTrendingMovies, setTopTrendingMovies] = useState([]);
  const [allTimeTrendingTV, setAllTimeTrendingTV] = useState([]);
  const [latestTVSeries, setLatestTVSeries] = useState([]);
  const navigate = useNavigate()
  const API_KEY = 'bb2818a2abb39fbdf6da79343e5e376b'

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      navigate('/signup')
    } else {
      const userRef = doc(db, 'users', user.uid)
      getDoc(userRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data()
            setUsername(userData.username)
            setAvatar(userData.avatar)
            setLoading(false)
          }
        })
        .catch((error) => {
          console.error('Error fetching account data:', error)
          alert('Error fetching account data:', error)
        })
    }
  })

  const handleLogOut = () => {
    signOut(auth).then(() => {
      navigate('/login')
    })
  }

  useEffect(() => {
    // Fetch top trending movies of the week
    axios
      .get(
        `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`
      )
      .then((response) => {
        setTopTrendingMovies(response.data.results);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    // Fetch all-time trending TV series
    axios
      .get(
        `https://api.themoviedb.org/3/trending/tv/day?api_key=${API_KEY}`
      )
      .then((response) => {
        setAllTimeTrendingTV(response.data.results);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    // Fetch latest TV series
    axios
      .get(
        `https://api.themoviedb.org/3/tv/latest?api_key=${API_KEY}`
      )
      .then((response) => {
        setLatestTVSeries([response.data]);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
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
              <Slider title="Top Trending Movies of the Week" slides={topTrendingMovies.map(movie => `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`)} />
            </section>
            <section className="mb-16">
              <Slider title="All-Time Trending TV Series" slides={allTimeTrendingTV.map(series => `https://image.tmdb.org/t/p/original/${series.backdrop_path}`)} />
            </section>
            <section className="mb-16">
              <Slider title="Latest TV Series" slides={latestTVSeries.map(series => `https://image.tmdb.org/t/p/original/${series.backdrop_path}`)} />
            </section>
          </main>
          <BottomBar />
        </div>
      )}
    </>
  )
}

export default App
