import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axiosClient'

export default function MatchDetail() {
  const { id } = useParams()
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    api.get(`/matches/${id}/questions`).then(r => setQuestions(r.data)).catch(() => {})
  }, [id])

  const handleSubmit = async () => {
    try {
      for (const [question_id, selected_answer] of Object.entries(answers)) {
        await api.post('/predictions', { question_id: parseInt(question_id), selected_answer })
      }
      setSubmitted(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit')
    }
  }

  if (submitted) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-4xl mb-4">✅</p>
        <p className="text-xl font-bold mb-2">Predictions locked in!</p>
        <button onClick={() => navigate('/dashboard')} className="text-blue-600 text-sm">Back to Dashboard</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate('/dashboard')} className="text-blue-600 text-sm">← Back</button>
        <h1 className="font-bold">Make Predictions</h1>
      </div>
      <div className="max-w-lg mx-auto p-4">
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        {questions.length === 0 && <p className="text-gray-400 text-sm text-center py-8">No questions for this match yet</p>}
        {questions.map(q => (
          <div key={q.id} className="bg-white rounded-xl border p-4 mb-3 shadow-sm">
            <p className="font-semibold mb-3 text-sm">{q.question_text}</p>
            {JSON.parse(q.options).map(opt => (
              <button key={opt} onClick={() => setAnswers(a => ({ ...a, [q.id]: opt }))}
                className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm mb-2 transition
                  ${answers[q.id] === opt ? 'bg-blue-50 border-blue-400 text-blue-700 font-medium' : 'border-gray-200 hover:bg-gray-50'}`}>
                {opt}
              </button>
            ))}
            <p className="text-xs text-green-600 mt-1">+{q.points_reward} pts for correct answer</p>
          </div>
        ))}
        {questions.length > 0 && (
          <button onClick={handleSubmit}
            disabled={Object.keys(answers).length < questions.length}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm disabled:opacity-40 hover:bg-blue-700 transition">
            Submit All Predictions
          </button>
        )}
      </div>
    </div>
  )
}