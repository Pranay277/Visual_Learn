import React from 'react';
import { useUserProgress } from '../context/UserProgressContext';

export default function Dashboard({ setActiveLab }) {
  const { topicScores } = useUserProgress();
  
  // Calculate performance
  const topics = Object.entries(topicScores).map(([name, data]) => {
    const percentage = data.total > 0 ? (data.correct / data.total) * 100 : 0;
    return { name, percentage, ...data };
  });

  const strongTopics = topics.filter(t => t.percentage >= 70);
  const weakTopics = topics.filter(t => t.percentage < 70 && t.total > 0);

  return (
    <div className="dashboard">
      <div className="hero-section glass-panel">
        <h1>Welcome back, Scholar.</h1>
        <p>Your personalized NEET Chemistry dashboard.</p>
        <div className="hero-stats">
          <div className="stat"><span>118</span> Elements Mastered</div>
          <div className="stat"><span>6</span> Labs Active</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="performance-panel glass-panel">
          <h3>Performance Analytics</h3>
          
          <div className="perf-section">
            <h4 className="success-text">Strong Topics (≥70%)</h4>
            {strongTopics.length === 0 ? <p className="empty-text">Keep practicing to build strong topics!</p> : strongTopics.map(t => (
              <div key={t.name} className="topic-bar">
                <div className="topic-info">
                  <span>{t.name}</span>
                  <span>{Math.round(t.percentage)}%</span>
                </div>
                <div className="progress-bg"><div className="progress-fill success" style={{width: `${t.percentage}%`}}></div></div>
              </div>
            ))}
          </div>

          <div className="perf-section">
            <h4 className="error-text">Needs Improvement</h4>
            {weakTopics.length === 0 ? <p className="empty-text">No weak topics! You're doing great.</p> : weakTopics.map(t => (
              <div key={t.name} className="topic-bar">
                <div className="topic-info">
                  <span>{t.name}</span>
                  <span>{Math.round(t.percentage)}%</span>
                </div>
                <div className="progress-bg"><div className="progress-fill error" style={{width: `${t.percentage}%`}}></div></div>
              </div>
            ))}
          </div>
        </div>

        <div className="ai-suggestions glass-panel">
          <h3>AI Study Suggestions</h3>
          <div className="suggestion-list">
            {weakTopics.map(t => (
               <div key={t.name} className="suggestion-card">
                 <div className="s-icon">⚠️</div>
                 <div className="s-content">
                   <h4>Review {t.name}</h4>
                   <p>Your score is {Math.round(t.percentage)}%. We highly recommend watching a quick one-shot lecture to clear your concepts.</p>
                   <div className="s-actions-row">
                     <button onClick={() => setActiveLab('favorites')} className="s-action outline">Review Mistakes</button>
                     <a href={`https://www.youtube.com/results?search_query=NEET+${encodeURIComponent(t.name)}+Chemistry+One+Shot`} target="_blank" rel="noreferrer" className="s-action primary">
                       ▶ Watch Lecture
                     </a>
                   </div>
                 </div>
               </div>
            ))}
            {weakTopics.length === 0 && (
              <div className="suggestion-card success">
                <div className="s-icon">🌟</div>
                <div className="s-content">
                  <h4>All caught up!</h4>
                  <p>You are mastering all topics. Try taking another Quiz to test your limits.</p>
                  <button onClick={() => setActiveLab('quiz')} className="s-action">Take Quiz</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style>{`
        .dashboard { padding: 2rem; display: flex; flex-direction: column; gap: 2rem; height: 100%; overflow-y: auto; }
        .hero-section { padding: 3rem; border-radius: 16px; background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(20, 20, 30, 0.4) 100%); border: 1px solid var(--border-color); }
        .hero-section h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
        .hero-section p { color: var(--text-muted); font-size: 1.1rem; margin-bottom: 2rem; }
        .hero-stats { display: flex; gap: 2rem; }
        .stat { background: rgba(255,255,255,0.05); padding: 1rem 2rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); color: var(--text-muted); font-size: 0.9rem; }
        .stat span { color: white; font-size: 1.5rem; font-weight: 700; margin-right: 0.5rem; }
        
        .dashboard-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        .performance-panel, .ai-suggestions { padding: 2rem; border-radius: 16px; border: 1px solid var(--border-color); background: var(--bg-card); }
        h3 { font-size: 1.2rem; margin-bottom: 1.5rem; color: white; }
        
        .perf-section { margin-bottom: 2rem; }
        .success-text { color: var(--accent-green); margin-bottom: 1rem; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .error-text { color: #ef4444; margin-bottom: 1rem; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .empty-text { color: var(--text-muted); font-size: 0.9rem; font-style: italic; }
        
        .topic-bar { margin-bottom: 1rem; }
        .topic-info { display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 0.5rem; }
        .progress-bg { height: 8px; background: rgba(255,255,255,0.05); border-radius: 4px; overflow: hidden; }
        .progress-fill { height: 100%; border-radius: 4px; transition: width 1s ease-out; }
        .progress-fill.success { background: var(--accent-green); }
        .progress-fill.error { background: #ef4444; }

        .suggestion-list { display: flex; flex-direction: column; gap: 1rem; }
        .suggestion-card { display: flex; gap: 1.5rem; padding: 1.5rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); border-radius: 12px; align-items: flex-start; }
        .suggestion-card.success { border-color: rgba(16, 185, 129, 0.3); }
        .s-icon { font-size: 2rem; }
        .s-content h4 { margin-bottom: 0.5rem; font-size: 1.1rem; }
        .s-content p { color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1rem; line-height: 1.4; }
        .s-actions-row { display: flex; gap: 1rem; }
        .s-action { text-decoration: none; border: none; padding: 0.6rem 1rem; border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: 600; display: inline-flex; align-items: center; justify-content: center;}
        .s-action.primary { background: #ef4444; color: white; } /* YouTube Red */
        .s-action.primary:hover { background: #dc2626; }
        .s-action.outline { background: transparent; color: var(--text-muted); border: 1px solid var(--border-color); }
        .s-action.outline:hover { color: white; border-color: white; }
      `}</style>
    </div>
  );
}
