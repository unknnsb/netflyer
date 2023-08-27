import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Loading from '../components/Loading'
import { auth, db } from '../services/Firebase'

const SignUp = () => {
  const [username, setUsername] = useState('')
  const [image, setImage] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const onFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile)
      setImage(imageUrl)
      document.querySelector('#ava').remove()
    }
  }

  useEffect(() => {
    const generateRandomPFP = async () => {
      try {
        const response = await fetch('https://randomuser.me/api/')
        const data = await response.json()
        const randomUser = data.results[0]
        const pfpURL = randomUser.picture.large
        setImage(pfpURL)
      } catch (error) {
        console.error('Error fetching random user data:', error)
      }
    }
    generateRandomPFP()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCred) => {
        const user = userCred.user
        const colRef = doc(db, 'users', user.uid)
        setDoc(colRef, {
          username: username,
          avatar: image,
        }).then(() => {
          navigate('/')
        })
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/')
      } else if (!user) {
        setLoading(false)
      }
    })
  }, [])

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
          <h1 className="text-white text-4xl font-bold mb-6">SignUp</h1>
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
              className="w-full px-4 py-2 rounded bg-gray-800 text-white mb-4"
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
              className="w-full px-4 py-2 rounded bg-gray-800 text-white mb-4"
            />
            <img
              src={image}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-2 border-white mb-4 mx-auto"
            />
            <p id="ava" className="text-center text-white">
              Default Avatar
            </p>

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
              className="w-full px-4 py-2 rounded bg-gray-800 text-white mb-4"
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
              className="w-full px-4 py-2 rounded bg-gray-800 text-white mb-6"
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
            Already Have An Account?{' '}
            <Link to="/login" className="text-blue-500">
              Login
            </Link>
          </p>
        </div>
      )}
    </>
  )
}

export default SignUp
