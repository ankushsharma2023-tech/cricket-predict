import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axiosClient'

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/users/profile').then(r => setProfile(r.data)).catch(() => {})
  }, [])

  if (!profile) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate('/dashboard')} className="text-blue-600 text-sm">← Back</button>
        <h1 className="font-bold">My Profile</h1>
      </div>
      <div className="max-w-lg mx-auto p-4">
        <div className="bg-white rounded-2xl border shadow-sm p-6 mb-4 text-center">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-2xl mx-auto mb-3">
            {profile.username[0].toUpperCase()}
          </div>
          <p className="font-bold text-xl">{profile.username}</p>
          <p className="text-gray-400 text-sm">{profile.email}</p>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white rounded-xl border p-3 text-center shadow-sm">
            <p className="text-2xl font-bold text-blue-600">{profile.total_points}</p>
            <p className="text-xs text-gray-400 mt-1">Total Points</p>
          </div>
          <div className="bg-white rounded-xl border p-3 text-center shadow-sm">
            <p className="text-2xl font-bold text-orange-500">{profile.current_streak}</p>
            <p className="text-xs text-gray-400 mt-1">Streak 🔥</p>
          </div>
          <div className="bg-white rounded-xl border p-3 text-center shadow-sm">
            <p className="text-2xl font-bold text-green-600">{profile.longest_streak}</p>
            <p className="text-xs text-gray-400 mt-1">Best Streak</p>
          </div>
        </div>
      </div>
    </div>
  )
}
