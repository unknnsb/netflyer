import React, { useEffect, useState } from 'react';
import { API_KEY } from "../services/Tmdb"
import { useParams } from 'react-router-dom';
import Loading from '../components/Loading';

const Trailer = () => {
  const { type, id } = useParams();
  const [trailerKey, setTrailerKey] = useState('');
  const [videoResults, setVideoResults] = useState([]);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Function to fetch trailer key and videos from TMDb API
    const fetchTrailerAndVideos = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}&append_to_response=videos`
        );

        if (response.ok) {
          const data = await response.json();
          const videoResults = data.videos?.results || [];

          // Find the "Official Trailer" and get its key
          const officialTrailer = videoResults.find(
            (video) => video.name.includes('Trailer')
          );

          setTrailerKey(officialTrailer?.key || '');

          // Set all video results
          setVideoResults(videoResults);
          setLoading(false)
        } else {
          // Handle error here
          console.error('Error fetching trailer and videos');
        }
      } catch (error) {
        console.error('Error fetching trailer and videos:', error);
      }
    };

    // Call the function to fetch trailer key and videos when component mounts
    fetchTrailerAndVideos();
  }, [type, id]);

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div
            style={{
              position: 'relative',
              paddingTop: '56.25%', // 16:9 aspect ratio (adjust as needed)
              height: '0',
            }}
          >
            {trailerKey && (
              <iframe
                title="Trailer"
                allowFullScreen
                src={`https://www.youtube.com/embed/${trailerKey}`}
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  width: '100%',
                  height: '100%',
                }}
              />
            )}
          </div>

          <div className="mt-4">
            {videoResults.map((video) => (
              <iframe
                key={video.key}
                src={`https://www.youtube.com/embed/${video.key}`}
                allowFullScreen
                className="w-full h-8 pt-[56.25%] bg-blackish rounded-lg shadow-md mb-4"
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Trailer;

