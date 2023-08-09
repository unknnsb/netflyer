import React from "react";
import "./styles.css";

export default ({ black }) => {
  return (
    <header className={black ? "black" : ""}>
      <div className="header--logo">
        <a className="logo" href="/" title="Netflyer">
          <img src="/logo.png" className="icon-logoUpdate"/>
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
