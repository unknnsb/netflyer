import {
  originals,
  trending,
  toprated,
  action,
  documentary,
  movieInfo,
} from "./utils";

const API_KEY = "bb2818a2abb39fbdf6da79343e5e376b";
const API_BASE = "https://api.themoviedb.org/3";

const getData = async (endpoint) => {
  return (await fetch(`${API_BASE}${endpoint}`)).json();
};

export default {
  getHomeList: async () => {
    return [
      {
        slug: "originals",
        title: "Originals",
        items: await getData(
          `/discover/tv/?with_network=213&api_key=${API_KEY}`
        ).catch(() => originals),
      },
      {
        slug: "trending",
        title: "Trending",
        items: await getData(`/trending/all/day?api_key=${API_KEY}`).catch(
          () => trending
        ),
      },
      {
        slug: "toprated",
        title: "Top Rating",
        items: await getData(`/movie/top_rated?&api_key=${API_KEY}`).catch(
          () => toprated
        ),
      },
      {
        slug: "toprated",
        title: "Top Rating Tv",
        items: await getData(`/tv/top_rated?&api_key=${API_KEY}`).catch(
          () => toprated
        ),
      },
      {
        slug: "action",
        title: "Actions",
        items: await getData(
          `/discover/movie?with_genres=28&api_key=${API_KEY}`
        ).catch(() => action),
      },
      {
        slug: "documentary",
        title: "Documentaries",
        items: await getData(
          `/discover/movie?with_genres=99&api_key=${API_KEY}`
        ).catch(() => documentary),
      },
    ];
  },

  getMovieInfo: async (movieId, type) => {
    if (type === "tv") {
      return await getData(`/tv/${movieId}?api_key=${API_KEY}`).catch(
        () => movieInfo[movieId]
      );
    }

    return null;
  },
};
