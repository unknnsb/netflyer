import React from 'react'
import { FaHome, FaSearch, FaSwatchbook } from 'react-icons/fa'
import { MdMonitor, MdMovie } from "react-icons/md"
import { BottomNavigation } from 'reactjs-bottom-navigation'

const BottomBar = () => {
  const bottomNavItems = [
    {
      title: 'Home',
      onClick: ({ id }) => (window.location.href = '/'),
      icon: <FaHome />,
      activeIcon: <FaHome color="#fff" />,
    },
    {
      title: 'Movies',
      onClick: ({ id }) => (window.location.href = '/movies'),
      icon: <MdMovie />,
      activeIcon: <MdMovie color="#fff" />,
    },
    {
      title: 'Tv Shows',
      onClick: ({ id }) => (window.location.href = '/series'),
      icon: <MdMonitor />,
      activeIcon: <MdMonitor color="#fff" />,
    },
    {
      title: 'Search',
      onClick: ({ id }) => (window.location.href = '/search'),
      icon: <FaSearch />,
      activeIcon: <FaSearch color="#fff" />,
    },
    {
      title: 'Watchlist',
      onClick: ({ id }) => (window.location.href = '/list'),
      icon: <FaSwatchbook />,
      activeIcon: <FaSwatchbook color="#fff" />,
    },
  ]
  return (
    <div>
      <BottomNavigation
        items={bottomNavItems}
        selected={0}
        activeBgColor="#202020"
        activeTextColor="white"
      />
    </div>
  )
}

export default BottomBar
