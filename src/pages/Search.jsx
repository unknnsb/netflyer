import axios from 'axios'
import { onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomBar from '../components/BottomBar'
import Loading from '../components/Loading'
import { auth } from '../services/Firebase'
import { FaSearch } from "react-icons/fa"
import { API_KEY, endpoints, URL } from '../services/Tmdb'

const Search = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/")
      } else {
        setLoading(false)
      }
    })
  }, [])

  useEffect(() => {
    axios.get(`${URL}${endpoints.search}`, {
      params: {
        query: query,
        api_key: API_KEY
      }
    })
      .then((res) => setResults(res.data.results))
  }, [query])

  const handleClick = (id, tvShow) => {
    if (tvShow) {
      window.location.href = `/info/tv/${id}`
    } else {
      window.location.href = `/info/movie/${id}`
    }
  }

  const getDate = (date) => {
    const dateObject = new Date(date);
    const year = dateObject.getFullYear();
    return year
  }
  
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className='container p-3'>
            <h1 className='text-2xl font-bold text-white'>
              Search
            </h1>
            <input value={query} onChange={(e) => setQuery(e.target.value)} className='bg-[#444343] mt-2 p-2 rounded-lg outline-none border-none w-full text-gray-100' placeholder='What do you want to search?' />
            <div>
              {results.map(result => (
                <div onClick={() => {
                  if (result.first_air_date) {
                    handleClick(result.id, true)
                  } else {
                    handleClick(result.id, false)
                  }
                }} key={result.id} className="hover:opacity-20 transition-opacity duration-100 flex items-center gap-1 text-white mt-4 text-sm border-zinc-600 border-b p-1">
                  <FaSearch />
                  <h2>{result.title || result.name} ({getDate(result.release_date || result.first_air_date)})</h2>
                </div>
              ))}
            </div>
          </div>
          <BottomBar selected={3} />
        </>
      )
      }
    </>
  )
}

export default Search
