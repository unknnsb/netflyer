import Loading from "../components/Loading";
import { auth, db } from "../services/Firebase";
import Filter from "bad-words";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createToast } from "vercel-toast";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkForBadWords = (text) => {
    const filter = new Filter();
    return filter.isProfane(text);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      return createToast("Please fill in all the fields.", {
        cancel: "Cancel",
        type: "error",
      });
    } else {
      if (checkForBadWords(username) || checkForBadWords(email)) {
        alert(
          "Your username or email contains inappropriate words. Please choose a different one."
        );
      } else {
        try {
          const userCred = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          const user = userCred.user;
          const colRef = doc(db, "users", user.uid);
          await setDoc(colRef, { username: username });
          navigate("/");
        } catch (error) {
          if (error.message.includes("email-already-in-use")) {
            return createToast("The Email Is Already Exists.", {
              action: {
                text: "Login",
                callback(toast) {
                  navigate("/login");
                  toast.destroy();
                },
              },
              cancel: "Cancel",
              type: "dark",
            });
          }
        }
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
        <div className="p-4 flex flex-col items-center justify-center min-h-screen bg-[#202020]">
          <h1 className="text-white text-4xl font-bold mb-6 mt-2">SignUp</h1>
          <form className="w-full max-w-md">
            <label
              htmlFor="username"
              className="block text-white font-semibold mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded bg-[#1e1c1c] text-white mb-4"
              required={true}
            />
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
              required={true}
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
              required={true}
            />

            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition duration-300"
            >
              SignUp
            </button>
          </form>
          <p className="text-white mt-4">
            Already Have An Account?{" "}
            <Link to="/login" className="text-blue-500">
              Login
            </Link>
          </p>
        </div>
      )}
    </>
  );
};

export default SignUp;
