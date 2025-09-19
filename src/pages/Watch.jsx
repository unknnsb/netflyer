import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../services/Api";
import { Button, Select, SelectItem, Card, CardBody, Chip, Spinner } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, ArrowLeft, AlertCircle, Tv, Film } from "lucide-react";

const Watch = () => {
  const { type, id, season, episode } = useParams();
  const navigate = useNavigate();
  const providers = [
    { key: "vidplus", label: "VidPlus", description: "HD Quality" },
    { key: "vidsrc-pk", label: "VidSrc PK", description: "Fast Loading" },
    { key: "vidsrc-icu", label: "VidSrc ICU", description: "Stable" }
  ];

  const [provider, setProvider] = useState(providers[0].key);
  const [embedUrl, setEmbedUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEmbedUrl = async () => {
    setLoading(true);
    setError("");
    try {
      let url = `${BACKEND_URL}/api/embed/${type}/${id}?provider=${provider}`;
      if (type === "tv" && season && episode) {
        url += `&s=${season}&e=${episode}`;
      }
      const res = await fetch(url);
      const data = await res.json();

      if (data.url) {
        setEmbedUrl(data.url);
      } else {
        setError("No video source available for this provider");
      }
    } catch (err) {
      console.error("Failed to fetch embed URL:", err);
      setError("Failed to load video source");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEmbedUrl();
  }, [type, id, season, episode, provider]);

  const getTitle = () => {
    if (type === "movie") {
      return "Movie";
    }
    return `Season ${season}, Episode ${episode}`;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-6 max-w-7xl"
      >
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            <Button
              isIconOnly
              variant="bordered"
              size="lg"
              className="rounded-xl border-zinc-700 hover:border-zinc-600"
              onPress={() => navigate(-1)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
                {type === "movie" ? (
                  <Film className="w-6 h-6 text-white" />
                ) : (
                  <Tv className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Now Watching
                </h1>
                <p className="text-zinc-400">
                  {getTitle()}
                </p>
              </div>
            </div>
          </div>

          <Chip
            variant="flat"
            color="primary"
            startContent={<Play className="w-3 h-3" />}
            className="hidden sm:flex"
          >
            Live Player
          </Chip>
        </motion.div>

        {/* Video Player Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Controls */}
          <Card className="bg-zinc-900/50 border border-zinc-800 rounded-2xl shadow-xl">
            <CardBody className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-3 text-zinc-300">
                    Video Provider
                  </label>
                  <Select
                    selectedKeys={[provider]}
                    onSelectionChange={(keys) => setProvider(Array.from(keys)[0])}
                    className="max-w-xs"
                    radius="lg"
                    variant="bordered"
                    placeholder="Choose provider"
                  >
                    {providers.map((p) => (
                      <SelectItem key={p.key} textValue={p.label}>
                        <div className="flex flex-col">
                          <span className="font-medium">{p.label}</span>
                          <span className="text-xs text-zinc-500">{p.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button
                    color="primary"
                    startContent={<RotateCcw className="w-4 h-4" />}
                    onPress={fetchEmbedUrl}
                    className="rounded-xl font-semibold shadow-lg shadow-blue-500/25"
                    isLoading={loading}
                  >
                    {loading ? "Loading..." : "Reload"}
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Video Player */}
          <Card className="bg-zinc-900/50 border border-zinc-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="relative">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-32 bg-zinc-900"
                  >
                    <Spinner color="primary" size="lg" />
                    <p className="text-zinc-400 mt-4 text-lg">Loading video player...</p>
                  </motion.div>
                ) : error ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center justify-center py-32 bg-zinc-900"
                  >
                    <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
                    <h3 className="text-xl font-semibold text-red-400 mb-2">
                      Failed to Load Video
                    </h3>
                    <p className="text-zinc-400 mb-6 text-center max-w-md">
                      {error}. Try switching to a different provider or reload the player.
                    </p>
                    <Button
                      color="danger"
                      variant="bordered"
                      startContent={<RotateCcw className="w-4 h-4" />}
                      onPress={fetchEmbedUrl}
                      className="rounded-xl"
                    >
                      Try Again
                    </Button>
                  </motion.div>
                ) : embedUrl ? (
                  <motion.div
                    key="player"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative"
                  >
                    <iframe
                      src={embedUrl}
                      title="Video Player"
                      className="w-full h-[60vh] md:h-[70vh] lg:h-[80vh] rounded-2xl"
                      frameBorder="0"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />

                    {/* Player Overlay Info */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                      <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-xl px-3 py-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-white">Live</span>
                      </div>

                      <Chip
                        variant="solid"
                        size="sm"
                        className="bg-black/60 text-white backdrop-blur-sm"
                      >
                        {providers.find(p => p.key === provider)?.label}
                      </Chip>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="no-source"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center justify-center py-32 bg-zinc-900"
                  >
                    <Play className="w-16 h-16 text-zinc-600 mb-4" />
                    <h3 className="text-xl font-semibold text-zinc-400 mb-2">
                      No Video Available
                    </h3>
                    <p className="text-zinc-500 text-center max-w-md">
                      Unable to load video from the current provider. Please try a different provider.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4 text-sm text-zinc-500"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Secure Connection</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>HD Quality Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Multiple Providers</span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Watch;

