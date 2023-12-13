import Navbar from "../components/Navbar";
import { TMDB_API_KEY, endpoints, TMDB_URL } from "../services/Tmdb";
import { Input, Card, CardBody, Image, Button } from "@nextui-org/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    axios
      .get(`${TMDB_URL}${endpoints.search}`, {
        params: {
          query: query,
          api_key: TMDB_API_KEY,
        },
      })
      .then((res) => {
        setResults(res.data.results);
      });
  }, [query]);

  const getDate = (date) => {
    const dateObject = new Date(date);
    const year = dateObject.getFullYear();
    return year;
  };

  return (
    <div className="text-white">
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Search</h1>
        <div className="relative mb-4">
          <Input
            value={query}
            startContent={<FaSearch />}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What do you want to search?"
          />
          <div className="mt-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map((result) => (
              <Card
                key={result.id}
                className="cursor-pointer hover:opacity-75 transition-opacity duration-300"
              >
                <Image
                  onClick={() =>
                    result.first_air_date
                      ? (window.location.href = `/info/tv/${result.id}`)
                      : (window.location.href = `/info/movie/${result.id}`)
                  }
                  src={
                    result.poster_path
                      ? `https://image.tmdb.org/t/p/w500/${result.poster_path}`
                      : "/not-found.png"
                  }
                  alt={result.title || result.name}
                  className="w-full rounded-lg"
                  fallbackSrc="/not-found.png"
                />
                <CardBody>
                  <p className="mt-2 text-sm font-semibold">
                    {result.title || result.name} (
                    {getDate(result.release_date || result.first_air_date)})
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
