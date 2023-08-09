import React, { useState, useEffect } from "react";

import "./styles.css";

export default ({ title, items }) => {
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

  const onClick = (movie_id) => {
    // window.location.href =
    //   "https://multiembed.mov/directstream.php?video_id=" +
    //   movie_id +
    //   "&tmdb=1";
    window.location.href = `/movie/${movie_id}`;
  };

  return (
    <div className="movieRow">
      <h2>{title}</h2>
      <div
        className={`movieRow--left indicator-icon ${
          hideLeftArrow ? "hide" : ""
        }`}
        onClick={handleLeftArrow}
      >
        <i className="icon-leftCaret" />
      </div>
      <div
        className={`movieRow--right indicator-icon ${
          hideRightArrow ? "hide" : ""
        }`}
        onClick={handleRightArrow}
      >
        <i className="icon-rightCaret" />
      </div>

      <div className="movieRow--listarea">
        <div
          className="movieRow--list"
          style={{
            marginLeft: scrollX,
            width: items.results.length * 280,
          }}
        >
          {items.results.length &&
            items.results.map((item, index) => (
              <div key={index} className="movieRow--item">
                <img
                  src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                  alt={item.title}
                  onClick={() => onClick(item.id)}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
