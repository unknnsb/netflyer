import Loading from "../components/Loading";
import { auth, db, storage } from "../services/Firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Filter from 'bad-words';

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [image, setImage] = useState(
    "https://ih0.redbubble.net/image.618427277.3222/flat,1000x1000,075,f.u1.jpg"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkForBadWords = (text) => {
    const filter = new Filter();
    return filter.isProfane(text);
  };


  const onFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && username) {
      const storageRef = ref(
        storage,
        `avatars/${username.toLowerCase()}_profile.jpg`
      );
      document.querySelector("#uploading").innerText = 'Uploading....'
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);
      uploadTask.on(
        "state_changed",
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImage(downloadURL);
            document.querySelector("#uploading").innerText = 'Uploaded'
            setInterval(() => {
              document.querySelector("#uploading").remove()
            }, 3000)
          });
        }
      );
    } else if (!username) {
      alert("Please provide a username first.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (checkForBadWords(username) || checkForBadWords(email)) {
      alert('Your username or email contains inappropriate words. Please choose a different one.');
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCred) => {
          const user = userCred.user;
          const colRef = doc(db, "users", user.uid);
          setDoc(colRef, {
            username: username,
          }).then(() => {
            navigate("/");
          });
        })
        .catch((error) => {
          alert(error.message);
        });
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/");
      } else if (!user) {
        setLoading(false);
      }
    });
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
              required
            />

            <label
              htmlFor="image"
              className="block text-white font-semibold mb-1"
            >
              Avatar
            </label>
            <input
              type="file"
              accept="image/*"
              id="image"
              onChange={onFileChange}
              className="w-full px-4 py-2 rounded bg-[#1e1c1c] text-white mb-4"
            />
            <div className="w-24 h-24 text-white rounded-full border-2 border-white mb-4 mx-auto">
              <img
                src={image}
                alt="Avatar"
                className="w-full h-full rounded-full"
              />
              <p className="text-center mt-2 font-medium" id="uploading"></p>
            </div>
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
