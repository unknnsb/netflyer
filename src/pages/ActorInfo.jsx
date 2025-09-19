import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { BACKEND_URL } from "../services/Api";
import { Card, CardBody, Image, Chip, Button, Spinner } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, Star, Film, Tv, Award } from "lucide-react";
import Loading from "../components/Loading";

const ActorInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [actor, setActor] = useState(null);
  const [credits, setCredits] = useState({ cast: [], crew: [] });
  const [loading, setLoading] = useState(true);
  const [showFullBio, setShowFullBio] = useState(false);
  const [selectedTab, setSelectedTab] = useState("movies");

  useEffect(() => {
    const fetchActorDetails = async () => {
      try {
        setLoading(true);

        const actorResponse = await fetch(`${BACKEND_URL}/api/person/${id}`);
        const actorData = await actorResponse.json();
        setActor(actorData);

        const creditsResponse = await fetch(`${BACKEND_URL}/api/person/${id}/credits`);
        const creditsData = await creditsResponse.json();
        setCredits(creditsData);

      } catch (error) {
        console.error("Error fetching actor details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActorDetails();
  }, [id]);

  const getAge = (birthday, deathday) => {
    if (!birthday) return null;
    const birth = new Date(birthday);
    const end = deathday ? new Date(deathday) : new Date();
    return Math.floor((end - birth) / (365.25 * 24 * 60 * 60 * 1000));
  };

  const sortedMovies = credits.cast
    ?.filter(item => item.media_type === "movie")
    .sort((a, b) => new Date(b.release_date || 0) - new Date(a.release_date || 0));

  const sortedTvShows = credits.cast
    ?.filter(item => item.media_type === "tv")
    .sort((a, b) => new Date(b.first_air_date || 0) - new Date(a.first_air_date || 0));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Button
            isIconOnly
            variant="bordered"
            size="lg"
            className="rounded-xl border-zinc-700 hover:border-zinc-600"
            onPress={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold">Actor Details</h1>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <Card className="bg-zinc-900/50 border border-zinc-800 rounded-2xl shadow-xl">
              <CardBody className="p-6 space-y-6">
                <div className="text-center">
                  <div className="relative inline-block">
                    <Image
                      src={
                        actor.profile_path
                          ? `https://image.tmdb.org/t/p/w400/${actor.profile_path}`
                          : "/not-found.png"
                      }
                      alt={actor.name}
                      className="w-48 h-48 object-cover rounded-2xl mx-auto shadow-lg"
                    />
                    {actor.popularity && (
                      <Chip
                        startContent={<Star className="w-3 h-3" />}
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-yellow-500/20 text-yellow-400"
                        size="sm"
                      >
                        {actor.popularity.toFixed(1)}
                      </Chip>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold mt-4 mb-2">{actor.name}</h2>
                  {actor.known_for_department && (
                    <Chip variant="flat" className="bg-blue-500/20 text-blue-400">
                      {actor.known_for_department}
                    </Chip>
                  )}
                </div>

                <div className="space-y-4">
                  {actor.birthday && (
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="w-4 h-4 text-zinc-500" />
                      <div>
                        <span className="text-zinc-400">Born:</span>
                        <span className="ml-2 text-white">
                          {new Date(actor.birthday).toLocaleDateString()}
                          {getAge(actor.birthday, actor.deathday) && (
                            <span className="text-zinc-500 ml-2">
                              (Age {getAge(actor.birthday, actor.deathday)})
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  )}

                  {actor.deathday && (
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="w-4 h-4 text-zinc-500" />
                      <div>
                        <span className="text-zinc-400">Died:</span>
                        <span className="ml-2 text-white">
                          {new Date(actor.deathday).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )}

                  {actor.place_of_birth && (
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="w-4 h-4 text-zinc-500" />
                      <div>
                        <span className="text-zinc-400">Place of Birth:</span>
                        <span className="ml-2 text-white">{actor.place_of_birth}</span>
                      </div>
                    </div>
                  )}
                </div>

                {actor.also_known_as && actor.also_known_as.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 text-zinc-300">Also Known As</h3>
                    <div className="flex flex-wrap gap-2">
                      {actor.also_known_as.slice(0, 3).map((name, index) => (
                        <Chip key={index} size="sm" variant="bordered" className="text-zinc-400 border-zinc-700">
                          {name}
                        </Chip>
                      ))}
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
            {actor.biography && (
              <Card className="bg-zinc-900/50 border border-zinc-800 rounded-2xl shadow-xl">
                <CardBody className="p-6">
                  <h3 className="text-xl font-bold mb-4">Biography</h3>
                  <p className="text-zinc-300 leading-relaxed">
                    {showFullBio || actor.biography.length <= 300
                      ? actor.biography
                      : `${actor.biography.substring(0, 300)}...`}
                  </p>
                  {actor.biography.length > 300 && (
                    <Button
                      variant="light"
                      size="sm"
                      className="mt-4 text-blue-400"
                      onPress={() => setShowFullBio(!showFullBio)}
                    >
                      {showFullBio ? "Show Less" : "Read More"}
                    </Button>
                  )}
                </CardBody>
              </Card>
            )}

            <Card className="bg-zinc-900/50 border border-zinc-800 rounded-2xl shadow-xl">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Filmography</h3>
                  <div className="flex gap-2 p-1 bg-zinc-800 rounded-xl">
                    <Button
                      size="sm"
                      variant={selectedTab === "movies" ? "solid" : "light"}
                      color="primary"
                      startContent={<Film className="w-4 h-4" />}
                      onPress={() => setSelectedTab("movies")}
                      className="rounded-lg"
                    >
                      Movies ({sortedMovies?.length || 0})
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedTab === "tv" ? "solid" : "light"}
                      color="primary"
                      startContent={<Tv className="w-4 h-4" />}
                      onPress={() => setSelectedTab("tv")}
                      className="rounded-lg"
                    >
                      TV Shows ({sortedTvShows?.length || 0})
                    </Button>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    {(selectedTab === "movies" ? sortedMovies : sortedTvShows)
                      ?.slice(0, 12)
                      .map((item) => (
                        <motion.div
                          key={item.id}
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Card
                            className="bg-zinc-800/50 border border-zinc-700 hover:bg-zinc-700/50 hover:border-zinc-600 transition-all duration-300 cursor-pointer"
                            isPressable
                            onPress={() => navigate(`/info/${item.media_type}/${item.id}`)}
                          >
                            <CardBody className="p-4">
                              <div className="flex gap-3">
                                <Image
                                  src={
                                    item.poster_path
                                      ? `https://image.tmdb.org/t/p/w92/${item.poster_path}`
                                      : "/not-found.png"
                                  }
                                  alt={item.title || item.name}
                                  className="w-16 h-24 object-cover rounded-lg flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-sm line-clamp-2 mb-2 hover:text-blue-400 transition-colors">
                                    {item.title || item.name}
                                  </h4>
                                  {item.character && (
                                    <p className="text-xs text-zinc-500 mb-1">
                                      as {item.character}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                                    <Calendar className="w-3 h-3" />
                                    <span>
                                      {(item.release_date || item.first_air_date)?.split('-')[0] || 'TBA'}
                                    </span>
                                    {item.vote_average > 0 && (
                                      <>
                                        <Star className="w-3 h-3 text-yellow-400 fill-current ml-2" />
                                        <span>{item.vote_average.toFixed(1)}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardBody>
                          </Card>
                        </motion.div>
                      ))}
                  </motion.div>
                </AnimatePresence>

                {(selectedTab === "movies" ? sortedMovies : sortedTvShows)?.length > 12 && (
                  <div className="text-center mt-6">
                    <Chip variant="flat" size="sm" className="text-zinc-400">
                      Showing 12 of {(selectedTab === "movies" ? sortedMovies : sortedTvShows).length} {selectedTab}
                    </Chip>
                  </div>
                )}
              </CardBody>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ActorInfo;

