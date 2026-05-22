import React, { useState, useEffect, useRef, useContext } from 'react'
import QUIZ_QUESTIONS, { QuizQuestion, QuizResult, SubjectQuizScore } from './quizData'
import { quizEngine, QuizEngine } from './quizEngine'
import { generateRecommendations, getChannelsForSubject, VideoRecommendation } from './youtubeRecommender'
import { LuminaContext } from '../App'

interface QuizModalProps {
  subject: 'biology' | 'chemistry' | 'physics' | 'maths' | 'programming'
  isOpen: boolean
  onClose: () => void
  onComplete: (score: SubjectQuizScore) => void
}

type QuizPhase = 'intro' | 'question' | 'explanation' | 'results' | 'recommendations'

export default function QuizModal({ subject, isOpen, onClose, onComplete }: QuizModalProps) {
  const [phase, setPhase] = useState<QuizPhase>('intro')
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [results, setResults] = useState<QuizResult[]>([])
  const [score, setScore] = useState<SubjectQuizScore | null>(null)
  const [recommendations, setRecommendations] = useState<VideoRecommendation[]>([])
  const [timeLeft, setTimeLeft] = useState(30)
  const [isTimerActive, setIsTimerActive] = useState(false)
  const { addQuizScore } = useContext(LuminaContext) || {}
  
  // Timer effect
  useEffect(() => {
    let timer: number
    if (isTimerActive && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (isTimerActive && timeLeft === 0) {
      // Auto-submit
      handleOptionSelect(null)
    }
    return () => clearInterval(timer)
  }, [isTimerActive, timeLeft])

  // Init logic
  useEffect(() => {
    if (isOpen) {
      quizEngine.resetSession()
      quizEngine.startSession()
      const selected = QuizEngine.selectQuestionsForSubject(subject, QUIZ_QUESTIONS, 10)
      setQuestions(selected)
      setCurrentIndex(0)
      setResults([])
      setPhase('intro')
      setScore(null)
      setRecommendations([])
    }
  }, [isOpen, subject])

  const startQuiz = () => {
    setPhase('question')
    setCurrentIndex(0)
    setTimeLeft(30)
    setIsTimerActive(true)
    quizEngine.startQuestion()
  }

  const handleOptionSelect = (optionId: string | null) => {
    if (phase !== 'question' || selectedOption !== null) return
    setSelectedOption(optionId)
    setIsTimerActive(false)
    const result = quizEngine.submitAnswer(questions[currentIndex], optionId)
    setResults(prev => [...prev, result])
    setPhase('explanation')
  }

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      const subjectScore = quizEngine.computeSubjectScore(subject)
      setScore(subjectScore)
      const weakQueries = quizEngine.getYoutubeQueriesForWeakTopics(subject, QUIZ_QUESTIONS)
      const recs = generateRecommendations(weakQueries, subject, subjectScore)
      setRecommendations(recs)
      if (addQuizScore) addQuizScore(subjectScore)
      onComplete(subjectScore)
      setPhase('results')
    } else {
      setCurrentIndex(prev => prev + 1)
      setSelectedOption(null)
      setTimeLeft(30)
      setIsTimerActive(true)
      quizEngine.startQuestion()
      setPhase('question')
    }
  }

  if (!isOpen) return null

  // Subject theme colors
  const subjectColors: Record<string, string> = {
    biology: 'emerald',
    chemistry: 'blue',
    physics: 'orange',
    maths: 'purple',
    programming: 'pink'
  }
  const color = subjectColors[subject] || 'blue'

  const currentQ = questions[currentIndex]

  // Render helpers
  const renderTimerRing = () => {
    const percentage = (timeLeft / 30) * 100
    const ringColor = timeLeft > 15 ? 'text-green-500' : timeLeft > 7 ? 'text-amber-500' : 'text-red-500'
    return (
      <div className="relative w-12 h-12 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <path className="text-gray-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
          <path className={ringColor} strokeDasharray={`${percentage}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
        </svg>
        <span className="absolute text-sm text-white font-bold">{timeLeft}</span>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      {phase === 'intro' && (
        <div className={`max-w-lg w-full bg-gray-900 rounded-2xl p-8 border border-gray-700 border-t-4 border-t-${color}-500`}>
          <div className="flex flex-col items-center text-center">
            <div className={`w-16 h-16 bg-${color}-900/30 text-${color}-400 rounded-2xl flex items-center justify-center text-3xl mb-4`}>
              {subject === 'biology' && '🧬'}
              {subject === 'chemistry' && '🧪'}
              {subject === 'physics' && '🔭'}
              {subject === 'maths' && '📐'}
              {subject === 'programming' && '💻'}
            </div>
            <h2 className="text-2xl font-bold text-white capitalize">{subject} Quiz</h2>
            <p className="text-gray-400 mt-2">10 questions across key topics. 30 seconds per question.</p>
            
            <div className="flex gap-3 mt-6">
              <span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300">10 Questions</span>
              <span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300">30 sec / question</span>
              <span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300">Instant feedback</span>
            </div>

            <button onClick={startQuiz} className={`w-full mt-8 bg-${color}-600 hover:bg-${color}-500 text-white font-bold py-3 rounded-xl transition-colors`}>
              Start Quiz
            </button>
            <button onClick={onClose} className="mt-4 text-gray-500 hover:text-gray-300 text-sm">
              Cancel
            </button>
          </div>
        </div>
      )}

      {(phase === 'question' || phase === 'explanation') && currentQ && (
        <div className="max-w-2xl w-full bg-gray-900 rounded-2xl p-8 shadow-2xl flex flex-col">
          <div className="flex items-center justify-between border-b border-gray-800 pb-4">
            <span className="text-sm font-medium text-gray-400">Question {currentIndex + 1} of {questions.length}</span>
            <div className="flex-1 mx-6 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className={`h-full bg-${color}-500 transition-all duration-300`} style={{ width: `${((currentIndex) / questions.length) * 100}%` }}></div>
            </div>
            {renderTimerRing()}
          </div>

          <div className="flex gap-2 mt-6">
            <span className={`px-2 py-1 text-[10px] uppercase font-bold rounded ${currentQ.difficulty === 'easy' ? 'bg-green-900/30 text-green-400' : currentQ.difficulty === 'medium' ? 'bg-amber-900/30 text-amber-400' : 'bg-red-900/30 text-red-400'}`}>
              {currentQ.difficulty}
            </span>
            <span className="px-2 py-1 bg-gray-800 text-gray-400 text-[10px] uppercase font-bold rounded">
              {currentQ.topic}
            </span>
          </div>

          <h3 className="text-xl text-white font-medium mt-4 leading-relaxed">{currentQ.question}</h3>

          <div className="mt-8 space-y-3">
            {currentQ.options.map((opt) => {
              const isSelected = selectedOption === opt.id
              const isCorrect = currentQ.correctOptionId === opt.id
              let btnClass = "w-full text-left p-4 rounded-xl border flex items-center gap-4 transition-all "
              let badgeClass = "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm "

              if (phase === 'question') {
                if (isSelected) {
                  btnClass += "border-blue-500 bg-blue-900/30 text-white"
                  badgeClass += "bg-blue-500 text-white"
                } else {
                  btnClass += "border-gray-700 bg-gray-800 text-gray-200 hover:border-gray-500 hover:bg-gray-750 cursor-pointer"
                  badgeClass += "bg-gray-700 text-gray-300"
                }
              } else {
                // Explanation phase
                if (isCorrect) {
                  btnClass += "border-green-500 bg-green-900/30 text-green-300"
                  badgeClass += "bg-green-500 text-white"
                } else if (isSelected && !isCorrect) {
                  btnClass += "border-red-500 bg-red-900/30 text-red-300"
                  badgeClass += "bg-red-500 text-white"
                } else {
                  btnClass += "border-gray-800 bg-gray-800/50 text-gray-500 opacity-50"
                  badgeClass += "bg-gray-800 text-gray-600"
                }
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleOptionSelect(opt.id)}
                  className={btnClass}
                  disabled={phase !== 'question'}
                >
                  <div className={badgeClass}>{opt.id.toUpperCase()}</div>
                  <span className="flex-1">{opt.text}</span>
                  {phase === 'explanation' && isCorrect && <span className="text-green-400">✓</span>}
                  {phase === 'explanation' && isSelected && !isCorrect && <span className="text-red-400">✗</span>}
                </button>
              )
            })}
          </div>

          {phase === 'explanation' && (
            <div className="mt-6 bg-gray-800 rounded-xl p-5 border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-400">💡</span>
                <span className="text-xs text-gray-500 uppercase font-bold">Explanation</span>
                {selectedOption === currentQ.correctOptionId 
                  ? <span className="ml-auto text-green-400 text-xs font-bold bg-green-900/20 px-2 py-0.5 rounded">Correct! +1 point</span>
                  : <span className="ml-auto text-red-400 text-xs font-bold bg-red-900/20 px-2 py-0.5 rounded">Not quite...</span>
                }
              </div>
              <p className="text-gray-200 text-sm leading-relaxed">{currentQ.explanation}</p>
            </div>
          )}

          {phase === 'explanation' && (
            <button onClick={handleNext} className="mt-6 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors">
              {currentIndex + 1 >= questions.length ? 'See Results →' : 'Next Question →'}
            </button>
          )}
        </div>
      )}

      {phase === 'results' && score && (
        <div className="max-w-2xl w-full bg-gray-900 rounded-2xl p-8 flex flex-col items-center">
          <div className="relative w-48 h-48 mb-6 flex justify-center items-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path className="text-gray-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
              <path className={score.percentage >= 80 ? 'text-green-500' : score.percentage >= 60 ? 'text-amber-500' : 'text-red-500'} strokeDasharray={`${score.percentage}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
            </svg>
            <div className="absolute text-center">
              <div className="text-4xl font-bold text-white">{score.correctAnswers}/{score.totalQuestions}</div>
              <div className="text-gray-400 text-sm mt-1">{score.percentage}%</div>
            </div>
          </div>

          <h2 className={`text-2xl font-bold ${score.percentage >= 80 ? 'text-green-400' : score.percentage >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
            {score.percentage >= 80 ? 'Excellent!' : score.percentage >= 60 ? 'Good work!' : 'Keep practicing!'}
          </h2>

          <div className="w-full mt-8">
            <h3 className="text-gray-300 font-medium mb-3">Topic Performance</h3>
            <div className="space-y-2">
              {Object.entries(results.reduce((acc, r) => {
                if (!acc[r.topic]) acc[r.topic] = { c: 0, t: 0 }
                acc[r.topic].t++
                if (r.correct) acc[r.topic].c++
                return acc
              }, {} as Record<string, {c:number, t:number}>)).map(([topic, stats]) => {
                const perc = (stats.c / stats.t) * 100
                const isWeak = perc < 60
                const isStrong = perc >= 80
                return (
                  <div key={topic} className={`bg-gray-800 rounded p-3 flex items-center justify-between border-l-4 ${isWeak ? 'border-red-500' : isStrong ? 'border-green-500' : 'border-amber-500'}`}>
                    <span className="text-sm text-gray-200 capitalize">{topic}</span>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div className={`h-full ${isWeak ? 'bg-red-500' : isStrong ? 'bg-green-500' : 'bg-amber-500'}`} style={{ width: `${perc}%` }}></div>
                      </div>
                      <span className="text-xs text-gray-400 w-16 text-right">{stats.c}/{stats.t} correct</span>
                      {isWeak && <span className="text-[10px] bg-red-900/30 text-red-400 px-2 py-0.5 rounded">Needs revision</span>}
                      {isStrong && <span className="text-[10px] bg-green-900/30 text-green-400 px-2 py-0.5 rounded">Strong</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col w-full gap-3 mt-8">
            <button onClick={() => setPhase('recommendations')} className={`w-full bg-${color}-600 hover:bg-${color}-500 text-white font-bold py-3 rounded-xl transition-colors`}>
              Get Study Recommendations →
            </button>
            <div className="flex gap-3">
              <button onClick={() => setPhase('intro')} className="flex-1 bg-transparent border border-gray-600 hover:bg-gray-800 text-gray-300 font-medium py-2 rounded-xl transition-colors">
                Try Again
              </button>
              <button onClick={onClose} className="flex-1 text-gray-500 hover:text-gray-300 text-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {phase === 'recommendations' && score && (
        <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-gray-900 rounded-2xl p-8 shadow-2xl flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              📚 Study Recommendations
            </h2>
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${score.percentage >= 80 ? 'bg-green-900/30 text-green-400' : score.percentage >= 60 ? 'bg-amber-900/30 text-amber-400' : 'bg-red-900/30 text-red-400'}`}>
              Score: {score.percentage}%
            </span>
          </div>

          <p className="text-gray-300 mb-6">
            {score.percentage >= 80 
              ? "Great score! Here are some channels to go even deeper:" 
              : "Based on your quiz results, focus on these topics:"}
          </p>

          {score.weakTopics.length > 0 && (
            <div className="mb-8">
              <h3 className="text-red-400 text-sm font-bold uppercase mb-3">Topics to Review</h3>
              <div className="flex flex-wrap gap-2">
                {score.weakTopics.map(wt => (
                  <span key={wt} className="px-3 py-1 bg-red-900/30 text-red-300 border border-red-800 rounded-full text-sm capitalize">
                    {wt}
                  </span>
                ))}
              </div>
            </div>
          )}

          {recommendations.length > 0 && (
            <div className="mb-8">
              <h3 className="text-white font-bold mb-4">Recommended Videos</h3>
              <div className="space-y-3">
                {recommendations.map((rec, idx) => (
                  <div key={idx} className="bg-gray-800 rounded-xl p-4 border border-gray-700 flex gap-4">
                    <div 
                      className="w-32 h-20 shrink-0 rounded-lg flex items-center justify-center border border-white/10"
                      style={{ backgroundColor: rec.thumbnailColor }}
                    >
                      <span className="text-white opacity-50 text-2xl">▶</span>
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="text-white text-sm font-medium line-clamp-2">{rec.title} - Full Explanation</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-gray-400 text-xs">{rec.channelName}</span>
                        <span className="text-gray-600 text-xs">•</span>
                        <span className={`text-[10px] uppercase font-bold px-1.5 rounded ${rec.difficulty === 'beginner' ? 'bg-green-900/30 text-green-400' : rec.difficulty === 'intermediate' ? 'bg-amber-900/30 text-amber-400' : 'bg-red-900/30 text-red-400'}`}>
                          {rec.difficulty}
                        </span>
                      </div>
                      <a href={rec.youtubeSearchUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 text-xs mt-2 font-medium w-fit">
                        Watch on YouTube →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-white font-bold mb-4 capitalize">Recommended Channels for {subject}</h3>
            <div className="space-y-3">
              {getChannelsForSubject(subject).map((ch, idx) => (
                <div key={idx} className="flex justify-between items-center bg-gray-800/50 p-3 rounded-lg border border-gray-700/50">
                  <div>
                    <div className="text-white font-medium text-sm">{ch.name}</div>
                    <div className="text-gray-400 text-xs mt-0.5">{ch.description}</div>
                  </div>
                  <a href={ch.channelUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 text-xs whitespace-nowrap ml-4">
                    Visit Channel →
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button onClick={() => setPhase('results')} className="flex-1 bg-transparent border border-gray-600 hover:bg-gray-800 text-gray-300 font-medium py-2 rounded-xl transition-colors">
              Back to Results
            </button>
            <button onClick={onClose} className={`flex-1 bg-${color}-600 hover:bg-${color}-500 text-white font-medium py-2 rounded-xl transition-colors`}>
              Close & Start Learning
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
