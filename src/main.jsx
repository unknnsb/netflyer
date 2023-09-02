import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Pages
import App from "./App";
import Info from "./pages/Info";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Search from "./pages/Search";
import Settings from "./pages/Settings";
import SignUp from "./pages/SignUp";
import Watch from "./pages/Watch";

import "./styles/index.css";

// Define routes
const routes = [
  { path: "/", element: <App />, errorElement: <NotFound /> },
  { path: "/search", element: <Search /> },
  { path: "/info/:type/:id", element: <Info /> },
  { path: "/watch/:type/:id/:season?/:episode?", element: <Watch /> },
  { path: "/settings", element: <Settings /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/login", element: <Login /> },
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
