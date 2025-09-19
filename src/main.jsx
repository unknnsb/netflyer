import App from "./App";
import About from "./pages/About";
import ActorInfo from "./pages/ActorInfo";
import Discover from "./pages/Discover";
import InfoPage from "./pages/Info";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import SearchPage from "./pages/Search";
import SignUp from "./pages/SignUp";
import Watch from "./pages/Watch";
import WatchlistPage from "./pages/Watchlist";
// Styles
import "./styles/index.css";
import { HeroUIProvider } from "@heroui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const routes = [
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/actor/:id",
    element: <ActorInfo />,
  },
  {
    path: "/discover",
    element: <Discover />
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
    path: "*",
    element: <NotFound />,
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
  }
];

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.querySelector("#root")).render(
  <React.StrictMode>
    <HeroUIProvider>
      <main className="w-full h-full ">
        <RouterProvider router={router} />
      </main>
    </HeroUIProvider>
  </React.StrictMode>
);
