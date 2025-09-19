import React from "react";

const Loading = () => {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gray-200"></div>
    </div>
  );
};

export default Loading;
