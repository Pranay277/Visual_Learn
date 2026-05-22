import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import MoleculeModel from './MoleculeModel';
import { moleculesData } from '../data/chemistryData';
import { Settings2 } from 'lucide-react';

export default function VSEPRLab() {
  const [activeMoleculeId, setActiveMoleculeId] = useState('water');
  const activeMolecule = moleculesData[activeMoleculeId];

  return (
    <div className="molecule-viewer">
      
      {/* Top Header inside Viewer */}
      <div className="viewer-header">
        <h2 className="mol-formula">{activeMolecule.formula}</h2>
        <span className="mol-name">{activeMolecule.name.split(' ')[0]}</span>
        <span className="mol-category">Inorganic Chemistry <span style={{color:'var(--text-muted)'}}>› Structure</span></span>
        
        <div className="header-actions">
          <select 
            value={activeMoleculeId} 
            onChange={e => setActiveMoleculeId(e.target.value)}
            className="mol-select"
          >
            {Object.values(moleculesData).map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
          <div className="stats-pill">
            <span>{activeMolecule.atoms.length} Atoms</span>
            <span>{activeMolecule.bonds.length} Bonds</span>
          </div>
          <button className="icon-btn"><Settings2 size={18}/></button>
        </div>
      </div>

      <div className="viewer-content">
        
        {/* 3D Canvas */}
        <div className="canvas-wrapper glass-panel">
          <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 10]} intensity={1.5} />
            <Suspense fallback={null}>
              <Environment preset="city" />
              <MoleculeModel moleculeData={activeMolecule} />
            </Suspense>
            <OrbitControls minDistance={3} maxDistance={12} enablePan={true} />
          </Canvas>
          <div className="canvas-footer">
            Click atom to inspect • Drag to orbit • Scroll to zoom • Right-drag to pan
          </div>
        </div>

        {/* Right Inspector Panel */}
        <div className="inspector-panel glass-panel">
          <div className="inspector-hint">Click an atom to inspect</div>
          
          <div className="inspector-section">
            <h3>ATOMS · {activeMolecule.atoms.length}</h3>
            <div className="item-list">
              {activeMolecule.atoms.map(a => (
                <div key={a.id} className="list-item">
                  <div className="color-dot" style={{ background: a.color }}></div>
                  <span className="item-name">{a.element}</span>
                  <span className="item-desc">{a.id.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="inspector-section">
            <h3>BONDS · {activeMolecule.bonds.length}</h3>
            <div className="item-list">
              {activeMolecule.bonds.map((b, i) => {
                const s = activeMolecule.atoms.find(a => a.id === b.source);
                const t = activeMolecule.atoms.find(a => a.id === b.target);
                return (
                  <div key={i} className="list-item">
                    <div className="bond-line"></div>
                    <span className="item-name">{s.element} - {t.element}</span>
                    <span className="item-desc">cov.</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="inspector-section">
            <h3>LEGEND</h3>
            <div className="legend-item"><div className="bond-line"></div> Covalent bond</div>
            <div className="legend-item"><div className="bond-line ionic"></div> Ionic bond</div>
            <div className="legend-item"><div className="color-dot border"></div> Selected atom</div>
          </div>

          <div className="category-card">
            <h4>Inorganic Chemistry</h4>
            <p>Non-carbon and metal compounds</p>
          </div>
        </div>
      </div>

      <style>{`
        .molecule-viewer {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 1.5rem 2rem;
          gap: 1.5rem;
        }

        .viewer-header {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .mol-formula { font-size: 1.8rem; font-weight: 700; color: white; }
        .mol-name { font-size: 1.1rem; color: var(--text-muted); }
        .mol-category { font-size: 0.9rem; color: var(--accent-blue); margin-left: 0.5rem;}

        .header-actions {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .mol-select {
          background: var(--bg-card);
          color: white;
          border: 1px solid var(--border-color);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          outline: none;
        }

        .stats-pill {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
          padding: 0.4rem 1rem;
          border-radius: 20px;
          display: flex;
          gap: 1rem;
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .icon-btn {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          color: var(--text-muted);
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        }

        .viewer-content {
          flex: 1;
          display: flex;
          gap: 1.5rem;
          overflow: hidden;
        }

        .canvas-wrapper {
          flex: 1;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          position: relative;
        }

        .canvas-footer {
          position: absolute;
          bottom: 1rem;
          left: 0;
          width: 100%;
          text-align: center;
          font-size: 0.75rem;
          color: var(--text-muted);
          pointer-events: none;
        }

        .inspector-panel {
          width: 280px;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          padding: 1.5rem;
          overflow-y: auto;
        }

        .inspector-hint {
          text-align: center;
          padding: 0.8rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 2rem;
        }

        .inspector-section {
          margin-bottom: 2rem;
        }

        .inspector-section h3 {
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          color: var(--text-muted);
          margin-bottom: 1rem;
        }

        .item-list {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .list-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 0.9rem;
        }

        .color-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .color-dot.border {
          background: transparent;
          border: 2px solid white;
        }

        .bond-line {
          width: 16px;
          height: 4px;
          background: #64748b;
          border-radius: 2px;
        }

        .bond-line.ionic {
          background: #f59e0b;
        }

        .item-name { flex: 1; font-weight: 500; }
        .item-desc { color: var(--text-muted); font-size: 0.8rem; }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 0.8rem;
        }

        .category-card {
          margin-top: auto;
          background: rgba(59, 130, 246, 0.05);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 8px;
          padding: 1rem;
        }

        .category-card h4 { color: var(--accent-blue); font-size: 0.85rem; margin-bottom: 0.25rem; }
        .category-card p { color: var(--text-muted); font-size: 0.8rem; line-height: 1.4; }
      `}</style>
    </div>
  );
}
