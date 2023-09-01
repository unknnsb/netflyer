import React from 'react'
import { FaHome, FaSearch, FaSwatchbook } from 'react-icons/fa'
import { MdMonitor, MdMovie, MdSettings } from "react-icons/md"
import { BottomNavigation } from 'reactjs-bottom-navigation'

const BottomBar = ({ selected }) => {
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
      title: 'Settings',
      onClick: ({ id }) => (window.location.href = '/settings'),
      icon: <MdSettings />,
      activeIcon: <MdSettings color="#fff" />,
    },
  ]
  return (
    <div>
      <BottomNavigation
        items={bottomNavItems}
        selected={selected}
        activeBgColor="#202020"
        activeTextColor="white"
      />
    </div>
  )
}

export default BottomBar
