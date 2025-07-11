import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Watch = () => {
  const { type, id, season, episode } = useParams();
  const [streamUrl, setStreamUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStreamUrl = async () => {
      try {
        if (type === "movie") {
          setLoading(true);
          const response = await fetch(
            `https://netflyer-backend.onrender.com/get-stream?id=${id}&type=movie`
          );
          
          if (!response.ok) {
            throw new Error(`Failed to fetch stream (HTTP ${response.status})`);
          }

          const data = await response.json();
          setStreamUrl(data.streamUrl);
        } else {
          setStreamUrl(`https://vidsrc.xyz/embed/tv/${id}/${season}-${episode}`);
        }
      } catch (err) {
        console.error("Error fetching stream URL:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStreamUrl();
  }, [type, id, season, episode]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-500">
        <p>Error loading content: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <iframe
      allowFullScreen
      referrerPolicy="origin"
      src={streamUrl}
      width="100%"
      height="100%"
      style={{
        height: "100vh",
        width: "100%",
      }}
      title="video-player"
    />
  );
};

export default Watch;
