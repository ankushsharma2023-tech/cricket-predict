import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axiosClient'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const res = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/dashboard')
    } catch  {
      setError('Invalid email or password')
    }
  } 

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-2">🏏 CricPredict</h1>
        <p className="text-gray-500 text-center text-sm mb-6">Login to your account</p>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <input className="w-full border rounded-lg px-4 py-2.5 mb-3 text-sm outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="w-full border rounded-lg px-4 py-2.5 mb-4 text-sm outline-none focus:ring-2 focus:ring-blue-300"
          type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700 transition">
          Login
        </button>
        <p className="text-center text-sm text-gray-500 mt-4">
          No account? <Link to="/register" className="text-blue-600 font-medium">Register</Link>
        </p>
      </div>
    </div>
  )
}