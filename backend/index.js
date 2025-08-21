const express = require('express');
const axios = require('axios');
require('dotenv').config({
  path: './.env'
})

const app = express();
const PORT = 3001;

const TMDB_URL = "https://api.themoviedb.org/3";
const TMDB_API_KEY = process.env.TMDB_API_KEY;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

const endpoints = {
  trending_tv: "/trending/tv/week",
  trending_movies: "/trending/movie/week",
  trending: "/trending/all/week",
  airing_today: "/tv/airing_today?language=en-US&sort_by=popularity.desc",
  popular: "/movie/popular",
  search: "/search/multi?language=en-US&sort_by=popularity.desc",
  anime: "/discover/tv?with_keywords=210024&sort_by=vote_average.desc",
};

Object.entries(endpoints).forEach(([key, path]) => {
  app.get(`/api/${key}`, async (req, res) => {
    try {
      const response = await fetch(`${TMDB_URL}${path}?api_key=${TMDB_API_KEY}`);
      res.json(await response.json());
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
});

app.get("/api/developer_picks", (req, res) => {
  const picks = {
    movies: [
      { id: 1, title: "The Lighthouse", year: 2019, genre: "Drama/Horror" },
      { id: 2, title: "Whiplash", year: 2014, genre: "Drama/Music" },
      { id: 3, title: "Oldboy", year: 2003, genre: "Thriller" },
    ],
    tv: [
      { id: 1, title: "True Detective (Season 1)", year: 2014, genre: "Crime/Drama" },
      { id: 2, title: "Mr. Robot", year: 2015, genre: "Thriller/Drama" },
      { id: 3, title: "Dark", year: 2017, genre: "Sci-Fi/Mystery" },
    ],
  };

  res.json(picks);
});


app.listen(PORT, () => console.log(`Scraper API running on http://localhost:${PORT}`));
