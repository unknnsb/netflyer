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

app.get("/api/developer_picks", async (req, res) => {
  try {
    const picks = [
      { id: 503919, type: "movie" },
      { id: 244786, type: "movie" },
      { id: 670, type: "movie" },
      { id: 46648, type: "tv" },
      { id: 62560, type: "tv" }
    ];

    const results = await Promise.all(
      picks.map(async (pick) => {
        const url = `${TMDB_URL}/${pick.type}/${pick.id}?api_key=${TMDB_API_KEY}&language=en-US`;
        const res = await fetch(url);
        return res.json();
      })
    );

    res.json({ picks: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/discover", async (req, res) => {
  try {
    const [popularMoviesRes, topRatedTVRes, trendingRes] = await Promise.all([
      fetch(`${TMDB_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US`),
      fetch(`${TMDB_URL}/tv/top_rated?api_key=${TMDB_API_KEY}&language=en-US`),
      fetch(`${TMDB_URL}/trending/all/day?api_key=${TMDB_API_KEY}`),
    ]);

    const [popularMovies, topRatedTV, trending] = await Promise.all([
      popularMoviesRes.json(),
      topRatedTVRes.json(),
      trendingRes.json(),
    ]);

    res.json({
      popularMovies,
      topRatedTV,
      trending,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/search/:query", async (req, res) => {
  try {
    const response = await fetch(
      `${TMDB_URL}/search/multi?api_key=${TMDB_API_KEY}&language=en-US&query=${req.params.query}&page=1&include_adult=false`
    );
    res.json(await response.json());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/info/:type/:id", async (req, res) => {
  try {
    const response = await fetch(
      `${TMDB_URL}/${req.params.type}/${req.params.id}?api_key=${TMDB_API_KEY}&language=en-US`
    );
    res.json(await response.json());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/weekly_trending", async (req, res) => {
  try {
    const response = await fetch(
      `${TMDB_URL}/trending/all/week?api_key=${TMDB_API_KEY}&language=en-US`
    );
    res.json(await response.json());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/backdrop/:type/:id", async (req, res) => {
  try {
    const response = await fetch(
      `${TMDB_URL}/${req.params.type}/${req.params.id}/images?api_key=${TMDB_API_KEY}`
    );
    res.json(await response.json());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Scraper API running on http://localhost:${PORT}`));
