import { auth, db } from "../services/Firebase";
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
import {
  EmailAuthProvider,
  deleteUser,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signOut,
} from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { FiEye, FiList, FiSearch } from "react-icons/fi";
import { MdDelete, MdEmail, MdQuestionMark } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { createToast } from "vercel-toast";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userToDelete, setUserToDelete] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(true);
        setUserToDelete(user);
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

  const handleDelete = async () => {
    alert(
      "The delete functions is still in development. It will be available soon!"
    );

    // if (user) {
    //   const confirm = window.confirm(
    //     "Are you sure you want to delete your account?"
    //   );
    //   if (!confirm) {
    //     return;
    //   } else {
    //     const password = prompt("Please enter your password");
    //     if (!password) {
    //       return;
    //     }
    //     const credential = EmailAuthProvider.credential(
    //       auth.currentUser.email,
    //       password
    //     );
    //     reauthenticateWithCredential(auth.currentUser, credential)
    //       .then(async () => {
    //         const docRef = doc(db, "users", auth.currentUser.uid);
    //         deleteDoc(docRef)
    //           .then(() => {
    //             console.log("User infos successfully deleted!");
    //           })
    //           .catch((error) => {
    //             alert(error.message);
    //           });
    //         const q = query(
    //           collection(db, "watchlist"),
    //           where("userID", "==", auth.currentUser.uid)
    //         );
    //         const querySnapshot = await getDocs(q);
    //         querySnapshot.forEach(async (doc) => {
    //           const docRef = doc(db, "watchlist", doc.id);
    //           await deleteDoc(docRef)
    //             .then(() => {
    //               console.log("Watchlist successfully deleted!");
    //             })
    //             .catch((error) => {
    //               alert(error.message);
    //             });
    //         });
    //         deleteUser(auth.currentUser)
    //           .then(() => {
    //             signOut(auth);
    //             createToast("Successfully deleted your account", {
    //               type: "success",
    //               cancel: "Ok",
    //             });

    //             navigate("/");
    //           })
    //           .catch((error) => {
    //             alert(error.message);
    //           });
    //       })
    //       .catch((error) => {
    //         alert(error.message);
    //       });
    //   }
    // }
  };

  return (
    <Navbar
      className="bg-black/80"
      onMenuOpenChange={setIsMenuOpen}
      isBlurred
      isBordered
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
        <NavbarItem>
          <Button variant="flat" onClick={() => navigate("/about")}>
            <MdQuestionMark /> About
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
          <NavbarItem className="flex gap-1 items-center">
            <Button color="primary" variant="flat" onClick={handleSignOut}>
              Sign Out
            </Button>
            <Button color="primary" variant="flat" onClick={handleDelete}>
              <MdDelete /> Delete
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
        <NavbarMenuItem>
          <Button variant="flat" onClick={() => navigate("/about")}>
            <MdQuestionMark /> About
          </Button>
        </NavbarMenuItem>
        <NavbarMenuItem>
          {loading ? (
            <Button color="primary" variant="flat" isLoading>
              Loading
            </Button>
          ) : user ? (
            <div className="flex gap-1 items-center">
              <Button color="primary" variant="flat" onClick={handleSignOut}>
                Sign Out
              </Button>
              <Button color="primary" variant="flat" onClick={handleDelete}>
                <MdDelete /> Delete
              </Button>
            </div>
          ) : (
            <Button
              variant="flat"
              onClick={() => navigate("/login")}
              color="primary"
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
