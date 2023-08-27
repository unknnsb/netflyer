import { onAuthStateChanged, signOut } from 'firebase/auth'
import { getDocs, collection, doc, getDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Loading from './components/Loading'
import { auth, db } from './services/Firebase'

const App = () => {
  const [username, setUsername] = useState('')
  const [avatar, setAvatar] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      navigate('/signup')
    } else {
      const userRef = doc(db, 'users', user.uid)
      getDoc(userRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data()
            setUsername(userData.username)
            setAvatar(userData.avatar)
            setLoading(false)
          }
        })
        .catch((error) => {
          console.error('Error fetching account data:', error)
          alert('Error fetching account data:', error)
        })
    }
  })

  const handleLogOut = () => {
    signOut(auth).then(() => {
      navigate('/login')
    })
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="page">
          <footer className="mt-10 text-center text-gray-400 text-sm">
            Copyright © 2023 Netflyer
          </footer>
          <h1>Examples</h1>
          {username}
          <img src={avatar} alt="avatar" />
          <button onClick={handleLogOut}>Logout</button>
        </div>
      )}
    </>
  )
}

export default App
