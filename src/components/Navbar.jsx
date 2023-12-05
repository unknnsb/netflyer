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
} from "@nextui-org/react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useState, useEffect } from "react";
import { FiEye, FiList, FiSearch } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { createToast } from "vercel-toast";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
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
          cancel: "Cancel",
          type: "dark",
        }
      );
    }
  };

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} isBlurred isBordered>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden text-white"
        />
        <NavbarBrand>
          <Link to="/">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-12 w-12 md:h-16 md:w-16 lg:h-20 lg:w-20 object-contain"
            />
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent
        className="hidden text-white sm:flex gap-4"
        justify="center"
      >
        <NavbarItem className="text-white">
          <Button onClick={() => navigate("/search")} variant="flat">
            <FiSearch /> Search
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button variant="flat" onClick={() => navigate("/discover")}>
            <FiEye /> Discover
          </Button>
        </NavbarItem>
        <NavbarItem className="font-bold">
          <Button variant="flat" onClick={handleWatchlist}>
            <FiList /> Watchlist
          </Button>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        {loading ? (
          <NavbarItem>
            <Button color="primary" variant="flat" isLoading>
              Loading
            </Button>
          </NavbarItem>
        ) : user ? (
          <NavbarItem>
            <Button color="primary" variant="flat" onClick={handleSignOut}>
              Sign Out
            </Button>
          </NavbarItem>
        ) : (
          <NavbarItem>
            <Button
              variant="flat"
              onClick={() => navigate("/login")}
              color="primary"
            >
              Login
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>
      <NavbarMenu className="text-white">
        <NavbarMenuItem>
          <Button onClick={() => navigate("/search")} variant="flat">
            <FiSearch /> Search
          </Button>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Button variant="flat" onClick={() => navigate("/discover")}>
            <FiEye /> Discover
          </Button>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Button variant="flat" onClick={handleWatchlist}>
            <FiList /> Watchlist
          </Button>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
};

export default Header;
