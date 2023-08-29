import React, { useState } from 'react';

const MovieRow = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleSwipe = (e) => {
    const touchX = e.touches[0].clientX;
    const startX = e.targetTouches[0].clientX;

    if (touchX - startX > 50) {
      prevSlide();
    } else if (startX - touchX > 50) {
      nextSlide();
    }
  };

  return (
    <div className="relative">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute transition-opacity duration-300 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img src={`https://image.tmdb.org/t/p/w500${image.poster_path}`} alt="" />
        </div>
      ))}
      <button
        className="absolute left-0 top-1/2 transform -translate-y-1/2"
        onClick={prevSlide}
      >
        &lt;
      </button>
      <button
        className="absolute right-0 top-1/2 transform -translate-y-1/2"
        onClick={nextSlide}
      >
        &gt;
      </button>
      <div
        className="w-full h-full"
        onTouchStart={handleSwipe}
        onTouchEnd={handleSwipe}
        style={{ touchAction: 'pan-y' }}
      />
    </div>
  );
};

export default MovieRow;
