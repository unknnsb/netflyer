const express = require('express');
const axios = require('axios');
const cors = require("cors")
require('dotenv').config({
  path: './.env'
})

const app = express();
const PORT = 3001;

app.use(cors())

const TMDB_URL = "https://api.themoviedb.org/3";
const TMDB_API_KEY = process.env.TMDB_API_KEY;

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
    const {
      type = 'all',
      genre,
      year,
      rating_min,
      rating_max,
      sort_by = 'popularity.desc',
      page = 1
    } = req.query;

    const baseParams = `api_key=${TMDB_API_KEY}&language=en-US&page=${page}&sort_by=${sort_by}`;
    let url;

    if (type === 'movie') {
      url = `${TMDB_URL}/discover/movie?${baseParams}`;
      if (genre) url += `&with_genres=${genre}`;
      if (year) url += `&year=${year}`;
      if (rating_min) url += `&vote_average.gte=${rating_min}`;
      if (rating_max) url += `&vote_average.lte=${rating_max}`;
    } else if (type === 'tv') {
      url = `${TMDB_URL}/discover/tv?${baseParams}`;
      if (genre) url += `&with_genres=${genre}`;
      if (year) url += `&first_air_date_year=${year}`;
      if (rating_min) url += `&vote_average.gte=${rating_min}`;
      if (rating_max) url += `&vote_average.lte=${rating_max}`;
    } else {
      const [moviesRes, tvRes] = await Promise.all([
        fetch(`${TMDB_URL}/discover/movie?${baseParams}`),
        fetch(`${TMDB_URL}/discover/tv?${baseParams}`)
      ]);
      const [movies, tv] = await Promise.all([
        moviesRes.json(),
        tvRes.json()
      ]);

      const combined = [...movies.results, ...tv.results]
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 20);

      return res.json({
        results: combined,
        total_pages: Math.max(movies.total_pages, tv.total_pages),
        total_results: movies.total_results + tv.total_results
      });
    }

    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/genres", async (req, res) => {
  try {
    const [movieGenresRes, tvGenresRes] = await Promise.all([
      fetch(`${TMDB_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`),
      fetch(`${TMDB_URL}/genre/tv/list?api_key=${TMDB_API_KEY}&language=en-US`)
    ]);

    const [movieGenres, tvGenres] = await Promise.all([
      movieGenresRes.json(),
      tvGenresRes.json()
    ]);

    res.json({
      movie: movieGenres.genres,
      tv: tvGenres.genres
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

app.get("/api/info/:type/:id/credits", async (req, res) => {
  try {
    const response = await fetch(
      `${TMDB_URL}/${req.params.type}/${req.params.id}/credits?api_key=${TMDB_API_KEY}&language=en-US`
    );
    res.json(await response.json());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/info/:type/:id/similar', async (req, res) => {
  try {
    const response = await fetch(
      `${TMDB_URL}/${req.params.type}/${req.params.id}/similar?api_key=${TMDB_API_KEY}&language=en-US`
    );
    res.json(await response.json());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/info/:type/:id/recommendations', async (req, res) => {
  try {
    const response = await fetch(
      `${TMDB_URL}/${req.params.type}/${req.params.id}/recommendations?api_key=${TMDB_API_KEY}&language=en-US`
    );
    res.json(await response.json());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/info/:type/:id/season/:season', async (req, res) => {
  try {
    const response = await fetch(
      `${TMDB_URL}/${req.params.type}/${req.params.id}/season/${req.params.season}?api_key=${TMDB_API_KEY}&language=en-US`
    );
    res.json(await response.json());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/info/:type/:id/season/:season/episode/:episode', async (req, res) => {
  try {
    const response = await fetch(
      `${TMDB_URL}/${req.params.type}/${req.params.id}/season/${req.params.season}/episode/${req.params.episode}?api_key=${TMDB_API_KEY}&language=en-US`
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

app.get("/api/person/:id", async (req, res) => {
  try {
    const response = await fetch(
      `${TMDB_URL}/person/${req.params.id}?api_key=${TMDB_API_KEY}&language=en-US`
    );
    res.json(await response.json());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/person/:id/credits", async (req, res) => {
  try {
    const response = await fetch(
      `${TMDB_URL}/person/${req.params.id}/combined_credits?api_key=${TMDB_API_KEY}&language=en-US`
    );
    res.json(await response.json());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// STREAMING

async function tmdbToImdbId(type, tmdbId) {
  const url =
    type === "movie"
      ? `${TMDB_URL}/movie/${tmdbId}?append_to_response=external_ids&api_key=${TMDB_API_KEY}`
      : `${TMDB_URL}/tv/${tmdbId}?append_to_response=external_ids&api_key=${TMDB_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB lookup failed`);
  const json = await res.json();
  return json?.external_ids?.imdb_id || null;
}

function buildEmbedUrl({ provider, type, id, season, episode }) {
  switch (provider) {
    case "vidsrc-icu":
      if (type === "movie") return `https://vidsrc.icu/embed/movie/${id}`;
      return `https://vidsrc.icu/embed/tv/${id}/${season}/${episode}`;
    case "vidsrc-pk":
      if (type === "movie") return `https://embed.vidsrc.pk/movie/${id}`;
      return `https://embed.vidsrc.pk/tv/${id}/${season}-${episode}`;
    default:
      if (type === "movie") return `https://vidsrc.icu/embed/movie/${id}`;
      return `https://vidsrc.icu/embed/tv/${id}/${season}/${episode}`;
  }
}

// GET /embed/movie/:tmdbId?provider=vidsrc-icu&prefer=tmdb|imdb
app.get("/api/embed/movie/:tmdbId", async (req, res) => {
  try {
    const tmdbId = req.params.tmdbId;
    const provider = req.query.provider || "vidsrc-icu";
    const prefer = req.query.prefer || "tmdb"; // some providers support both
    let idForProvider = tmdbId;

    if (prefer === "imdb") {
      const imdb = await tmdbToImdbId("movie", tmdbId);
      if (imdb) idForProvider = imdb;
    }

    const url = buildEmbedUrl({
      provider,
      type: "movie",
      id: idForProvider,
    });

    res.json({ provider, type: "movie", tmdbId, idUsed: idForProvider, url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /embed/tv/:tmdbId?s=1&e=2&provider=vidsrc-icu&prefer=tmdb|imdb
app.get("/api/embed/tv/:tmdbId", async (req, res) => {
  try {
    const tmdbId = req.params.tmdbId;
    const season = Number(req.query.s);
    const episode = Number(req.query.e);
    if (!season || !episode) {
      return res.status(400).json({ error: "Missing season or episode" });
    }
    const provider = req.query.provider || "vidsrc-icu";
    const prefer = req.query.prefer || "tmdb";

    let idForProvider = tmdbId;
    if (prefer === "imdb") {
      const imdb = await tmdbToImdbId("tv", tmdbId);
      if (imdb) idForProvider = imdb;
    }

    const url = buildEmbedUrl({
      provider,
      type: "tv",
      id: idForProvider,
      season,
      episode,
    });

    res.json({
      provider,
      type: "tv",
      tmdbId,
      season,
      episode,
      idUsed: idForProvider,
      url,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => console.log(`Scraper API running on http://localhost:${PORT}`));
