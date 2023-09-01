import React from 'react'
import { useParams } from 'react-router-dom'

const Watch = () => {
  const { type, id, season, episode } = useParams()
  return (
    <iframe
      allowFullScreen
      src={type == 'movie' ? `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1` : `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1&s=${season}&e=${episode}`}
      width="100%"
      height="100%"
      style={{
        height: '100vh',
        width: '100%'
      }}
    />
  )
}

export default Watch
