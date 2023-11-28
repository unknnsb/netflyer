import Loading from "../components/Loading";
import { auth } from "../services/Firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createToast } from "vercel-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
          await signInWithEmailAndPassword(auth, email, password);
          return createToast("Login Successful", {
            action: {
              text: '',
              callback(toast) {
                navigate("/");
                setInterval(() => {
                  toast.destroy();
                }, 1500);
              },
            },
            type: "success",
          });
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
            <form className="w-full max-w-md">
              <label
                htmlFor="email"
                className="block text-white font-semibold mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded bg-[#1e1c1c] text-white mb-4"
                required
              />

              <label
                htmlFor="password"
                className="block text-white font-semibold mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded bg-[#1e1c1c] text-white mb-6"
                required
              />

              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition duration-300"
              >
                Login
              </button>
            </form>
          </div>
          <p className="text-white mt-4">
            Don't Have An Account?{" "}
            <Link to="/signup" className="text-blue-500">
              Sign Up
            </Link>
          </p>
        </div>
      )}
    </>
  );
};

export default Login;
