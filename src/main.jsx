import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ClerkProvider, SignIn, SignUp } from "@clerk/clerk-react";

import App from "./App.jsx";
import MovieDetails from "./pages/MovieDetails";
import TvDetails from "./pages/TvDetails.jsx";
import WatchMovie from "./pages/WatchMovie";
import WatchTv from "./pages/WatchTv.jsx";
import WatchListAdd from "./pages/WatchListAdd.jsx";
import WatchList from "./pages/WatchList.jsx";

// Ensure that the Publishable Key is available
const clerkPubKey = import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY;
if (!clerkPubKey) {
  throw new Error("Missing Publishable Key");
}

// Define routes
const routes = [
  { path: "/", element: <App /> },
  { path: "/movie/:id", element: <MovieDetails /> },
  { path: "/tv/:id", element: <TvDetails /> },
  { path: "/watch/movie/:id", element: <WatchMovie /> },
  { path: "/watch/tv/:id/:season/:episode", element: <WatchTv /> },
  { path: "/list/add/:id", element: <WatchListAdd /> },
  { path: "/list", element: <WatchList /> },
  { path: "/sign-in", element: <SignIn routing="path" path="/sign-in" /> },
  { path: "/sign-up", element: <SignUp routing="path" path="/sign-up" /> },
];

const router = createBrowserRouter(routes);

// Render the app
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <RouterProvider router={router} />
    </ClerkProvider>
  </React.StrictMode>
);
