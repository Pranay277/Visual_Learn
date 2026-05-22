import React, { useState } from 'react';
import { elementsData, groupColors } from '../data/periodicTableData';

export default function PeriodicTableLab() {
  const [selectedElement, setSelectedElement] = useState(elementsData[0]);

  return (
    <div className="periodic-lab">
      {/* 2D Periodic Table Grid */}
      <div className="pt-grid glass-panel">
        {elementsData.map((element) => (
          <div
            key={element.atomic}
            className={`element-card ${selectedElement.atomic === element.atomic ? 'selected' : ''}`}
            style={{
              gridColumn: element.col,
              gridRow: element.row,
              borderColor: groupColors[element.group],
              boxShadow: selectedElement.atomic === element.atomic ? `0 0 15px ${groupColors[element.group]}` : 'none'
            }}
            onClick={() => setSelectedElement(element)}
          >
            <span className="atomic-number">{element.atomic}</span>
            <strong className="symbol">{element.symbol}</strong>
            <span className="mass">{element.mass.toFixed(1)}</span>
          </div>
        ))}
      </div>

      {/* Element Detail Panel */}
      <div className="element-detail glass-panel" style={{ borderTop: `4px solid ${groupColors[selectedElement.group]}` }}>
        <div className="detail-header">
          <div className="huge-symbol" style={{ color: groupColors[selectedElement.group] }}>
            {selectedElement.symbol}
          </div>
          <div>
            <h2>{selectedElement.name}</h2>
            <p style={{ textTransform: 'uppercase', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {selectedElement.group}
            </p>
          </div>
        </div>

        <div className="detail-stats">
          <div className="stat-item">
            <label>Atomic No.</label>
            <span>{selectedElement.atomic}</span>
          </div>
          <div className="stat-item">
            <label>Atomic Mass</label>
            <span>{selectedElement.mass} u</span>
          </div>
          <div className="stat-item">
            <label>Electron Config</label>
            <span style={{ color: 'var(--accent-primary)' }}>{selectedElement.config}</span>
          </div>
        </div>

        <div className="neet-fact-box" style={{ marginTop: '1.5rem', background: 'rgba(59, 130, 246, 0.1)', borderLeftColor: '#3b82f6' }}>
          <h4 style={{ color: '#3b82f6' }}>NEET Focus</h4>
          <p>Questions often test the exceptional electron configurations, ionization energy trends across periods, and atomic radius variations down a group.</p>
        </div>
      </div>

      <style>{`
        .periodic-lab {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 6rem 2rem 2rem;
          gap: 1rem;
          overflow-y: auto;
        }

        .pt-grid {
          display: grid;
          grid-template-columns: repeat(18, 45px);
          grid-template-rows: repeat(10, 45px);
          gap: 4px;
          padding: 1rem;
        }

        .element-card {
          background: rgba(20, 20, 30, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          padding: 4px;
        }

        .element-card:hover {
          transform: scale(1.1);
          z-index: 10;
        }

        .atomic-number {
          font-size: 0.6rem;
          color: var(--text-secondary);
          align-self: flex-start;
        }

        .symbol {
          font-size: 1.2rem;
          font-weight: 700;
        }

        .mass {
          font-size: 0.5rem;
          color: var(--text-secondary);
        }

        .element-detail {
          width: 500px;
          padding: 2rem;
        }

        .detail-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .huge-symbol {
          font-size: 4rem;
          font-weight: 700;
          line-height: 1;
        }

        .detail-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          background: rgba(255, 255, 255, 0.05);
          padding: 1rem;
          border-radius: 8px;
        }

        .stat-item label {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
        }

        .stat-item span {
          font-size: 1.1rem;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
