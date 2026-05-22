import React, { useState } from 'react';
import { elementsData, groupColors } from '../data/periodicTableData';

export default function CompareLab() {
  const [el1, setEl1] = useState(elementsData[0]); // H
  const [el2, setEl2] = useState(elementsData[1]); // He

  const renderStat = (label, prop, unit = '') => {
    const val1 = el1[prop] || 0;
    const val2 = el2[prop] || 0;
    
    return (
      <div className="compare-row">
        <div className="row-label">{label}</div>
        <div className="bars-container">
          <div className="bar-wrapper">
            <div 
              className="stat-bar" 
              style={{ 
                width: `${val1 >= val2 ? '100%' : (val1/val2 * 100)}%`,
                backgroundColor: groupColors[el1.group] || 'gray'
              }}
            />
            <span className="stat-val">{val1} {unit}</span>
          </div>
          <div className="bar-wrapper reverse">
            <div 
              className="stat-bar" 
              style={{ 
                width: `${val2 >= val1 ? '100%' : (val2/val1 * 100)}%`,
                backgroundColor: groupColors[el2.group] || 'gray'
              }}
            />
            <span className="stat-val">{val2} {unit}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="compare-lab">
      <div className="compare-header">
        <select value={el1.atomic} onChange={e => setEl1(elementsData.find(el => el.atomic == e.target.value))}>
          {elementsData.map(e => <option key={e.atomic} value={e.atomic}>{e.name}</option>)}
        </select>
        
        <div className="vs-badge">VS</div>
        
        <select value={el2.atomic} onChange={e => setEl2(elementsData.find(el => el.atomic == e.target.value))}>
          {elementsData.map(e => <option key={e.atomic} value={e.atomic}>{e.name}</option>)}
        </select>
      </div>

      <div className="compare-content glass-panel">
        <div className="el-hero left">
          <h1 style={{color: groupColors[el1.group]}}>{el1.symbol}</h1>
          <p>{el1.name}</p>
        </div>
        
        <div className="stats-center">
          {renderStat('Atomic Mass', 'mass', 'u')}
          {renderStat('Electronegativity', 'electronegativity')}
          {renderStat('Ionization Energy', 'ionization', 'kJ/mol')}
          {renderStat('Protons/Electrons', 'atomic')}
        </div>

        <div className="el-hero right">
          <h1 style={{color: groupColors[el2.group]}}>{el2.symbol}</h1>
          <p>{el2.name}</p>
        </div>
      </div>

      <style>{`
        .compare-lab {
          padding: 2rem;
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .compare-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--bg-card);
          padding: 1.5rem 2rem;
          border-radius: 12px;
          border: 1px solid var(--border-color);
        }
        .compare-header select {
          background: var(--bg-dark);
          color: white;
          border: 1px solid var(--border-color);
          padding: 0.8rem 1.5rem;
          border-radius: 8px;
          font-size: 1.1rem;
          outline: none;
          min-width: 200px;
        }
        .vs-badge {
          background: var(--accent-purple);
          color: white;
          font-weight: 800;
          font-size: 1.2rem;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px var(--accent-purple-glow);
        }
        .compare-content {
          flex: 1;
          background: var(--bg-card);
          border-radius: 12px;
          border: 1px solid var(--border-color);
          display: grid;
          grid-template-columns: 200px 1fr 200px;
          align-items: center;
          padding: 2rem;
        }
        .el-hero { text-align: center; }
        .el-hero h1 { font-size: 5rem; line-height: 1; }
        .el-hero p { color: var(--text-muted); font-size: 1.2rem; margin-top: 0.5rem;}
        
        .stats-center {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          padding: 0 2rem;
        }
        .compare-row {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .row-label {
          text-align: center;
          color: var(--text-muted);
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .bars-container {
          display: flex;
          gap: 2rem;
        }
        .bar-wrapper {
          flex: 1;
          position: relative;
          height: 30px;
          background: rgba(255,255,255,0.02);
          border-radius: 15px;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .bar-wrapper.reverse {
          justify-content: flex-end;
        }
        .stat-bar {
          height: 100%;
          border-radius: 15px;
          transition: width 0.5s ease-out;
        }
        .bar-wrapper.reverse .stat-bar {
          margin-left: auto;
        }
        .stat-val {
          position: absolute;
          left: 1rem;
          font-size: 0.85rem;
          font-weight: 600;
        }
        .bar-wrapper.reverse .stat-val {
          left: auto;
          right: 1rem;
        }
      `}</style>
    </div>
  );
}
