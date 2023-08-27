import React from 'react'
import { FaHome, FaSearch, FaSwatchbook } from 'react-icons/fa'
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
        activeBgColor="red"
        activeTextColor="white"
      />
    </div>
  )
}

export default BottomBar
