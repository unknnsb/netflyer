import React from "react";
import { useParams } from "react-router-dom";
import "../styles/WatchMovie.css";

const WatchMovie = () => {
  const { id } = useParams();
  return (
    <iframe
      src={`https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1`}
      width="100%"
      height="100%"
      frameborder="0"
      allowfullscreen="allowfullscreen"
    ></iframe>
  );
};

export default WatchMovie;
