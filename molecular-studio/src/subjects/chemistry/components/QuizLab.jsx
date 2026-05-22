import React, { useState } from 'react';
import { useUserProgress } from '../context/UserProgressContext';

const questions = [
  // Periodic Trends
  { id: 'q1', topic: 'Periodic Trends', text: 'Which of the following elements has the highest first ionization energy?', options: ['Na', 'Mg', 'Al', 'Si'], correct: 'Si' },
  { id: 'q2', topic: 'Periodic Trends', text: 'Which element is an exception to the octet rule by forming an expanded octet?', options: ['Carbon', 'Nitrogen', 'Oxygen', 'Phosphorus'], correct: 'Phosphorus' },
  // VSEPR & Bonding
  { id: 'q3', topic: 'Chemical Bonding', text: 'Identify the incorrect statement related to PCl₅ from the following:', options: ['Three equatorial P-Cl bonds make an angle of 120°', 'Two axial P-Cl bonds make an angle of 180°', 'Axial P-Cl bonds are longer than equatorial', 'PCl₅ molecule is non-reactive'], correct: 'PCl₅ molecule is non-reactive' },
  { id: 'q4', topic: 'Chemical Bonding', text: 'The hybridization of the central atom in XeF₄ is:', options: ['sp³', 'sp³d', 'sp³d²', 'sp²'], correct: 'sp³d²' },
  { id: 'q5', topic: 'Chemical Bonding', text: 'Match the molecule with its geometry: SF₄', options: ['Tetrahedral', 'See-saw', 'Square planar', 'Octahedral'], correct: 'See-saw' },
  // Atomic Structure
  { id: 'q6', topic: 'Atomic Structure', text: 'The number of angular nodes and radial nodes in a 3s orbital are, respectively:', options: ['0 and 2', '1 and 0', '0 and 1', '2 and 0'], correct: '0 and 2' },
  { id: 'q7', topic: 'Atomic Structure', text: 'Which principle rules out the existence of definite trajectories of electrons?', options: ["Pauli's exclusion principle", "Heisenberg's uncertainty principle", "Hund's rule", "Aufbau principle"], correct: "Heisenberg's uncertainty principle" },
  // Coordination Compounds
  { id: 'q8', topic: 'Coordination Chemistry', text: 'The geometry and magnetic behaviour of the complex [Ni(CO)₄] are:', options: ['square planar and diamagnetic', 'tetrahedral and diamagnetic', 'square planar and paramagnetic', 'tetrahedral and paramagnetic'], correct: 'tetrahedral and diamagnetic' }
];

export default function QuizLab() {
  const { recordQuizResult } = useUserProgress();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [sessionResults, setSessionResults] = useState([]);

  const currentQ = questions[currentIndex];

  const handleNext = () => {
    // Record current result
    const isCorrect = selected === currentQ.correct;
    const newResults = [...sessionResults, { ...currentQ, isCorrect }];
    setSessionResults(newResults);
    
    // Push to global state
    recordQuizResult(currentQ.topic, isCorrect ? 1 : 0, 1, isCorrect ? [] : [{ ...currentQ, userSelect: selected }]);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    const score = sessionResults.filter(r => r.isCorrect).length;
    return (
      <div className="quiz-lab center glass-panel" style={{margin: '4rem auto', maxWidth: '600px', padding: '4rem 2rem', textAlign: 'center'}}>
        <h2 style={{color: 'var(--accent-green)', marginBottom: '1rem'}}>Quiz Complete!</h2>
        <h1 className="final-score" style={{fontSize: '4rem', marginBottom: '1rem'}}>{score} <span style={{fontSize:'2rem', color:'var(--text-muted)'}}>/ {questions.length}</span></h1>
        <p style={{color: 'var(--text-muted)', marginBottom: '2rem'}}>Your scores have been analyzed and saved to your personalized Dashboard and Revision Hub.</p>
        <button className="primary-btn" onClick={() => { setIsFinished(false); setCurrentIndex(0); setSessionResults([]); setSelected(null); setShowResult(false); }}>Retake Quiz</button>
      </div>
    );
  }

  return (
    <div className="quiz-lab" style={{padding: '2rem', maxWidth: '800px', margin: '0 auto', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
      <div className="glass-panel" style={{padding: '3rem', borderRadius: '16px', border: '1px solid var(--border-color)'}}>
        <div className="quiz-header">
          <span className="q-topic">{currentQ.topic}</span>
          <span className="q-progress">Question {currentIndex + 1} of {questions.length}</span>
        </div>
        
        <h3 className="q-text">{currentQ.text}</h3>

        <div className="options-grid">
          {currentQ.options.map(opt => (
            <button 
              key={opt}
              className={`option-btn ${selected === opt ? 'selected' : ''} ${showResult && opt === currentQ.correct ? 'correct' : ''} ${showResult && selected === opt && selected !== currentQ.correct ? 'wrong' : ''}`}
              onClick={() => !showResult && setSelected(opt)}
              disabled={showResult}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="quiz-footer">
          {!showResult ? (
            <button className="primary-btn" disabled={!selected} onClick={() => setShowResult(true)}>Check Answer</button>
          ) : (
            <button className="primary-btn" onClick={handleNext}>{currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}</button>
          )}
        </div>
      </div>

      <style>{`
        .quiz-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 2rem;
          font-size: 0.9rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .q-topic { color: var(--accent-purple); font-weight: 600; }
        .q-text { font-size: 1.5rem; margin-bottom: 2rem; line-height: 1.4; }
        
        .options-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2.5rem;
        }
        .option-btn {
          background: rgba(255,255,255,0.02);
          border: 1px solid var(--border-color);
          padding: 1.2rem;
          border-radius: 12px;
          color: white;
          font-size: 1.1rem;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s;
        }
        .option-btn:hover:not(:disabled) {
          background: rgba(255,255,255,0.05);
        }
        .option-btn.selected {
          background: rgba(139, 92, 246, 0.1);
          border-color: var(--accent-purple);
        }
        .option-btn.correct {
          background: rgba(16, 185, 129, 0.2);
          border-color: var(--accent-green);
        }
        .option-btn.wrong {
          background: rgba(239, 68, 68, 0.2);
          border-color: #ef4444;
          opacity: 0.5;
        }

        .quiz-footer {
          display: flex;
          justify-content: flex-end;
        }
        .primary-btn {
          background: var(--accent-purple);
          color: white;
          border: none;
          padding: 0.8rem 2rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
        }
        .primary-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
    </div>
  );
}
