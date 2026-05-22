import React, { createContext, useState, useContext } from 'react';

const UserProgressContext = createContext();

export const useUserProgress = () => useContext(UserProgressContext);

export const UserProgressProvider = ({ children }) => {
  // Mock initial data so the dashboard looks populated for demonstration
  const [topicScores, setTopicScores] = useState({
    "Periodic Trends": { correct: 4, total: 10 },
    "VSEPR Theory": { correct: 9, total: 10 },
    "Atomic Structure": { correct: 7, total: 10 }
  });
  
  const [needsRevision, setNeedsRevision] = useState([
    { id: 'q1', topic: 'Periodic Trends', text: 'Which element has the highest electronegativity?', correct: 'Fluorine' }
  ]);

  const recordQuizResult = (topic, correct, total, missedQuestions) => {
    setTopicScores(prev => {
      const current = prev[topic] || { correct: 0, total: 0 };
      return {
        ...prev,
        [topic]: {
          correct: current.correct + correct,
          total: current.total + total
        }
      };
    });

    if (missedQuestions && missedQuestions.length > 0) {
      setNeedsRevision(prev => {
        const newQuestions = missedQuestions.filter(q => !prev.some(p => p.id === q.id));
        return [...prev, ...newQuestions];
      });
    }
  };

  const clearRevisionItem = (id) => {
    setNeedsRevision(prev => prev.filter(q => q.id !== id));
  };

  return (
    <UserProgressContext.Provider value={{ topicScores, needsRevision, recordQuizResult, clearRevisionItem }}>
      {children}
    </UserProgressContext.Provider>
  );
};
