import App from "./App";
import ActorInfoPage from "./pages/ActorInfo";
import InfoPage from "./pages/Info";
import Login from "./pages/Login";
import SearchPage from "./pages/Search";
import SignUp from "./pages/SignUp";
import Watch from "./pages/Watch";
import WatchlistPage from "./pages/Watchlist";
import "./styles/index.css";
import { NextUIProvider } from "@nextui-org/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const routes = [
  { path: "/", element: <App /> },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/search",
    element: <SearchPage />,
  },
  {
    path: "/actor/:id",
    element: <ActorInfoPage />,
  },
  {
    path: "/watchlist",
    element: <WatchlistPage />,
  },
  {
    path: "/info/:type/:id",
    element: <InfoPage />,
  },
  { path: "/watch/:type/:id/:season?/:episode?", element: <Watch /> },
];

const router = createBrowserRouter(routes);

// Render the app
ReactDOM.createRoot(document.querySelector("#root")).render(
  <React.StrictMode>
    <NextUIProvider>
    <main className="w-full h-full bg-[#202020">
        <RouterProvider router={router} />
      </main>
    </NextUIProvider>
  </React.StrictMode>
);
