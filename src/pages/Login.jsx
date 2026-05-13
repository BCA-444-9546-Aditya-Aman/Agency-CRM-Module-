import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

import { auth } from '../firebase/firebase'

export default function Login() {

  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {

    try {

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      )

      navigate('/dashboard')

    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">

      <div className="card p-4 shadow" style={{ width: '400px' }}>

        <h3 className="text-center mb-4">
          Agency CRM Login
        </h3>

        <input
          type="email"
          placeholder="Email"
          className="form-control mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="form-control mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="btn btn-primary w-100"
          onClick={handleLogin}
        >
          Login
        </button>

      </div>
    </div>
  )
}