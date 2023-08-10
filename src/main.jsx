import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import MovieDetails from "./components/MovieDetails";
import WatchMovie from "./components/WatchMovie";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import TvDetails from "./components/TvDetails.jsx";
import WatchTv from "./components/WatchTv.jsx";
import { ClerkProvider, SignIn, SignUp } from "@clerk/clerk-react";

if (!import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}
const clerkPubKey = import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY;

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
  {
    path: "/sign-in",
    element: <SignIn routing="path" path="/sign-in" />,
  },
  {
    path: "/sign-up",
    element: <SignUp routing="path" path="/sign-up" />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <RouterProvider router={router} />
    </ClerkProvider>
  </React.StrictMode>
);
