import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import Info from './pages/Info'
// import TvDetails from './pages/TvDetails'
// import WatchList from './pages/WatchList'
// import WatchMovie from './pages/WatchMovie'
// import WatchTv from './pages/WatchTv'
import './styles/index.css'
import Search from './pages/Search'
import Watch from './pages/Watch'

// Define routes
const routes = [
  { path: '/', element: <App /> },
  { path: '/search', element: <Search /> },
  { path: '/info/:type/:id', element: <Info /> },
  { path: '/watch/:type/:id/:season?/:episode?', element: <Watch /> },
  // { path: '/movie/:id', element: <MovieDetails /> },
  // { path: '/tv/:id', element: <TvDetails /> },
  // { path: '/watch/movie/:id', element: <WatchMovie /> },
  // { path: '/watch/tv/:id/:season/:episode', element: <WatchTv /> },
  // { path: '/list', element: <WatchList /> },
  { path: '/signup', element: <SignUp /> },
  { path: '/login', element: <Login /> },
]

const router = createBrowserRouter(routes)

// Render the app
ReactDOM.createRoot(document.querySelector('#root')).render(
  <>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </>
)
