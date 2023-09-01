import { data } from "autoprefixer";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import { auth, db, storage } from "../services/Firebase";

const Settings = () => {
  const [userData, setUserData] = useState()
  const [profile, setProfile] = useState()
  const [loading, setLoading] = useState(true)
  const naviagate = useNavigate()

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        naviagate('/signup')
      } else {
        const colRef = doc(db, "users", user.uid);
        getDoc(colRef)
          .then((docSnapshot) => {
            if (docSnapshot.exists()) {
              // Data exists for this user
              const userData = docSnapshot.data();
              setUserData(userData)
              console.log(userData);
              const storageRef = ref(storage, `avatars/${dataUser.username.toLowerCase()}_profile.jpg`);

              try {
                const downloadURL = getDownloadURL(storageRef);
                setProfile(downloadURL)
              } catch (error) {
                console.error("Error fetching profile image:", error);
                return null;
              }
              setLoading(false)
            } else {
              // No data found for this user
              console.log("No data found for this user");
            }
          })
          .catch((error) => {
            console.error("Error getting user data:", error);
          });
      }
    })
  }, [])
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <h1>{userData.username}</h1>
          <img src={profile} alt="kk" />
        </>
      )
      }
    </>
  )
}

export default Settings
