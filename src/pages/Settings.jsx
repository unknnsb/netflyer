import Loading from "../components/Loading";
import { auth, db, storage } from "../services/Firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const [userData, setUserData] = useState();
  const [profile, setProfile] = useState();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/signup");
      } else {
        const colRef = doc(db, "users", user.uid);
        getDoc(colRef)
          .then((docSnapshot) => {
            if (docSnapshot.exists()) {
              // Data exists for this user
              const userData = docSnapshot.data();
              setUserData(userData);
              setLoading(false);
              console.log(userData);
              const storageRef = ref(
                storage,
                `avatars/${dataUser.username.toLowerCase()}_profile.jpg`
              );

              try {
                const downloadURL = getDownloadURL(storageRef);
                setProfile(downloadURL);
              } catch (error) {
                console.error("Error fetching profile image:", error);
                return null;
              }
            } else {
              // No data found for this user
              console.log("No data found for this user");
            }
          })
          .catch((error) => {
            console.error("Error getting user data:", error);
          });
      }
    });
  }, []);
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <h1 className="flex items-center justify-center w-full h-screen text-white font-medium capitalize">
            Hey{" "}
            <span className="font-bold underline ml-2">
              {userData.username}
            </span>
            , this page is not ready yet.
          </h1>
        </>
      )}
    </>
  );
};

export default Settings;
