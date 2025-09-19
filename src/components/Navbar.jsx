import { auth } from "../services/Firebase";
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useState, useEffect } from "react";
import { FiEye, FiList, FiSearch } from "react-icons/fi";
import { MdQuestionMark } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { createToast } from "vercel-toast";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(!!user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        createToast(error.message, { type: "error", timeout: 3000 });
      });
  };

  const handleWatchlist = () => {
    if (user) {
      navigate("/watchlist");
    } else {
      createToast(
        "You are not signed in. Please sign in to access your watchlist.",
        {
          action: {
            text: "Login",
            callback(toast) {
              navigate("/login");
              toast.destroy();
            },
          },
          timeout: 3000,
          cancel: "Cancel",
          type: "dark",
        }
      );
    }
  };

  return (
    <Navbar
      className="bg-black/80 backdrop-blur-lg shadow-lg"
      isBlurred
      isBordered
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden text-white"
        />
        <NavbarBrand>
          <Link to="/">
            <img
              src="/logo.png"
              alt="Netflyer Logo"
              className="h-12 w-12 md:h-16 md:w-16 lg:h-20 lg:w-20 object-contain rounded-lg"
            />
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex gap-6 text-white"
        justify="center"
      >
        <NavbarItem>
          <Button onClick={() => navigate("/search")} variant="flat" size="md" className="flex items-center gap-2 text-white">
            <FiSearch className="text-lg" /> Search
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button onClick={() => navigate("/discover")} variant="flat" size="md" className="flex items-center gap-2 text-white">
            <FiEye className="text-lg" /> Discover
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button onClick={handleWatchlist} variant="flat" size="md" className="flex items-center gap-2 font-bold text-white">
            <FiList className="text-lg" /> Watchlist
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button onClick={() => navigate("/about")} variant="flat" size="md" className="flex items-center gap-2 text-white">
            <MdQuestionMark className="text-lg" /> About
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end" className="text-white">
        {loading ? (
          <NavbarItem>
            <Button color="primary" variant="flat" isLoading>
              Loading
            </Button>
          </NavbarItem>
        ) : user ? (
          <NavbarItem className="flex items-center gap-2">
            <Button color="primary" variant="flat" onClick={handleSignOut}>
              Sign Out
            </Button>
          </NavbarItem>
        ) : (
          <NavbarItem>
            <Button
              variant="flat"
              color="primary"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarMenu className="text-white bg-black/90">
        <NavbarMenuItem>
          <Button
            onClick={() => {
              setIsMenuOpen(false);
              navigate("/search");
            }}
            variant="flat"
            className="w-full justify-start text-white"
          >
            <FiSearch className="mr-2" /> Search
          </Button>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Button
            onClick={() => {
              setIsMenuOpen(false);
              navigate("/discover");
            }}
            variant="flat"
            className="w-full justify-start text-white"
          >
            <FiEye className="mr-2" /> Discover
          </Button>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Button
            onClick={() => {
              setIsMenuOpen(false);
              handleWatchlist();
            }}
            variant="flat"
            className="w-full justify-start text-white"
          >
            <FiList className="mr-2" /> Watchlist
          </Button>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Button
            onClick={() => {
              setIsMenuOpen(false);
              navigate("/about");
            }}
            variant="flat"
            className="w-full justify-start text-white"
          >
            <MdQuestionMark className="mr-2" /> About
          </Button>
        </NavbarMenuItem>
        <NavbarMenuItem>
          {loading ? (
            <Button color="primary" variant="flat" isLoading className="w-full">
              Loading
            </Button>
          ) : user ? (
            <div className="flex items-center gap-2">
              <Button
                color="primary"
                variant="flat"
                className="w-full"
                onClick={() => {
                  setIsMenuOpen(false);
                  handleSignOut();
                }}
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <Button
              variant="flat"
              color="primary"
              className="w-full"
              onClick={() => {
                setIsMenuOpen(false);
                navigate("/login");
              }}
            >
              Login
            </Button>
          )}
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
};

export default Header;
