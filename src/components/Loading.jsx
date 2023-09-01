import React, { useEffect } from 'react';

const Loading = () => {
  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (!isMobile) {
      alert("NOTE: This website is optimized for mobile devices. Please visit on a mobile device for the best experience. If you are already on a mobile device and see this message, please contact us at asnesbeer3@gmail.com.");
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-6">
        <div className="w-8 h-8 bg-white rounded-full animate-bounce" />
        <div className="w-8 h-8 bg-white rounded-full animate-bounce" />
        <div className="w-8 h-8 bg-white rounded-full animate-bounce" />
      </div>
    </div>
  );
}

export default Loading;

