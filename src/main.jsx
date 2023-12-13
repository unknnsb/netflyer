// Imports
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";
// Pages
import App from "./App";
import ActorInfoPage from "./pages/ActorInfo";
import InfoPage from "./pages/Info";
import Login from "./pages/Login";
import SearchPage from "./pages/Search";
import SignUp from "./pages/SignUp";
import Watch from "./pages/Watch";
import WatchlistPage from "./pages/Watchlist";
// Styles
import "./styles/index.css";

const routes = [
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/actor/:id",
    element: <ActorInfoPage />,
  },
  {
    path: "/info/:type/:id",
    element: <InfoPage />,
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
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/watch/:type/:id/:season?/:episode?",
    element: <Watch />,
  },
  {
    path: "/watchlist",
    element: <WatchlistPage />,
  },
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
