import HeroSection from "./components/Hero";
import Loading from "./components/Loading";
import Row from "./components/MovieRow";
import Header from "./components/Navbar";
import { endpoints } from "./services/Api";
import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from './services/Api'

const useFetchData = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    trending_tv: null,
    trending_movies: null,
    trending: null,
    airing_today: null,
    popular: null,
    anime: null,
  });

  useEffect(() => {
    const fetchDataPromises = Object.entries(endpoints).map(([key, endpoint]) =>
      axios
        .get(`${BACKEND_URL}${endpoint}`)
        .then((response) => [key, response.data.results])
    );

    Promise.all(fetchDataPromises)
      .then((results) => {
        setData(Object.fromEntries(results));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return { loading, data };
};

const App = () => {
  const { loading, data } = useFetchData();
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="relative bg-gray-900 text-white">
            <Header />
            <HeroSection />
            <div className="container mx-auto px-4 py-6">
              {data.trending_movies && (
                <Row items={data.trending_movies} title="Trending Movies" />
              )}
              {data.trending_tv && (
                <Row items={data.trending_tv} title="Trending TV" />
              )}
              {data.anime && <Row items={data.anime} title="Anime" />}
              {data.popular && <Row items={data.popular} title="Popular" />}
              {data.airing_today && (
                <Row items={data.airing_today} title="Airing Today" />
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default App;

