import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axiosClient'

export default function Dashboard() {
  const [matches, setMatches] = useState([])
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    api.get('/matches').then(r => setMatches(r.data)).catch(() => {})
  }, [])

  const logout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-4 py-3 flex justify-between items-center">
        <h1 className="font-bold text-lg">🏏 CricPredict</h1>
        <div className="flex gap-3 items-center">
          <Link to="/leaderboard" className="text-sm text-blue-600">Leaderboard</Link>
          <Link to="/profile" className="text-sm text-blue-600">Profile</Link>
          <button onClick={logout} className="text-sm text-red-500">Logout</button>
        </div>
      </div>
      <div className="max-w-lg mx-auto p-4">
        <div className="bg-blue-50 rounded-xl p-4 mb-4">
          <p className="text-sm text-gray-500">Welcome back</p>
          <p className="font-bold text-lg">{user.username || 'Player'}</p>
          <p className="text-blue-600 font-semibold">{user.total_points || 0} points</p>
        </div>
        <h2 className="font-semibold mb-3">Upcoming Matches</h2>
        {matches.length === 0 && <p className="text-gray-400 text-sm text-center py-8">No matches yet</p>}
        {matches.map(match => (
          <div key={match.id} className="bg-white rounded-xl border p-4 mb-3 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                match.status === 'live' ? 'bg-red-100 text-red-600' :
                match.status === 'upcoming' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-500'}`}>
                {match.status.toUpperCase()}
              </span>
              <span className="text-xs text-gray-400">{match.venue}</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold text-lg">{match.team_home}</span>
              <span className="text-gray-400 text-sm">VS</span>
              <span className="font-bold text-lg">{match.team_away}</span>
            </div>
            <button onClick={() => navigate(`/match/${match.id}`)}
              className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
              Predict Now
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}