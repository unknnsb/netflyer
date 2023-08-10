import React, { useEffect, useState } from "react";
import "./styles/Header.css";

const Header = () => {
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(() => {
    const scrollListener = () => {
      setBlackHeader(window.scrollY > 15);
    };

    window.addEventListener("scroll", scrollListener);

    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  }, []);
  return (
    <header className={blackHeader ? "black" : ""}>
      <div className="header--logo">
        <a className="logo" href="/" title="Netflyer">
          <img src="/logo.png" className="icon-logoUpdate" />
        </a>
      </div>
      <div className="header--user">
        <img
          src="https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png"
          alt="User"
        />
      </div>
    </header>
  );
};

export default Header;
