import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import AtomicModel from './AtomicModel';
import { elementsData, groupColors } from '../data/periodicTableData';
import { Search } from 'lucide-react';

export default function AtomicLab() {
  const [selectedElement, setSelectedElement] = useState(elementsData[0]); // Hydrogen
  const [searchQuery, setSearchQuery] = useState('');

  const filteredElements = elementsData.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="atom-lab">
      {/* Middle Pane: Element List */}
      <div className="element-list-pane">
        <div className="pane-header">
          <h2>Atom Shell Visualizer</h2>
          <p>Bohr-style educational electron shell diagrams for all 118 elements.</p>
        </div>
        
        <div className="list-container glass-panel">
          <div className="search-bar">
            <Search size={16} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search element..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="scroll-list">
            {filteredElements.map(el => (
              <div 
                key={el.atomic} 
                className={`list-item ${selectedElement.atomic === el.atomic ? 'selected' : ''}`}
                onClick={() => setSelectedElement(el)}
              >
                <span className="el-symbol" style={{ color: groupColors[el.group] || 'white' }}>{el.symbol}</span>
                <span className="el-name">{el.name}</span>
                <span className="el-atomic">{el.atomic}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Pane: Visualizer & Stats */}
      <div className="visualizer-pane">
        <div className="canvas-wrapper glass-panel">
           <Canvas camera={{ position: [0, 8, 12], fov: 45 }}>
             <ambientLight intensity={0.5} />
             <Environment preset="city" />
             <Suspense fallback={null}>
               <AtomicModel 
                 protons={selectedElement.atomic} 
                 neutrons={Math.round(selectedElement.mass) - selectedElement.atomic} 
                 electrons={selectedElement.atomic} 
               />
             </Suspense>
             <OrbitControls enablePan={false} autoRotate={false} minDistance={5} maxDistance={25}/>
           </Canvas>
        </div>
        
        <div className="element-hero">
          <h1 style={{ color: groupColors[selectedElement.group] || 'white' }}>{selectedElement.name}</h1>
          <p>{selectedElement.symbol} • Atomic Number {selectedElement.atomic}</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="label">Electron Config.</span>
            <span className="value">{selectedElement.config}</span>
          </div>
          <div className="stat-card">
            <span className="label">Atomic Mass</span>
            <span className="value">{selectedElement.mass.toFixed(3)} u</span>
          </div>
          <div className="stat-card">
            <span className="label">Total Electrons</span>
            <span className="value">{selectedElement.atomic}</span>
          </div>
          <div className="stat-card">
            <span className="label">Category</span>
            <span className="value" style={{ color: groupColors[selectedElement.group], textTransform: 'capitalize' }}>
              {selectedElement.group}
            </span>
          </div>
        </div>
      </div>

      <style>{`
        .atom-lab {
          display: flex;
          height: 100%;
          padding: 2rem;
          gap: 2.5rem;
        }

        .element-list-pane {
          width: 320px;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .pane-header h2 { font-size: 1.4rem; margin-bottom: 0.5rem; }
        .pane-header p { color: var(--text-muted); font-size: 0.85rem; line-height: 1.4; }

        .list-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 12px;
        }

        .search-bar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          border-bottom: 1px solid var(--border-color);
          background: rgba(255, 255, 255, 0.02);
        }

        .search-bar input {
          background: transparent;
          border: none;
          color: white;
          outline: none;
          width: 100%;
          font-family: inherit;
        }

        .scroll-list {
          flex: 1;
          overflow-y: auto;
          padding: 0.5rem;
        }

        .list-item {
          display: flex;
          align-items: center;
          padding: 0.8rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .list-item:hover { background: rgba(255, 255, 255, 0.05); }
        .list-item.selected { background: rgba(139, 92, 246, 0.15); }

        .el-symbol { width: 35px; font-weight: 700; font-size: 1.1rem; }
        .el-name { flex: 1; font-weight: 500; font-size: 0.95rem; color: var(--text-main); }
        .el-atomic { color: var(--text-muted); font-size: 0.8rem; }

        .visualizer-pane {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .canvas-wrapper {
          flex: 1;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          position: relative;
        }

        .element-hero {
          text-align: center;
          padding: 0.5rem 0;
        }

        .element-hero h1 { font-size: 2rem; margin-bottom: 0.25rem; font-weight: 700; }
        .element-hero p { color: var(--text-muted); font-size: 0.9rem; letter-spacing: 0.05em; text-transform: uppercase;}

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .stat-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 1.2rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .stat-card .label { color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .stat-card .value { font-size: 1.1rem; font-weight: 600; color: var(--text-main); }
      `}</style>
    </div>
  );
}
