import Navbar from "../components/Navbar";
import axios from "axios";
import React, { useEffect, useState, useMemo } from "react";
import { Search } from "lucide-react";
import { BACKEND_URL } from "../services/Api";
import { Card, CardBody, Image, Input } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    const debounceTimer = setTimeout(() => {
      axios
        .get(`${BACKEND_URL}/api/search/${query}`)
        .then((res) => {
          setResults(res.data.results || []);
        })
        .catch((error) => {
          console.error("Search error:", error);
          setResults([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const getDate = (date) => {
    if (!date) return "N/A";
    const dateObject = new Date(date);
    return dateObject.getFullYear();
  };

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const filteredResults = useMemo(() => {
    return results.filter((result) => result.poster_path);
  }, [results]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-6 text-center">Search</h1>
          <div className="max-w-2xl mx-auto">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What do you want to search?"
              variant="bordered"
              size="lg"
              radius="lg"
              startContent={
                <Search className="text-zinc-400 pointer-events-none flex-shrink-0" />
              }
              className="text-white"
            />
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center py-16"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
            </motion.div>
          ) : query && filteredResults.length === 0 ? (
            <motion.div
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <Search className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
              <p className="text-xl text-zinc-400">No results found for "{query}"</p>
              <p className="text-zinc-500 mt-2">Try a different search term</p>
            </motion.div>
          ) : filteredResults.length > 0 ? (
            <motion.div
              key="results"
              variants={gridVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
            >
              {filteredResults.map((result) => (
                <motion.div key={result.id} variants={cardVariants}>
                  <Card
                    className="cursor-pointer group bg-zinc-900/50 hover:bg-zinc-800/50 transition-all duration-300 border-zinc-800 hover:border-zinc-700"
                    isPressable
                    onPress={() => {
                      const path = result.first_air_date
                        ? `/info/tv/${result.id}`
                        : `/info/movie/${result.id}`;
                      window.location.href = path;
                    }}
                  >
                    <div className="relative overflow-hidden rounded-lg">
                      <Image
                        src={
                          result.poster_path
                            ? `https://image.tmdb.org/t/p/w500/${result.poster_path}`
                            : "/not-found.png"
                        }
                        alt={result.title || result.name}
                        className="w-full aspect-[2/3] object-cover group-hover:scale-110 transition-transform duration-300"
                        fallbackSrc="/not-found.png"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <CardBody className="p-3">
                      <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-blue-400 transition-colors">
                        {result.title || result.name}
                      </h3>
                      <p className="text-xs text-zinc-500 mt-1">
                        {getDate(result.release_date || result.first_air_date)}
                      </p>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SearchPage;
