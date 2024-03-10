import Loading from "../components/Loading";
import { auth } from "../services/Firebase";
import { Button, Input, Spinner } from "@nextui-org/react";
import axios from "axios";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { createToast } from "vercel-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = React.useState(false);
  const [LoggedIn, setLoggedIn] = useState(false);
  const [backdrop, setBackdrop] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isEmail = /\S+@\S+\.\S+/.test(email);

    try {
      if (!email || !password) {
        return createToast("Please fill in all the fields", {
          cancel: "Cancel",
          timeout: 3000,
          type: "error",
        });
      } else {
        if (!isEmail) {
          return createToast("Please enter a valid email", {
            cancel: "Cancel",
            timeout: 3000,
            type: "error",
          });
        } else {
          setLoggedIn(true);
          await signInWithEmailAndPassword(auth, email, password);
        }
      }
    } catch (error) {
      if (error.message.includes("not-found")) {
        setLoggedIn(false);
        return createToast("The user is not found", {
          action: {
            text: "Sign UP",
            callback(toast) {
              navigate("/signup");
              toast.destroy();
            },
          },
          timeout: 3000,
          cancel: "Cancel",
          type: "dark",
        });
      } else if (error.message.includes("wrong-password")) {
        setLoggedIn(false);
        return createToast("The password is incorrect", {
          cancel: "Cancel",
          timeout: 3000,
          type: "error",
        });
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/");
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    axios
      .get(
        `https://api.themoviedb.org/3/movie/27205/images?api_key=bb2818a2abb39fbdf6da79343e5e376b`
      )
      .then((res) => {
        setBackdrop(
          "https://image.tmdb.org/t/p/original" +
            res.data.backdrops[5].file_path
        );
      });

    const params = new URLSearchParams(location.search);
    const email = params.get("email");
    if (email) {
      setEmail(email);
    }
  }, []);

  const resetPassword = () => {
    if (email) {
      sendPasswordResetEmail(auth, email, {
        url: `${import.meta.env.VITE_WEBSITE_URL}/login?email=${email}`,
      })
        .then(() => {
          return createToast("We have sent you an email", {
            cancel: "Cancel",
            type: "info",
          });
        })
        .catch((error) => {
          return createToast(error.message, {
            cancel: "Cancel",
            type: "error",
          });
        });
    } else {
      return createToast("Please enter your email", {
        cancel: "Cancel",
        timeout: 3000,
        type: "error",
      });
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div
          style={{
            position: "relative",
            backgroundImage: `url(${backdrop})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className={`flex flex-col items-center justify-center min-h-screen`}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage:
                "linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%)",
            }}
          ></div>

          <div className="relative z-10 w-full max-w-md flex flex-col items-center">
            <h1 className="text-white text-4xl font-bold mb-6 mt-2">Login</h1>
            <form className="w-full">
              <Input
                isRequired
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded text-white mb-2"
                label="Email"
              />
              <Input
                isRequired
                type={isVisible ? "text" : "password"}
                placeholder="enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded text-white mb-2"
                label="Password"
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                  >
                    {isVisible ? (
                      <FaRegEye className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <FaRegEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
              />

              {LoggedIn ? (
                <Button
                  disabled
                  variant="outlined"
                  color="primary"
                  className="ml-4 w-[95%]"
                >
                  <Spinner />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="w-[95%] ml-4 text-white"
                  color="primary"
                >
                  Login
                </Button>
              )}
            </form>
            <p className="text-white mt-4">
              Don't Have An Account?{" "}
              <Link to="/signup" className="text-blue-500 underline">
                Sign Up
              </Link>
              <span className="text-white"> | </span>
              <Button
                onClick={resetPassword}
                className="bg-transparent text-blue-500 underline"
              >
                Forgot Password
              </Button>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
