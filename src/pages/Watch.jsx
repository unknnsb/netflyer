import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

const Watch = () => {
  const { type, id, season, episode } = useParams();

  return (
    <iframe
      allowFullScreen
      referrerPolicy="origin"
      src={
        type === "movie"
          ? `https://netflyer-backend.onrender.com/get-stream?id=${id}&type=movie`
          : `https://vidsrc.xyz/embed/tv/${id}/${season}-${episode}`
      }
      width="100%"
      height="100%"
      style={{
        height: "100vh",
        width: "100%",
      }}
    />
  );
};

export default Watch;
