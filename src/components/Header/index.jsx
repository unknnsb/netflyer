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
          src="/logo.png"
          alt="User"
        />
      </div>
    </header>
  );
};
