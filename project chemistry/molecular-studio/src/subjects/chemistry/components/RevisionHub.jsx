import React from 'react';
import { useUserProgress } from '../context/UserProgressContext';

export default function RevisionHub() {
  const { needsRevision, clearRevisionItem } = useUserProgress();

  return (
    <div className="revision-hub">
      <div className="hub-header glass-panel">
        <h2>Revision Hub</h2>
        <p>A smart list of hard topics and missed questions from your quizzes.</p>
      </div>

      <div className="hub-content">
        {needsRevision.length === 0 ? (
          <div className="empty-state glass-panel">
            <h3>All clear!</h3>
            <p>You haven't missed any questions yet. Take a quiz to test your knowledge.</p>
          </div>
        ) : (
          <div className="revision-list">
            {needsRevision.map((q) => (
              <div key={q.id} className="revision-card glass-panel">
                <div className="card-header">
                  <span className="topic-badge">{q.topic}</span>
                  <button className="clear-btn" onClick={() => clearRevisionItem(q.id)}>Mark as Mastered</button>
                </div>
                <h3 className="q-text">{q.text}</h3>
                <div className="q-feedback">
                  <div className="feedback-col">
                    <div className="feedback-item">
                      <span className="label">You answered:</span>
                      <span className="wrong-answer">{q.userSelect || 'Skipped/Mocked'}</span>
                    </div>
                    <div className="feedback-item">
                      <span className="label">Correct Answer:</span>
                      <span className="correct-answer">{q.correct}</span>
                    </div>
                  </div>
                  <a href={`https://www.youtube.com/results?search_query=NEET+${encodeURIComponent(q.topic)}+Chemistry+Tricks`} target="_blank" rel="noreferrer" className="yt-btn">
                    ▶ Watch Topic Lecture
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .revision-hub { padding: 2rem; height: 100%; display: flex; flex-direction: column; gap: 2rem; overflow-y: auto; }
        .hub-header { padding: 2rem; border-radius: 12px; border: 1px solid var(--border-color); background: var(--bg-card); }
        .hub-header h2 { font-size: 1.8rem; margin-bottom: 0.5rem; }
        .hub-header p { color: var(--text-muted); font-size: 1rem; }
        
        .empty-state { padding: 4rem; text-align: center; border-radius: 12px; border: 1px dashed var(--border-color); background: rgba(255,255,255,0.02); }
        .empty-state h3 { color: var(--accent-green); margin-bottom: 1rem; }
        
        .revision-list { display: flex; flex-direction: column; gap: 1.5rem; }
        .revision-card { padding: 1.5rem; border-radius: 12px; border: 1px solid #ef444433; background: rgba(239, 68, 68, 0.05); }
        
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .topic-badge { background: var(--accent-purple); color: white; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
        .clear-btn { background: transparent; color: var(--text-muted); border: 1px solid var(--text-muted); padding: 0.3rem 1rem; border-radius: 20px; font-size: 0.8rem; cursor: pointer; transition: all 0.2s; }
        .clear-btn:hover { border-color: var(--accent-green); color: var(--accent-green); }
        
        .q-text { font-size: 1.2rem; margin-bottom: 1.5rem; }
        .q-feedback { display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.2); padding: 1rem 1.5rem; border-radius: 8px; }
        .feedback-col { display: flex; gap: 3rem; }
        .feedback-item { display: flex; flex-direction: column; gap: 0.5rem; }
        .label { font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
        .wrong-answer { color: #ef4444; font-weight: 600; text-decoration: line-through; }
        .correct-answer { color: var(--accent-green); font-weight: 600; }
        
        .yt-btn {
          background: #ef4444;
          color: white;
          text-decoration: none;
          padding: 0.6rem 1.2rem;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          transition: background 0.2s;
        }
        .yt-btn:hover { background: #dc2626; }
      `}</style>
    </div>
  );
}
