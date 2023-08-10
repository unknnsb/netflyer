import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import MovieDetails from "./components/MovieDetails";
import WatchMovie from "./components/WatchMovie";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import TvDetails from "./components/TvDetails.jsx";
import WatchTv from "./components/WatchTv.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/movie/:id",
    element: <MovieDetails />,
  },
  {
    path: "/tv/:id",
    element: <TvDetails />,
  },
  {
    path: "/watch/movie/:id",
    element: <WatchMovie />,
  },
  {
    path: "/watch/tv/:id/:episode",
    element: <WatchTv />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
