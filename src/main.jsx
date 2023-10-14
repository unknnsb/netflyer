import App from "./App";
import ActorInfoPage from "./pages/ActorInfo";
import InfoPage from "./pages/Info";
import Login from "./pages/Login";
import PasswordPage from "./pages/My";
import SearchPage from "./pages/Search";
import SignUp from "./pages/SignUp";
import Watch from "./pages/Watch";
import "./styles/index.css";
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
    path: "/akshay",
    element: <PasswordPage />,
  },
  {
    path: "/actor/:id",
    element: <ActorInfoPage />,
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
  <>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </>
);
