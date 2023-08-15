import React from 'react'
import { useParams } from 'react-router-dom'

const WatchMovie = () => {
  const { id } = useParams()
  return (
    <iframe
      className="h-screen"
      src={`https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1`}
      width="100%"
      height="100%"
      frameBorder="0"
      allowFullScreen="allowfullscreen"
    />
  )
}

export default WatchMovie
