import { auth } from "../services/Firebase";
import { Spinner, Input, Button, Card } from "@heroui/react";
import axios from "axios";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { createToast } from "vercel-toast";
import { BACKEND_URL } from "../services/Api";
import { motion } from "framer-motion";

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
    <div className="flex justify-center items-center min-h-screen bg-black text-white">
      <Spinner color="primary" size="lg" />
    </div>
  ) : (
    <div
      className="relative min-h-screen flex items-center justify-center px-6"
      style={{
        backgroundImage: `url(${backdrop})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-sm"
      >
        <Card className="bg-zinc-900/80 border border-zinc-800 p-8 rounded-2xl shadow-xl space-y-6">
          <div className="flex flex-col items-center text-center">
            <LogIn className="text-blue-400 h-10 w-10 mb-3" />
            <h1 className="text-3xl font-bold text-white">Login</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              type="email"
              variant="bordered"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              radius="lg"
              className="text-white"
              isRequired
            />

            <div className="relative">
              <Input
                type={isVisible ? "text" : "password"}
                variant="bordered"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                radius="lg"
                className="text-white"
                isRequired
              />
              <button
                type="button"
                onClick={toggleVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition"
              >
                {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Button
              type="submit"
              color="primary"
              className="w-full rounded-lg font-semibold shadow-md"
              isLoading={loggedIn}
            >
              {loggedIn ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="text-center text-sm text-zinc-400 space-y-2">
            <p>
              Forgot password?{" "}
              <button
                onClick={resetPassword}
                className="text-blue-400 hover:underline"
              >
                Reset here
              </button>
            </p>
            <p>
              New here?{" "}
              <Link
                to="/signup"
                className="text-blue-400 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
