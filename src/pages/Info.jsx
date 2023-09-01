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
  const [episodes, setEpisodes] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [showRelated, setRelated] = useState(true)
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
      .then((res) => {
        setRecommendation(res.data.results)
      })
  }, [id, type, loading]);

  useEffect(() => {
    if (type === 'tv') {
      axios.get(`${URL}/tv/${id}?api_key=${API_KEY}&language=en-US`)
        .then(response => {
          setSeasons(response.data.seasons);
        })
        .catch(error => {
          console.error('Error fetching seasons:', error);
        });

      axios.get(`${URL}/tv/${id}/season/${selectedSeason}?api_key=${API_KEY}&language=en-US`)
        .then(response => {
          setEpisodes(response.data.episodes);
          setLoading(false)
        })
        .catch(error => {
          console.error('Error fetching episodes:', error);
        });
    }
  }, [type, selectedSeason])

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

  const toggleRelated = () => {
    setRelated(!showRelated)
  }

  const watchMovie = (id) => {
    navigate(`/watch/movie/${id}`)
  }
  const watchTvShow = (id, season, episode) => {
    navigate(`/watch/tv/${id}/${season}/${episode}`)
  }
  return (
    <div className="relative">
      {loading ? (
        <Loading />
      ) : (
        <div>
          {/* Background */}
          <div className="absolute inset-0 h-72 bg-cover bg-center w-full" style={{ backgroundImage: `linear-gradient(to top, #202020, transparent), url(https://image.tmdb.org/t/p/original${result.backdrop_path})` }}></div>

          {/* Header */}
          <header className="absolute top-0 left-0 container p-2 text-white flex items-center">
            <Link to="/"><FaArrowLeft className='text-xl' /></Link>
          </header>

          {/* Title and Info */}
          <div className="absolute top-64 left-0 p-4 text-white">
            <h1 className={type == "tv" ? result.name.length > 30 ? "text-[20px] font-bold" : "text-2xl font-bold" : result.title.length > 30 ? "text-[20px] font-bold" : "text-2xl font-bold"}>{type === "tv" ? result.name : result.title}</h1>
            <h2 className='flex items-center text-[10px] mt-2 font-bold gap-1'>
              {type === "tv" ? `${result.number_of_seasons} Seasons - ${result.number_of_episodes} Episodes` :
                <>
                  <FaStar className='text-sm' /> {result.vote_average} - {formatDate(result.release_date)}
                </>
              }
            </h2>
          </div>

          {/* Play Button */}
          <button onClick={() => type == "movie" ? watchMovie(result.id) : watchTvShow(id, 1, 1)} className='absolute top-80 flex items-center justify-center mt-4 bg-red-500 gap-1 rounded-lg text-center ml-5 text-white w-[90%] p-2 border-none outline-none'>
            <FaPlay /> Play
          </button>

          {/* Overview */}
          <p className='relative ml-2 top-96 text-sm p-2 text-gray-300'>
            {expanded || result.overview.length <= 120 ? result.overview : `${result.overview.slice(0, 120)}...`}
            {result.overview.length > 120 && (
              <span className="cursor-pointer text-blue-500 ml-1" onClick={toggleOverview}>
                {expanded ? 'Read less' : 'Read more'}
              </span>
            )}
          </p>

          {/* Buttons */}
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

          {/* Related Movies or TV Shows */}
          {type === 'movie' ? (
            <div className="absolute top-[520px] ml-2">
              <MovieRow title="RELATED" movies={recommendation} />
            </div>
          ) : (
            <div className={`flex flex-col absolute top-[540px] ml-2`}>
              <div className="tabs mt-2 w-full sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%]">
                <h2 onClick={() => setRelated(false)} className={showRelated == false ? "border-b-2 border-red-500 text-red-500 text-lg cursor-pointer mb-2 inline-block px-4 py-2 bg-dark bg-opacity-50 rounded-t-lg" : "text-red-500 text-lg cursor-pointer mb-2 inline-block px-4 py-2 bg-dark bg-opacity-50 rounded-t-lg"}>EPISODES</h2>
                <h2 onClick={() => setRelated(true)} className={showRelated == true ? "border-b-2 border-red-500 text-red-500 text-lg cursor-pointer mb-2 inline-block px-4 py-2 bg-dark bg-opacity-50 rounded-t-lg" : "text-red-500 text-lg cursor-pointer mb-2 inline-block px-4 py-2 bg-dark bg-opacity-50 rounded-t-lg"}>RELATED</h2>
                <div className={showRelated == true ? "hidden" : "tab-content bg-dark bg-opacity-75 p-4 rounded-b-lg"}>
                  <div className="season-select mb-4">
                    <label htmlFor="season" className="text-white text-lg font-semibold">Select Season:</label>
                    <select
                      id="season"
                      className="ml-2 px-2 py-1 bg-dark text-white border border-gray-600 rounded"
                      value={selectedSeason}
                      onChange={event => setSelectedSeason(parseInt(event.target.value))}
                    >
                      {seasons.map(season => (
                        <option key={season.season_number} value={season.season_number}>
                          {`Season ${season.season_number}`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="tab-pane" id="episodes">
                    {episodes.map((episode, index) => (
                      <div onClick={() => watchTvShow(id, selectedSeason, index + 1)} className="episode-card mb-4 p-2 border border-gray-800 rounded-md flex" key={index}>
                        <img src={episode.runtime == null ? 'https://placehold.co/600x400/png' : `https://image.tmdb.org/t/p/w500${episode.still_path}`} alt={`Episode ${index + 1}`} className="w-24 h-32 object-cover rounded-md mr-3" />
                        <div className="flex flex-col">
                          <h2 className="text-white text-lg font-semibold">{`Episode ${index + 1}: ${episode.name}`}</h2>
                          <p className="text-gray-400 text-sm mt-1">{episode.overview.length > 100 ? `${episode.overview.slice(0, 100)}...` : episode.overview}</p>
                          <p className="text-zinc-400 text-sm mt-1">{episode.runtime == null ? "Not Released" : ""}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={showRelated == true ? "block" : "hidden"}>
                  <MovieRow title="" movies={recommendation} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Info
