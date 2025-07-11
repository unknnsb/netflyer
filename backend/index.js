const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();
const PORT = 3001;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/get-stream', async (req, res) => {
  const { id, type = 'movie' } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Missing TMDB ID parameter' });
  }

  try {
    const embedUrl = `https://vidsrc.xyz/embed/${type}/${id}`;
    const { data } = await axios.get(embedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://vidsrc.xyz/'
      }
    });

    const $ = cheerio.load(data);
    const iframeSrc = $('#player_iframe').attr('src');

    if (!iframeSrc) {
      return res.status(404).json({ error: 'Stream source not found' });
    }

    res.json({
      streamUrl: iframeSrc,
      referer: embedUrl
    });

  } catch (error) {
    console.error('Scraper error:', error.message);
    res.status(500).json({
      error: 'Scraping failed',
      details: error.message
    });
  }
});

app.listen(PORT, () => console.log(`Scraper API running on http://localhost:${PORT}`));
