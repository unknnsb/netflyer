import Loading from "../components/Loading";
import { auth } from "../services/Firebase";
import { Button, Input, Spinner } from "@nextui-org/react";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { createToast } from "vercel-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = React.useState(false);
  const [LoggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isEmail = /\S+@\S+\.\S+/.test(email);

    try {
      if (!email || !password) {
        return createToast("Please fill in all the fields", {
          cancel: "Cancel",
          type: "error",
        });
      } else {
        if (!isEmail) {
          return createToast("Please enter a valid email", {
            cancel: "Cancel",
            type: "error",
          });
        } else {
          setLoggedIn(true);
          await signInWithEmailAndPassword(auth, email, password);
        }
      }
    } catch (error) {
      if (error.message.includes("not-found")) {
        return createToast("The user is not found", {
          action: {
            text: "Sign UP",
            callback(toast) {
              navigate("/signup");
              toast.destroy();
            },
          },
          cancel: "Cancel",
          type: "dark",
        });
      } else if (error.message.includes("wrong-password")) {
        return createToast("The password is incorrect", {
          cancel: "Cancel",
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

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#202020]">
          <div className="p-4">
            <h1 className="text-white text-4xl font-bold mb-6 mt-2">Login</h1>
            <Input
              isRequired
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="max-w-xs text-white mb-2"
              label="Email"
            />
            <Input
              isRequired
              type={isVisible ? "text" : "password"}
              placeholder="enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="max-w-xs text-white mb-2"
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
                variant="flat"
                color="primary"
                className="w-full"
              >
                <Spinner />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="w-full text-white"
                variant="flat"
                color="primary"
              >
                Login
              </Button>
            )}
          </div>
          <p className="text-white mt-4">
            Don't Have An Account?{" "}
            <Link to="/signup" className="text-blue-500 underline">
              Sign Up
            </Link>
            <span className="text-white"> | </span>
            <Link to="/forgot-password" className="text-blue-500 underline">
              Forgot Password
            </Link>
          </p>
        </div>
      )}
    </>
  );
};

export default Login;
