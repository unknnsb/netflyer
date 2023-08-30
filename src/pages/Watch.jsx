import React from 'react'
import { useParams } from 'react-router-dom'

const Watch = () => {
  const { id } = useParams()
  return (
    <iframe
      allowFullScreen
      src={`https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1`}
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
