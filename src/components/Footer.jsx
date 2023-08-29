import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black py-4 text-center text-gray-400 text-sm">
      &copy; {new Date().getFullYear()} Netflix, Inc.
    </footer>
  );
}

export default Footer;

