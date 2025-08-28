import Loading from "../components/Loading";
import { auth, db } from "../services/Firebase";
import { Button, Input } from "@nextui-org/react";
import axios from "axios";
import Filter from "bad-words";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { createToast } from "vercel-toast";
import { BACKEND_URL } from "../services/Api";

const checkForBadWords = (text) => {
  const filter = new Filter();
  return filter.isProfane(text);
};

const fetchBackdrop = async () => {
  try {
    const { data } = await axios.get(
      `${BACKEND_URL}/api/backdrop/movie/27205`
    );
    return `https://image.tmdb.org/t/p/original${data.backdrops[9].file_path}`;
  } catch (error) {
    console.error("Error fetching backdrop:", error);
    return "";
  }
};

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [backdrop, setBackdrop] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Wait for both user state and backdrop data
        const [userStatus, backdropUrl] = await Promise.all([
          new Promise((resolve) => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
              if (user) navigate("/");
              else setLoading(false);
              unsubscribe();
              resolve();
            });
          }),
          fetchBackdrop(),
        ]);
        setBackdrop(backdropUrl);

        const params = new URLSearchParams(location.search);
        if (params.get("verified") === "true") {
          createToast("Your email has been verified.", {
            cancel: "Cancel",
            timeout: 3000,
            type: "success",
          });
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, [navigate, location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    if (!username || !email || !password) {
      setFormLoading(false);
      return createToast("Please fill in all the fields.", {
        cancel: "Cancel",
        timeout: 3000,
        type: "error",
      });
    }

    if (checkForBadWords(username) || checkForBadWords(email)) {
      setFormLoading(false);
      return createToast(
        "Your username or email contains inappropriate words.",
        { cancel: "Cancel", timeout: 3000, type: "error" }
      );
    }

    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCred.user;
      const colRef = doc(db, "users", user.uid);
      await setDoc(colRef, { username: username });
      await sendEmailVerification(user, {
        url: `${import.meta.env.VITE_WEBSITE_URL}/signup?verified=true`,
      });

      createToast("We have sent you an email for verification.", {
        cancel: "Hide",
        timeout: 3000,
        type: "success",
      });
    } catch (error) {
      handleSignUpError(error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleSignUpError = (error) => {
    if (error.message.includes("email-already-in-use")) {
      createToast("The email is already in use.", {
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
      });
    } else {
      createToast(error.message, {
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
          className="p-4 flex flex-col items-center justify-center min-h-screen bg-black bg-opacity-60"
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative z-10 w-full max-w-md flex flex-col items-center bg-black bg-opacity-80 backdrop-blur-md p-3 rounded-lg shadow-lg">
            <h1 className="text-white text-4xl font-bold mb-6 mt-2">Sign Up</h1>
            <form className="w-full" onSubmit={handleSubmit}>
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-6">
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
                disabled={formLoading}
              >
                {formLoading ? "Signing Up..." : "Sign Up"}
              </Button>
            </form>
            <div className="relative z-10 text-white mt-4">
              <p>
                Already Have An Account?{" "}
                <Link to="/login" className="text-blue-500">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SignUp;
