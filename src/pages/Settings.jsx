import Loading from "../components/Loading";
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../services/Firebase";

const Settings = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/signup')
      } else {
        setLoading(false)
      }
    })
  })

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login')
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Render the signout button
  return (
    <>
      {
        loading ? (
          <Loading />
        ) : (
          <div className="flex items-center justify-center w-full h-screen">
            <button
              onClick={handleSignOut}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded">
              Sign Out
            </button>
          </div>
        )
      }
    </>
  );
}
export default Settings
