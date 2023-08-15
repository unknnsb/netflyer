import { useUser } from '@clerk/clerk-react'
import axios from 'axios'
import { doc, setDoc } from 'firebase/firestore'
import React, { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import Header from '../components/Header'
import Loading from '../components/Loading'
import { db } from '../services/firebase'

const WatchListAdd = () => {
  const { id } = useParams()
  const location = useLocation()
  const isTvShowParam = new URLSearchParams(location.search).get('tv')
  const [details, setDetails] = useState({})
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const { user, isLoaded } = useUser()

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/${
            isTvShowParam === 'true' ? 'tv' : 'movie'
          }/${id}?api_key=bb2818a2abb39fbdf6da79343e5e376b`
        )
        setDetails(response.data)
      } catch (error) {
        console.error('Error fetching details:', error)
      }
    }

    fetchDetails()
  }, [id, isTvShowParam])

  const addToWatchList = async () => {
    if (user) {
      const data = {
        id,
        title: details.title || details.name,
        poster: details.poster_path,
        isTvShow: isTvShowParam === 'true',
      }
      setLoading(true)
      try {
        await setDoc(doc(db, `watchlist/${user.id}/items`, id), data)
        setMessage(
          `Added The ${isTvShowParam === 'true' ? 'TV Show' : 'Movie'} "${
            details.title || details.name
          }" to watch list`
        )
      } catch (error) {
        console.error('Error adding to watch list:', error)
      }
      setLoading(false)
    }
  }

  if (!isLoaded) {
    return <Loading />
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-screen-md mt-20 mx-auto p-4">
        <h2 className="text-2xl text-white font-semibold mb-4">
          Add to Watch List
        </h2>
        <div className="flex flex-col items-center">
          {details.poster_path && (
            <img
              className="w-60 h-80 rounded-lg mb-4 object-cover"
              src={`https://image.tmdb.org/t/p/w300${details.poster_path}`}
              alt={details.title || details.name}
            />
          )}
          <h3 className="text-white text-lg font-semibold">
            {details.title || details.name}
          </h3>
          <button
            className="px-4 py-2 mt-4 rounded-md bg-green-600 text-white"
            onClick={addToWatchList}
          >
            Add to Watch List
          </button>
        </div>
        {loading && (
          <div className="flex justify-center items-center mt-4">
            <Loading />
          </div>
        )}
        {message && (
          <p className="text-green-500 mt-2 text-center">{message}</p>
        )}
      </div>
    </div>
  )
}

export default WatchListAdd
