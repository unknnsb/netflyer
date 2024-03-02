import Loading from "../components/Loading";
import { auth, db } from "../services/Firebase";
import { Button, Input } from "@nextui-org/react";
import axios from "axios";
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
  const [backdrop, setBackdrop] = useState("");
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

  useEffect(() => {
    axios
      .get(
        "https://api.themoviedb.org/3/movie/27205/images?api_key=bb2818a2abb39fbdf6da79343e5e376b"
      )
      .then((response) => {
        setBackdrop(
          "https://image.tmdb.org/t/p/original" +
            response.data.backdrops[0].file_path
        );
      });
  });

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
          className={`p-4 flex flex-col items-center justify-center min-h-screen`}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage:
                "linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%)",
            }}
          ></div>

          <form className="w-full max-w-md flex flex-col items-center">
            <h1 className="text-white text-4xl font-bold mb-6 mt-2">SignUp</h1>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded text-white mb-2"
              required={true}
            />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded text-white mb-2"
              required={true}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded text-white mb-4"
              required={true}
            />

            <Button
              type="submit"
              onClick={handleSubmit}
              color="primary"
              className="w-[95%]"
            >
              SignUp
            </Button>
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
