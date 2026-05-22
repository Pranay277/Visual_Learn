import React, { useState } from 'react';

const knownReactions = [
  { r1: 'Na', r2: 'Cl2', eq: '2Na + Cl₂ → 2NaCl', type: 'Synthesis', desc: 'Sodium reacts vigorously with chlorine gas to form sodium chloride.' },
  { r1: 'H2', r2: 'O2', eq: '2H₂ + O₂ → 2H₂O', type: 'Combustion / Synthesis', desc: 'Hydrogen burns in oxygen to form water.' },
  { r1: 'HCl', r2: 'NaOH', eq: 'HCl + NaOH → NaCl + H₂O', type: 'Neutralization', desc: 'An acid and a base neutralize to form salt and water.' },
  { r1: 'AgNO3', r2: 'NaCl', eq: 'AgNO₃ + NaCl → AgCl↓ + NaNO₃', type: 'Double Displacement', desc: 'Forms a white precipitate of Silver Chloride.' }
];

const availableReactants = ['Na', 'Cl2', 'H2', 'O2', 'HCl', 'NaOH', 'AgNO3', 'NaCl'];

export default function ReactionLab() {
  const [reactant1, setReactant1] = useState('Na');
  const [reactant2, setReactant2] = useState('Cl2');
  const [result, setResult] = useState(null);

  const handleMix = () => {
    const reaction = knownReactions.find(
      r => (r.r1 === reactant1 && r.r2 === reactant2) || (r.r1 === reactant2 && r.r2 === reactant1)
    );
    
    if (reaction) {
      setResult(reaction);
    } else {
      setResult({ error: true, msg: 'No reaction occurs between these two under standard conditions.' });
    }
  };

  return (
    <div className="reaction-lab">
      <div className="lab-header glass-panel">
        <h2>Interactive Reaction Simulator</h2>
        <p>Mix common reagents to observe their chemical interactions.</p>
      </div>

      <div className="bench-container glass-panel">
        <div className="beakers-area">
          <div className="beaker">
            <select value={reactant1} onChange={e => {setReactant1(e.target.value); setResult(null);}}>
              {availableReactants.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="plus-sign">+</div>
          <div className="beaker">
            <select value={reactant2} onChange={e => {setReactant2(e.target.value); setResult(null);}}>
              {availableReactants.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>

        <button className="mix-btn" onClick={handleMix}>Simulate Reaction</button>

        {result && (
          <div className={`result-card ${result.error ? 'error' : 'success'}`}>
            {result.error ? (
              <p>{result.msg}</p>
            ) : (
              <>
                <h3 className="equation">{result.eq}</h3>
                <div className="reaction-type">{result.type}</div>
                <p className="desc">{result.desc}</p>
              </>
            )}
          </div>
        )}
      </div>
      <style>{`
        .reaction-lab {
          padding: 2rem;
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .lab-header {
          padding: 1.5rem 2rem;
          border-radius: 12px;
          border: 1px solid var(--border-color);
        }
        .bench-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3rem;
          border-radius: 12px;
          border: 1px solid var(--border-color);
          background: rgba(20, 20, 30, 0.4);
        }
        .beakers-area {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        .beaker select {
          background: var(--bg-card);
          color: white;
          border: 2px solid var(--accent-purple);
          padding: 1rem 2rem;
          font-size: 1.5rem;
          border-radius: 12px;
          outline: none;
          min-width: 150px;
          text-align: center;
          cursor: pointer;
        }
        .plus-sign {
          font-size: 3rem;
          color: var(--text-muted);
          font-weight: 300;
        }
        .mix-btn {
          background: var(--accent-purple);
          color: white;
          border: none;
          padding: 1rem 3rem;
          font-size: 1.1rem;
          border-radius: 30px;
          cursor: pointer;
          font-weight: 600;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .mix-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px var(--accent-purple-glow);
        }
        .result-card {
          padding: 2rem;
          border-radius: 12px;
          text-align: center;
          min-width: 400px;
          border: 1px solid var(--border-color);
          background: var(--bg-card);
          animation: slideUp 0.3s ease-out;
        }
        .result-card.success { border-color: var(--accent-green); }
        .result-card.error { border-color: #ef4444; }
        
        .equation { font-size: 2rem; margin-bottom: 0.5rem; color: white; }
        .reaction-type {
          display: inline-block;
          background: rgba(16, 185, 129, 0.2);
          color: var(--accent-green);
          padding: 0.3rem 0.8rem;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        .desc { color: var(--text-muted); line-height: 1.5; }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
