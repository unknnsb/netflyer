import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

const Watch = () => {
  const { type, id, season, episode } = useParams();

  useEffect(() => {
    const iframeElement = document.querySelector("iframe");

    if (iframeElement) {
      // Check if fullscreen mode is supported by the browser
      if (iframeElement.requestFullscreen) {
        iframeElement.requestFullscreen();
      } else if (iframeElement.mozRequestFullScreen) {
        // Firefox
        iframeElement.mozRequestFullScreen();
      } else if (iframeElement.webkitRequestFullscreen) {
        // Chrome, Safari and Opera
        iframeElement.webkitRequestFullscreen();
      } else if (iframeElement.msRequestFullscreen) {
        // IE/Edge
        iframeElement.msRequestFullscreen();
      }
    }

    // Cleanup when the component unmounts
    return () => {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        // Firefox
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        // Chrome, Safari and Opera
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        // IE/Edge
        document.msExitFullscreen();
      }
    };
  }, []); // Empty dependency array to run this effect only once

  return (
    <iframe
      allowFullScreen
      src={
        type === "movie"
          ? ` https://multiembed.mov/?video_id=${id}&tmdb=1`
          : ` https://multiembed.mov/?video_id=${id}&tmdb=1&s=${season}&e=${episode}`
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
