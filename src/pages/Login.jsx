import { auth } from "../services/Firebase";
import { Spinner } from "@nextui-org/react";
import axios from "axios";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { createToast } from "vercel-toast";
import { BACKEND_URL } from "../services/Api"

const TMDB_API_URL = `${BACKEND_URL}/api/backdrop/movie/27205`;
const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/original";

const useAuthListener = (navigate) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) navigate("/");
      else setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  return loading;
};

const fetchBackdrop = async (setBackdrop) => {
  try {
    const { data } = await axios.get(TMDB_API_URL);
    setBackdrop(`${BACKDROP_BASE_URL}${data.backdrops[8].file_path}`);
  } catch (error) {
    console.error("Error fetching backdrop:", error);
  }
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [backdrop, setBackdrop] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const navigate = useNavigate();
  const loading = useAuthListener(navigate);

  const toggleVisibility = () => setIsVisible((prev) => !prev);

  const validateInputs = () => {
    if (!email || !password) {
      createToast("Please fill in all the fields", {
        type: "error",
        timeout: 3000,
      });
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      createToast("Please enter a valid email", {
        type: "error",
        timeout: 3000,
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    try {
      setLoggedIn(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      setLoggedIn(false);
      const errorMessage = error.message.includes("not-found")
        ? "The user is not found"
        : error.message.includes("wrong-password")
        ? "The password is incorrect"
        : error.message;

      createToast(errorMessage, { type: "error", timeout: 3000 });
    }
  };

  const resetPassword = () => {
    if (!email) {
      createToast("Please enter your email", {
        type: "error",
        timeout: 3000,
      });
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() =>
        createToast("Password reset email sent", {
          type: "info",
          timeout: 3000,
        })
      )
      .catch(() =>
        createToast("Error sending password reset email", {
          type: "error",
          timeout: 3000,
        })
      );
  };

  useEffect(() => {
    fetchBackdrop(setBackdrop);
  }, []);

  return loading ? (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <Spinner color="primary" size="xl" />
    </div>
  ) : (
    <div
      className="relative min-h-screen flex items-center justify-center px-6 p-2"
      style={{
        backgroundImage: `url(${backdrop})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-70" />
      <div className="relative z-10 bg-black bg-opacity-60 backdrop-blur-md p-8 rounded-lg shadow-lg w-full max-w-sm space-y-6">
        <h1 className="text-3xl font-bold text-white text-center">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
              required
            />
          </div>
          <div className="relative">
            <input
              type={isVisible ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
              required
            />
            <button
              type="button"
              onClick={toggleVisibility}
              className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-300 transition duration-200"
            >
              {isVisible ? <FaRegEye /> : <FaRegEyeSlash />}
            </button>
          </div>
          <button
            type="submit"
            className={`w-full py-2 rounded-md text-white font-semibold transition-all duration-300 ${
              loggedIn
                ? "bg-blue-600 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={loggedIn}
          >
            {loggedIn ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="text-center text-sm text-gray-400 space-y-2">
          <p>
            Forgot password?{" "}
            <button
              onClick={resetPassword}
              className="text-blue-400 hover:text-blue-300 underline transition duration-200"
            >
              Reset here
            </button>
          </p>
          <p>
            New here?{" "}
            <Link
              to="/signup"
              className="text-blue-400 hover:text-blue-300 underline transition duration-200"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
