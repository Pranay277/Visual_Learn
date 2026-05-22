import React, { useState, useMemo } from 'react';
import { elementsData, groupColors } from '../data/periodicTableData';

export default function TrendsLab() {
  const [property, setProperty] = useState('electronegativity');
  
  const validElements = useMemo(() => {
    return elementsData.filter(e => e[property] !== null && e[property] !== undefined);
  }, [property]);

  const maxVal = Math.max(...validElements.map(e => e[property]));
  const minVal = Math.min(...validElements.map(e => e[property]));

  return (
    <div className="trends-lab">
      <div className="trends-header glass-panel">
        <div>
          <h2>Periodic Trends</h2>
          <p>Visualize elemental properties across the periodic table.</p>
        </div>
        <select value={property} onChange={e => setProperty(e.target.value)} className="trend-select">
          <option value="electronegativity">Electronegativity (Pauling)</option>
          <option value="ionization">First Ionization Energy (kJ/mol)</option>
          <option value="mass">Atomic Mass (u)</option>
        </select>
      </div>

      <div className="chart-container glass-panel">
        <div className="y-axis">
          <span>{maxVal.toFixed(1)}</span>
          <span>{((maxVal + minVal) / 2).toFixed(1)}</span>
          <span>{minVal.toFixed(1)}</span>
        </div>
        <div className="chart-area">
          {validElements.map(el => {
            const heightPercent = ((el[property] - minVal) / (maxVal - minVal)) * 100;
            return (
              <div 
                key={el.atomic} 
                className="chart-bar"
                style={{ 
                  left: `${(el.atomic / 118) * 100}%`,
                  height: `${heightPercent}%`,
                  backgroundColor: groupColors[el.group] || 'var(--accent-purple)'
                }}
                title={`${el.name} (${el.symbol}): ${el[property]}`}
              >
                <div className="bar-label">{el.symbol}</div>
              </div>
            );
          })}
        </div>
        <div className="x-axis">
          Atomic Number (1 - 118)
        </div>
      </div>
      
      <style>{`
        .trends-lab {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 2rem;
          gap: 2rem;
        }
        .trends-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--bg-card);
          padding: 1.5rem;
          border-radius: 12px;
          border: 1px solid var(--border-color);
        }
        .trends-header h2 { font-size: 1.5rem; margin-bottom: 0.25rem; }
        .trends-header p { color: var(--text-muted); font-size: 0.9rem; }
        .trend-select {
          background: var(--bg-dark);
          color: white;
          border: 1px solid var(--border-color);
          padding: 0.75rem 1rem;
          border-radius: 8px;
          outline: none;
        }
        .chart-container {
          flex: 1;
          background: var(--bg-card);
          border-radius: 12px;
          border: 1px solid var(--border-color);
          padding: 2rem;
          display: grid;
          grid-template-columns: 50px 1fr;
          grid-template-rows: 1fr 30px;
          gap: 1rem;
        }
        .y-axis {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          color: var(--text-muted);
          font-size: 0.8rem;
          text-align: right;
          padding-right: 1rem;
          border-right: 1px solid var(--border-color);
        }
        .chart-area {
          position: relative;
          width: 100%;
          height: 100%;
          border-bottom: 1px solid var(--border-color);
        }
        .chart-bar {
          position: absolute;
          bottom: 0;
          width: 6px;
          border-radius: 3px 3px 0 0;
          transition: height 0.5s ease-out;
          cursor: pointer;
        }
        .chart-bar:hover {
          filter: brightness(1.5);
          z-index: 10;
        }
        .bar-label {
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.65rem;
          color: var(--text-muted);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .chart-bar:hover .bar-label {
          opacity: 1;
          color: white;
        }
        .x-axis {
          grid-column: 2;
          text-align: center;
          color: var(--text-muted);
          font-size: 0.85rem;
          padding-top: 0.5rem;
        }
      `}</style>
    </div>
  );
}
