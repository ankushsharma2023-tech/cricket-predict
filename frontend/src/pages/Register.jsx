import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axiosClient'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleRegister = async () => {
    try {
      const res = await api.post('/auth/register', form)
      localStorage.setItem('token', res.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-2">🏏 CricPredict</h1>
        <p className="text-gray-500 text-center text-sm mb-6">Create your account</p>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <input className="w-full border rounded-lg px-4 py-2.5 mb-3 text-sm outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="Username"
          onChange={e => setForm({ ...form, username: e.target.value })} />
        <input className="w-full border rounded-lg px-4 py-2.5 mb-3 text-sm outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="Email"
          onChange={e => setForm({ ...form, email: e.target.value })} />
        <input className="w-full border rounded-lg px-4 py-2.5 mb-4 text-sm outline-none focus:ring-2 focus:ring-blue-300"
          type="password" placeholder="Password"
          onChange={e => setForm({ ...form, password: e.target.value })} />
        <button onClick={handleRegister}
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700 transition">
          Create Account
        </button>
        <p className="text-center text-sm text-gray-500 mt-4">
          Have an account? <Link to="/login" className="text-blue-600 font-medium">Login</Link>
        </p>
      </div>
    </div>
  )
}