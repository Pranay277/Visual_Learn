import React, { useContext, useMemo } from 'react';
import { LuminaContext } from '../App';
import { X, Activity, BookOpen, AlertTriangle } from 'lucide-react';
import { generateRecommendations, getChannelsForSubject, VideoRecommendation } from './youtubeRecommender';
import { SubjectQuizScore } from './quizData';

interface PerformanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PerformanceModal({ isOpen, onClose }: PerformanceModalProps) {
  const { quizHistory } = useContext(LuminaContext) || { quizHistory: [] };

  // Calculate aggregated stats
  const stats = useMemo(() => {
    if (!quizHistory || quizHistory.length === 0) return null;

    let totalScore = 0;
    let totalQuestions = 0;
    let totalCorrect = 0;
    const weakTopicsSet = new Set<string>();
    const subjectsSet = new Set<string>();

    quizHistory.forEach((quiz) => {
      totalScore += quiz.percentage;
      totalQuestions += quiz.totalQuestions;
      totalCorrect += quiz.correctAnswers;
      quiz.weakTopics.forEach((t) => weakTopicsSet.add(t));
      subjectsSet.add(quiz.subject);
    });

    const averageScore = Math.round(totalScore / quizHistory.length);
    const weakTopics = Array.from(weakTopicsSet);

    // Generate recommendations based on the most recent weak topics across subjects
    // For a real app, you might want to fetch recommendations asynchronously or map them precisely.
    // We will generate recommendations using a mock "mixed" subject or just the last subject.
    const lastSubject = quizHistory[quizHistory.length - 1].subject;
    const allWeakQueries = weakTopics.map(t => `${lastSubject} ${t} tutorial`);
    const recommendations = generateRecommendations(allWeakQueries, lastSubject as any, quizHistory[quizHistory.length - 1]);

    return {
      averageScore,
      totalQuizzes: quizHistory.length,
      totalQuestions,
      totalCorrect,
      weakTopics,
      recommendations,
      subjects: Array.from(subjectsSet)
    };
  }, [quizHistory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="max-w-4xl w-full max-h-[90vh] bg-gray-900 rounded-2xl p-6 border border-gray-700 shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-xl">
              <Activity className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Performance Dashboard</h2>
          </div>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-white transition-colors bg-gray-800 rounded-full hover:bg-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar mt-6 min-h-0">
          {!stats ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <BookOpen className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg">No quiz data yet.</p>
              <p className="text-sm mt-1">Take a quiz in any subject to start tracking your performance!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-8 pb-8">
              
              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700/50 flex flex-col">
                  <span className="text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">Average Score</span>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-4xl font-black ${stats.averageScore >= 80 ? 'text-green-400' : stats.averageScore >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                      {stats.averageScore}%
                    </span>
                  </div>
                </div>
                <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700/50 flex flex-col">
                  <span className="text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">Quizzes Taken</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white">{stats.totalQuizzes}</span>
                  </div>
                </div>
                <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700/50 flex flex-col">
                  <span className="text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">Questions Answered</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-blue-400">{stats.totalQuestions}</span>
                  </div>
                </div>
                <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700/50 flex flex-col">
                  <span className="text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">Accuracy</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white">{Math.round((stats.totalCorrect / stats.totalQuestions) * 100)}%</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-6">
                
                {/* Weak Topics */}
                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-red-900/10 border border-red-500/20 p-5 rounded-xl flex flex-col h-full">
                    <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" /> Topics to Revise
                    </h3>
                    {stats.weakTopics.length > 0 ? (
                      <div className="flex flex-col gap-2">
                        {stats.weakTopics.map(topic => (
                          <div key={topic} className="bg-red-900/20 text-red-300 border border-red-800/50 px-3 py-2 rounded-lg text-sm capitalize flex justify-between items-center">
                            <span>{topic}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No weak topics recorded yet! Keep up the good work.</p>
                    )}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="lg:w-2/3 flex flex-col gap-4">
                  <div className="bg-gray-800/30 border border-gray-700 p-5 rounded-xl h-full flex flex-col">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-400" /> Recommended Study Materials
                    </h3>
                    {stats.recommendations.length > 0 ? (
                      <div className="space-y-3">
                        {stats.recommendations.slice(0, 4).map((rec, idx) => (
                          <div key={idx} className="bg-gray-800 rounded-xl p-4 border border-gray-700/50 flex gap-4 hover:bg-gray-750 transition-colors">
                            <div 
                              className="w-24 h-16 shrink-0 rounded-lg flex items-center justify-center border border-white/10"
                              style={{ backgroundColor: rec.thumbnailColor }}
                            >
                              <span className="text-white opacity-50 text-xl">▶</span>
                            </div>
                            <div className="flex flex-col justify-center flex-1">
                              <h4 className="text-white text-sm font-medium line-clamp-1">{rec.title}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-gray-400 text-xs">{rec.channelName}</span>
                                <span className="text-gray-600 text-xs">•</span>
                                <span className={`text-[10px] uppercase font-bold px-1.5 rounded ${rec.difficulty === 'beginner' ? 'bg-green-900/30 text-green-400' : rec.difficulty === 'intermediate' ? 'bg-amber-900/30 text-amber-400' : 'bg-red-900/30 text-red-400'}`}>
                                  {rec.difficulty}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <a href={rec.youtubeSearchUrl} target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors whitespace-nowrap">
                                Watch
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">Take more quizzes to get personalized video recommendations.</p>
                    )}
                  </div>
                </div>

              </div>

              {/* History List */}
              <div className="bg-gray-800/30 border border-gray-700 p-5 rounded-xl">
                <h3 className="text-white font-bold mb-4">Quiz History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-gray-500 border-b border-gray-700">
                        <th className="pb-3 font-semibold">Subject</th>
                        <th className="pb-3 font-semibold">Score</th>
                        <th className="pb-3 font-semibold">Correct</th>
                        <th className="pb-3 font-semibold">Strong Topics</th>
                        <th className="pb-3 font-semibold">Weak Topics</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/50">
                      {quizHistory.slice().reverse().map((quiz, i) => (
                        <tr key={i} className="text-gray-300">
                          <td className="py-4 capitalize font-medium">{quiz.subject}</td>
                          <td className="py-4">
                            <span className={`font-bold ${quiz.percentage >= 80 ? 'text-green-400' : quiz.percentage >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                              {quiz.percentage}%
                            </span>
                          </td>
                          <td className="py-4 text-gray-400">{quiz.correctAnswers} / {quiz.totalQuestions}</td>
                          <td className="py-4 text-xs text-gray-500">{quiz.strongTopics.join(', ') || '-'}</td>
                          <td className="py-4 text-xs text-red-400/80">{quiz.weakTopics.join(', ') || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
