import React from 'react';
import { moleculesData } from '../data/chemistryData';
import { Beaker } from 'lucide-react';

export default function UIControls({ activeMolecule, setActiveMolecule, isSpaceFilling, setIsSpaceFilling }) {
  return (
    <div className="controls-panel glass-panel">
      <div className="controls-section">
        <h3><Beaker size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} /> Molecule Selection</h3>
        {Object.values(moleculesData).map((molecule) => (
          <button
            key={molecule.id}
            className={`molecule-btn ${activeMolecule === molecule.id ? 'active' : ''}`}
            onClick={() => setActiveMolecule(molecule.id)}
          >
            <span>{molecule.name}</span>
          </button>
        ))}
      </div>

      <div className="controls-section">
        <h3>Rendering Mode</h3>
        <div className="toggle-container" onClick={() => setIsSpaceFilling(!isSpaceFilling)}>
          <span className="toggle-label">Ball & Stick</span>
          <div className={`toggle-switch ${isSpaceFilling ? 'active' : ''}`}>
            <div className="toggle-knob"></div>
          </div>
          <span className="toggle-label" style={{ opacity: isSpaceFilling ? 1 : 0.5 }}>Space Filling</span>
        </div>
      </div>
    </div>
  );
}
