import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axiosClient'

export default function Leaderboard() {
  const [players, setPlayers] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/leaderboard').then(r => setPlayers(r.data)).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate('/dashboard')} className="text-blue-600 text-sm">← Back</button>
        <h1 className="font-bold">Leaderboard</h1>
      </div>
      <div className="max-w-lg mx-auto p-4">
        {players.map((player, i) => (
          <div key={player.id} className={`flex items-center gap-3 p-3 rounded-xl mb-2 ${i < 3 ? 'bg-white border shadow-sm' : 'bg-white border'}`}>
            <span className="font-bold text-lg w-8 text-center">
              {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
            </span>
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
              {player.username[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{player.username}</p>
              <p className="text-xs text-gray-400">🔥 {player.current_streak} streak</p>
            </div>
            <span className="font-bold text-blue-600">{player.total_points} pts</span>
          </div>
        ))}
        {players.length === 0 && <p className="text-gray-400 text-sm text-center py-8">No players yet</p>}
      </div>
    </div>
  )
}