import Loading from "../components/Loading";
import { auth, db, storage } from "../services/Firebase";
import Filter from "bad-words";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  getMetadata,
} from "firebase/storage";
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [image, setImage] = useState(
    "https://ih0.redbubble.net/image.618427277.3222/flat,1000x1000,075,f.u1.jpg"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [checkingAvatar, setCheckingAvatar] = useState(false);
  const [avatarNotFound, setAvatarNotFound] = useState(false);
  const navigate = useNavigate();

  const checkForBadWords = (text) => {
    const filter = new Filter();
    return filter.isProfane(text);
  };

  const checkAvatarExists = async (username) => {
    setCheckingAvatar(true);
    const storageRef = ref(
      storage,
      `avatars/${username.toLowerCase()}_profile.jpg`
    );
    try {
      await getMetadata(storageRef);
      setCheckingAvatar(false);
      return true; // Avatar exists
    } catch (error) {
      setCheckingAvatar(false);
      return false; // Avatar doesn't exist
    }
  };

  const onFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && username) {
      const storageRef = ref(
        storage,
        `avatars/${username.toLowerCase()}_profile.jpg`
      );
      try {
        const snapshot = await uploadBytesResumable(storageRef, selectedFile);
        const downloadURL = await getDownloadURL(snapshot.ref);
        setImage(downloadURL);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    } else if (!username) {
      alert("Please provide a username first.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        alert(error.message);
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

  const handleUsernameBlur = async () => {
    if (username) {
      const avatarExists = await checkAvatarExists(username);
      if (avatarExists) {
        const storageRef = ref(
          storage,
          `avatars/${username.toLowerCase()}_profile.jpg`
        );
        const downloadURL = await getDownloadURL(storageRef);
        setImage(downloadURL);
        setAvatarNotFound(false);
      } else {
        setAvatarNotFound(true);
      }
    }
  };

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
              onBlur={handleUsernameBlur}
              className="w-full px-4 py-2 rounded bg-[#1e1c1c] text-white mb-4"
              required
            />
            {checkingAvatar && (
              <p className="text-white text-base mb-2">
                Checking for the username in the database...
              </p>
            )}
            {avatarNotFound && <p className="text-white text-base mb-2"></p>}
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
