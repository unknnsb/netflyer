import HeroSection from "./components/Hero";
import Loading from "./components/Loading";
import Row from "./components/MovieRow";
import Header from "./components/Navbar";
import { TMDB_URL, TMDB_API_KEY, endpoints } from "./services/Tmdb";
import axios from "axios";
import { Modal, Button, ModalContent, ModalBody, Chip } from '@nextui-org/react';
import React, { useEffect, useState } from "react";

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
        .get(`${TMDB_URL}${endpoint}`, { params: { api_key: TMDB_API_KEY } })
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
          <Modal className="m-2 " backdrop="opaque" isOpen={isOpen} size="md" placement="center" isDismissable={false} isKeyboardDismissDisabled={true} onClose={handleClose}>
            <ModalContent>
              <ModalBody>
                <p>Things are bit of tough now..
                  <br></br>
                  <br></br>
                  I would appreciate a little donation to help me with the server costs :)
                  <br></br>
                  <br></br>
                  <span>USDT BEP20:</span>
                  <br></br>
                  <b>0xFcBeBc1148a79D8e2e272d1FA84BB66aAaC061850xFcBeBc1148a79D8e2e272d1FA84BB66aAaC06185</b>
                </p>
              </ModalBody>
            </ModalContent>
          </Modal>
          <div className="relative">
            <Header />
            <HeroSection />
            <div>
              {data.trending_movies && (
                <Row items={data.trending_movies} title="Trending Movies" />
              )}
            </div>
            {data.trending_tv && (
              <Row items={data.trending_tv} title="Trending TV" />
            )}
            {data.anime && <Row items={data.anime} title="Anime" />}
            {data.popular && <Row items={data.popular} title="Popular" />}
            {data.airing_today && (
              <Row items={data.airing_today} title="Airing Today" />
            )}
          </div>
        </>
      )}
    </>
  );
};

export default App;
