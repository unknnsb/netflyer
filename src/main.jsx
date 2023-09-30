import App from "./App";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
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
