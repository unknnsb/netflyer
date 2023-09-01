import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="bg-dark min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-white text-4xl mb-4">The Page Is Not Done Yet</h1>
      <p className="text-white text-lg mb-8">
        Contact <a href="mailto:asnesbeer3@gmail.com" className="underline">asnesbeer3@gmail.com</a> For More Details.
      </p>
      <Link to="/" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
