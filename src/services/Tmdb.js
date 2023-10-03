export const TMDB_URL = "https://api.themoviedb.org/3";
export const TMDB_API_KEY = "bb2818a2abb39fbdf6da79343e5e376b";

export const endpoints = {
  trending_tv: "/trending/tv/week",
  trending_movies: "/trending/movie/week",
  trending: "/trending/all/week",
  airing_today: "/tv/airing_today?language=en-US&sort_by=popularity.desc",
  popular: "/movie/popular",
  search: "/search/multi",
};
