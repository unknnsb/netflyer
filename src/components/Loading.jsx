import React from 'react'

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-6">
        <div className="w-8 h-8 bg-white rounded-full animate-bounce" />
        <div className="w-8 h-8 bg-white rounded-full animate-bounce" />
        <div className="w-8 h-8 bg-white rounded-full animate-bounce" />
      </div>
    </div>
  )
}

export default Loading
