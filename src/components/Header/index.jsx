import React from "react";
import "./styles.css";

export default ({ black }) => {
  return (
    <header className={black ? "black" : ""}>
      <div className="header--logo">
        <a className="logo" href="/" title="Netflix">
          <i title="Netflix Home" className="icon-logoUpdate" />
        </a>
      </div>
      <div className="header--user">
        <img
          src="https://www.mapheq.co.za/wp-content/uploads/2017/01/Profile-Pic-Demo-1.jpg"
          alt="User"
        />
      </div>
    </header>
  );
};
