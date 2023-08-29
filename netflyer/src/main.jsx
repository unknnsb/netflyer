import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
// import MovieDetails from './pages/MovieDetails'
// import SearchPage from './pages/Search'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
// import TvDetails from './pages/TvDetails'
// import WatchList from './pages/WatchList'
// import WatchMovie from './pages/WatchMovie'
// import WatchTv from './pages/WatchTv'
import './styles/index.css'

// Define routes
const routes = [
  { path: '/', element: <App /> },
  // { path: '/movie/:id', element: <MovieDetails /> },
  // { path: '/tv/:id', element: <TvDetails /> },
  // { path: '/watch/movie/:id', element: <WatchMovie /> },
  // { path: '/watch/tv/:id/:season/:episode', element: <WatchTv /> },
  // { path: '/list', element: <WatchList /> },
  // { path: '/search', element: <SearchPage /> },
  { path: '/signup', element: <SignUp /> },
  { path: '/login', element: <Login /> },
]

const router = createBrowserRouter(routes)

// Render the app
ReactDOM.createRoot(document.querySelector('#root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
