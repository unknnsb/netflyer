import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import MovieDetails from "./components/MovieDetails";
import WatchMovie from "./components/WatchMovie";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

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
    path: "/watch/:id",
    element: <WatchMovie />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
