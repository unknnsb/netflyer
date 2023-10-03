import { auth } from "../services/Firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [scrolling, setScrolling] = useState(false);
  const [user, setUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(true);
        setLoading(false);
      } else {
        setUser(false);
        setLoading(false);
      }
    });
  }, []);

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setScrolling(true);
    } else {
      setScrolling(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
        alert(error.message);
      });
  };

  const handleWatchlist = () => {
    if (user) {
      navigate("/watchlist");
    } else {
      alert("You are not signed in. Please sign in to access your watchlist.");
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 ${
        scrolling ? "bg-black/70" : "bg-transparent"
      } transition-all duration-300 ease-in-out`}
    >
      <div className="container mx-auto px-2 py-1 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-12 w-12 md:h-16 md:w-16 lg:h-20 lg:w-20 object-contain"
            />
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-white">
            <FiSearch />
          </button>
          <button className="text-white" onClick={handleWatchlist}>
            Watchlist
          </button>
          {loading ? (
            <div className="inline-block h-4 w-4 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[0.125em] motion-reduce:animate-spin-[1.5s]">
              <span className="absolute -m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 clip-[rect(0,0,0,0)] text-white">
                Loading...
              </span>
            </div>
          ) : user ? (
            <button className="text-white" onClick={handleSignOut}>
              Sign Out
            </button>
          ) : (
            <button className="text-white" onClick={() => navigate("/login")}>
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
