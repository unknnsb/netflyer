import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Loading from '../components/Loading'
import { auth } from '../services/Firebase'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate('/')
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
          <h1 className="text-white text-4xl font-bold mb-6">Login</h1>
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
              Login
            </button>
          </form>

          <p className="text-white mt-4">
            Don't Have An Account?{' '}
            <Link to="/signup" className="text-blue-500">
              Sign Up
            </Link>
          </p>
        </div>
      )}
    </>
  )
}

export default Login
