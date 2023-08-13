import React, { useState, useEffect } from "react";
import "../styles/MovieRow.css"

const MovieRow = ({ title, items }) => {
  const listW = items.results.length * 280;
  const [scrollX, setScrollX] = useState(0);
  const [hideLeftArrow, setHideLeftArrow] = useState(true);
  const [hideRightArrow, setHideRightArrow] = useState(false);

  const handleCalcRightArrow = () => {
    let x = scrollX - Math.round(window.innerWidth / 2);

    if (window.innerWidth - listW > x) {
      x = window.innerWidth - listW - 60;
    }

    return x;
  };

  const handleLeftArrow = () => {
    const x = scrollX + Math.round(window.innerWidth / 2);

    setScrollX(x > 0 ? 0 : x);
  };
  const handleRightArrow = () => {
    setScrollX(handleCalcRightArrow());
  };

  useEffect(() => {
    setHideLeftArrow(scrollX === 0);
    setHideRightArrow(scrollX === window.innerWidth - listW - 60);
  }, [scrollX, listW]);

  const onClick = (id, item) => {
    window.location.href = `/movie/${id}`;
    if (item.released_date) {
      window.location.href = `/movie/${id}`;
    } else if (item.first_air_date) {
      window.location.href = `/tv/${id}`;
    }
  };

  return (
    <div className="mb-8 relative">
      <h2 className="ml-8">{title}</h2>
      <div
        className={`absolute left-0 w-10 h-425 bg-black bg-opacity-60 z-50 flex items-center justify-center overflow-hidden cursor-pointer transition-opacity duration-200 ${
          hideLeftArrow ? "opacity-0" : "opacity-100"
        }`}
        onClick={handleLeftArrow}
      >
        <i className="icon-leftCaret text-2xl" />
      </div>
      <div
        className={`absolute right-0 w-10 h-425 bg-black bg-opacity-60 z-50 flex items-center justify-center overflow-hidden cursor-pointer transition-opacity duration-200 ${
          hideRightArrow ? "opacity-0" : "opacity-100"
        }`}
        onClick={handleRightArrow}
      >
        <i className="icon-rightCaret text-2xl" />
      </div>

      <div className="overflow-hidden pl-8">
        <div
          className="whitespace-nowrap overflow-x-auto overflow-y-hidden inline-block"
          style={{
            marginLeft: `${scrollX}px`,
            width: `${items.results.length * 280}px`,
          }}
        >
          {items.results.length &&
            items.results.map((item, index) => (
              <div key={index} className="inline-block w-72 cursor-pointer">
                <img
                  src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                  alt={item.title}
                  onClick={() => onClick(item.id, item)}
                  className="w-full transform scale-90 transition-transform duration-200 hover:scale-100"
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MovieRow;
