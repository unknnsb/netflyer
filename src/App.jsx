import { RedirectToSignIn, useUser } from '@clerk/clerk-react'
import React, { useEffect, useState } from 'react'
import FeaturedMovie from './components/FeaturedMovie'
import Header from './components/Header'
import Loading from './components/Loading'
import MovieRow from './components/MovieRow'
import Tmdb from './services/Tmdb'
import './styles/App.css'

export default function App() {
  const [movieList, setMovieList] = useState([])
  const [featuredData, setFeaturedData] = useState(null)
  const { isLoaded, isSignedIn } = useUser()

  useEffect(() => {
    const loadAll = async () => {
      const list = await Tmdb.getHomeList()
      setMovieList(list)

      const originals = list.filter(({ slug }) => slug === 'originals')
      const randonChosen = Math.floor(
        Math.random() * (originals[0].items.results.length - 1)
      )
      const chosen = originals[0].items.results[randonChosen]
      const chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv')
      setFeaturedData(chosenInfo)
    }

    loadAll()
  }, [])

  if (movieList.length <= 0 || !isLoaded) {
    return <Loading />
  }

  if (!isLoaded || !isSignedIn) {
    return <RedirectToSignIn />
  }

  return (
    <div className="page">
      <Header changeOnScroll={true} />

      {featuredData && <FeaturedMovie item={featuredData} />}

      <section className="mt-[-180px]">
        {movieList.map((item) => (
          <MovieRow key={item.title} title={item.title} items={item.items} />
        ))}
      </section>
      <footer className="mt-10 text-center text-gray-400 text-sm">
        Copyright © 2023 Netflyer
      </footer>
    </div>
  )
}
