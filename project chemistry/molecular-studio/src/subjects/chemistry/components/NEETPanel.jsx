import React from 'react';
import { moleculesData } from '../data/chemistryData';
import { BookOpen, GraduationCap } from 'lucide-react';

export default function NEETPanel({ activeMolecule }) {
  const data = moleculesData[activeMolecule];

  return (
    <div className="neet-panel glass-panel">
      <div className="neet-header">
        <GraduationCap className="neet-icon" size={24} />
        <h2>NEET Context</h2>
      </div>

      <div className="neet-stats">
        <div className="stat-row">
          <span className="stat-label">Formula</span>
          <span className="stat-value">{data.formula}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Hybridization</span>
          <span className="stat-value">{data.hybridization}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Geometry</span>
          <span className="stat-value">{data.geometry}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Bond Angle</span>
          <span className="stat-value">{data.bondAngle}</span>
        </div>
      </div>

      <div className="neet-fact-box">
        <h4><BookOpen size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} /> Examiner's Note</h4>
        <p>{data.neetFact}</p>
      </div>
    </div>
  );
}
