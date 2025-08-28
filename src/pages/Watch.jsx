import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { BACKEND_URL } from "../services/Api";

const Watch = () => {
  const { type, id, season, episode } = useParams();
  const providers = ["vidsrc-pk", "vidsrc-icu"];
  const [provider, setProvider] = useState(providers[0]);
  const [embedUrl, setEmbedUrl] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchEmbedUrl = async () => {
    setLoading(true);
    try {
      let url = `${BACKEND_URL}/api/embed/${type}/${id}?provider=${provider}`;
      if (type === "tv" && season && episode) {
        url += `&s=${season}&e=${episode}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      setEmbedUrl(data.url || "");
    } catch (err) {
      console.error("Failed to fetch embed URL:", err);
      setEmbedUrl("");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEmbedUrl();
  }, [type, id, season, episode, provider]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">
        Watching {type === "movie" ? "Movie" : `TV Show S${season}E${episode}`}
      </h2>

      <div className="mb-4 flex items-center gap-2">
        <span className="font-medium">Provider:</span>
        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {providers.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <button
          onClick={fetchEmbedUrl}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
        >
          Reload
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : embedUrl ? (
        <iframe
          src={embedUrl}
          title="video player"
          width="100%"
          height="600px"
          className="rounded shadow"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      ) : (
        <p className="text-red-500">Failed to load video.</p>
      )}
    </div>
  );
};

export default Watch;
