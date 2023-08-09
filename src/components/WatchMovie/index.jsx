import React from "react";
import { useParams } from "react-router-dom";
import "./styles.css";

const index = () => {
  const { id } = useParams();
  return (
    <iframe
      src={`https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1&s=1&e=1`}
      width="100%"
      height="100%"
      frameborder="0"
    ></iframe>
  );
};

export default index;
