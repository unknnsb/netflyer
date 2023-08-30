import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaPlay, FaPlus, FaStar } from 'react-icons/fa';
import { RxVideo } from "react-icons/rx"
import Loading from "../components/Loading"
import { Link, useNavigate, useParams } from 'react-router-dom';
import { API_KEY, URL } from '../services/Tmdb';
import MovieRow from '../components/MovieRow';
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../services/Firebase'

const Info = () => {
  const { type, id } = useParams();
  const [result, setResult] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true)
  const [cast, setCast] = useState([])
  const [recommendation, setRecommendation] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/')
      } else {
        setLoading(false)
      }
    })
  }, [])

  useEffect(() => {
    const mediaType = type == "tv" ? "tv" : "movie"
    axios.get(`${URL}/${mediaType}/${id}`, {
      params: { api_key: API_KEY }
    })
      .then((res) => {
        setResult(res.data)
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
    axios.get(`${URL}/${mediaType}/${id}/credits`, {
      params: {
        api_key: API_KEY
      }
    })
      .then((res) => setCast(res.data.cast))
    axios.get(`${URL}/${mediaType}/${id}/recommendations`, {
      params: {
        api_key: API_KEY
      }
    })
      .then((res) => setRecommendation(res.data.results))
  }, [id, type]);

  const formatDate = (dateString) => {
    if (!dateString) {
      return 'Release date unavailable';
    }

    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateParts = dateString.split('-');

    if (dateParts.length !== 3) {
      return 'Invalid date format';
    }

    const formattedDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    return formattedDate.toLocaleDateString(undefined, dateOptions);
  };

  const toggleOverview = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <div
            className="absolute inset-0 h-72 bg-cover bg-center w-full"
            style={{
              backgroundImage: `linear-gradient(to top, #202020, transparent), url(https://image.tmdb.org/t/p/original${result.backdrop_path})`
            }}
          >
          </div>
          <header className="absolute top-0 left-0 container p-2 text-white flex items-center">
            <Link to="/"><FaArrowLeft className='text-xl' /></Link>
          </header>
          <div>
          </div>
          <div className="absolute top-64 left-0 p-4 text-white">
            <h1 className="text-2xl font-bold">{type == "tv" ? result.name : result.title}</h1>
            <h2 className='flex items-center text-[10px] mt-2 font-bold gap-1'>{type == "tv" ? result.number_of_seasons + " Seasons - " + result.number_of_episodes + " Episodes" : <><FaStar className='text-sm' /> {result.vote_average} - {formatDate(result.release_date)}</>}</h2>
          </div>
          <button className='absolute top-80 flex items-center justify-center mt-4 bg-red-500 gap-1 rounded-lg text-center ml-5 text-white w-[90%] p-2 border-none outline-none'><FaPlay /> Play</button>
          <p className='relative ml-2 top-96 text-sm p-2 text-gray-300'>
            {expanded || result.overview.length <= 120
              ? result.overview
              : result.overview.slice(0, 120) + '...'}
            {result.overview.length > 120 && (
              <span className="cursor-pointer text-blue-500 ml-1" onClick={toggleOverview}>
                {expanded ? 'Read less' : 'Read more'}
              </span>
            )}
          </p>
          <div className='absolute flex gap-5 top-[440px] text-white p-2 ml-2 mt-8'>
            <button className='flex items-center flex-col'>
              <RxVideo className='text-2xl' />
              <p className='text-center text-[14px] mt-2 text-gray-300'>Trailer</p>
            </button>
            <button className='flex items-center flex-col'>
              <FaPlus className='text-2xl' />
              <p className='text-center text-[14px] mt-2 text-gray-400'>My List</p>
            </button>
          </div>
          <div className="absolute top-[520px] ml-2">
            <MovieRow title="CAST" movies={cast} profile={true} />
          </div>
          <div className="absolute top-[920px] ml-2">
            <MovieRow title="RELATED" movies={recommendation} />
          </div>
        </div >
      )}
    </>
  );
}

export default Info;

