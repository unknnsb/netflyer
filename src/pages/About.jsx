import Header from "../components/Navbar";
import { TMDB_API_KEY } from "../services/Tmdb";
import { Chip, Button, Image } from "@nextui-org/react";
import React, { useEffect, useState } from "react";

const About = () => {
  const [developerPicks, setDeveloperPicks] = useState([]);

  useEffect(() => {
    const fetchDeveloperPicks = async () => {
      const picks = [
        { title: "Interstellar", type: "movie", id: 157336 },
        { title: "Breaking Bad", type: "tv", id: 1396 },
        { title: "Dark", type: "tv", id: 70523 },
        { title: "Lost", type: "tv", id: 4607 },
      ];

      const promises = picks.map(async (pick) => {
        const response = await fetch(
          `https://api.themoviedb.org/3/${pick.type}/${pick.id}?api_key=${TMDB_API_KEY}&language=en-US`
        );
        const data = await response.json();
        return {
          title: pick.title,
          type: pick.type,
          id: pick.id,
          posterPath: data.poster_path,
        };
      });

      const results = await Promise.all(promises);
      setDeveloperPicks(results);
    };

    fetchDeveloperPicks();
  }, []);

  return (
    <>
      <Header />
      <div className="container mx-auto mt-8 p-8">
        <section className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">About Netflyer</h1>
          <p className="text-lg text-gray-200">
            Netflyer is a streaming app that allows you to watch your favorite
            movies and TV shows without leaving your browser.
          </p>
        </section>

        <section className="text-center mb-8">
          <h2 className="text-2xl font-bold mt-4">About Me</h2>
          <p className="text-lg text-gray-200">
            Hey there! I'm Nesbeer, also known as ItzNesbro. I built this
            streaming app with passion and dedication, and it's currently
            ad-free. In the future, I might consider adding ads to support its
            development.
          </p>

          <p className="text-lg text-gray-200 mt-4">
            Apart from being a front-end developer, I'm a YouTuber and a Discord
            bot coder. Expect regular updates and improvements to make your
            streaming experience even better!
          </p>
        </section>

        <section className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4 mt-4">Developer Picks</h2>
          <p className="text-lg text-gray-200">
            Check out some of the best movies and TV shows recommended by{" "}
            <span className="font-bold text-blue-500">
              <a
                href="https://github.com/itznesbrodev"
                target="_blank"
                rel="noopener noreferrer"
              >
                ItzNesbro
              </a>
            </span>
          </p>

          <div className="flex flex-wrap gap-2 justify-center">
            {developerPicks.map((pick) => (
              <Image
                isZoomed
                key={pick.id}
                src={`https://image.tmdb.org/t/p/w300${pick.posterPath}`}
                alt={pick.title}
                width={"96px"}
                height={"144px"}
                radius="md"
                className="object-cover m-2 cursor-pointer"
                onClick={() => {
                  window.location.href = `info/${pick.type}/${pick.id}`;
                }}
              />
            ))}
          </div>
        </section>

        <Button
          color="primary"
          className="mx-auto block mt-8"
          onClick={() => (window.location.href = "mailto:itznesbro@proton.me")}
        >
          Contact Me
        </Button>
      </div>
    </>
  );
};

export default About;
