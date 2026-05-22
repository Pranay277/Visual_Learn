import React, { useState, useContext } from 'react';
import { LuminaContext } from '../../App';

interface OrganicMolecule {
  id: string;
  name: string;
  iupac: string;
  formula: string;
  imagePath: string;
  category: string;
  description: string;
  function: string;
}

const ORGANIC_MOLECULES: OrganicMolecule[] = [
  {
    id: 'norepinephrine',
    name: 'Norepinephrine',
    iupac: '4-[(1R)-2-amino-1-hydroxyethyl]benzene-1,2-diol',
    formula: 'C8H11NO3',
    imagePath: '/assets/organic/norepinephrine.png',
    category: 'Neurotransmitter',
    description: 'Norepinephrine (also called noradrenaline) is both a hormone, produced by the adrenal glands, and a neurotransmitter, a chemical messenger which transmits signals across nerve endings in the body.',
    function: 'Increases heart rate and blood pumping from the heart. It also increases blood pressure and helps break down fat and increase blood sugar levels to provide more energy to the body (Fight or Flight response).'
  },
  {
    id: 'serotonin',
    name: 'Serotonin',
    iupac: '3-(2-aminoethyl)-1H-indol-5-ol',
    formula: 'C10H12N2O',
    imagePath: '/assets/organic/serotonin.png',
    category: 'Neurotransmitter',
    description: 'Serotonin is a monoamine neurotransmitter. Its biological function is complex and multifaceted, modulating mood, cognition, reward, learning, memory, and numerous physiological processes such as vomiting and vasoconstriction.',
    function: 'Primarily known as the "happy chemical", it regulates mood, happiness, and anxiety. Low levels are associated with depression, while optimal levels promote feelings of well-being.'
  },
  {
    id: 'dopamine',
    name: 'Dopamine',
    iupac: '4-(2-aminoethyl)benzene-1,2-diol',
    formula: 'C8H11NO2',
    imagePath: '/assets/organic/dopamine.png',
    category: 'Neurotransmitter',
    description: 'Dopamine is a neuromodulatory molecule that plays several important roles in cells. It is an organic chemical of the catecholamine and phenethylamine families.',
    function: 'Functions prominently in the brain\'s reward system. It mediates pleasure in the brain, functioning as both a neurotransmitter and a neurohormone.'
  }
];

export default function OrganicCompounds() {
  const [selectedMol, setSelectedMol] = useState<OrganicMolecule>(ORGANIC_MOLECULES[0]);
  const { updateContext, setDrawerOpen } = useContext(LuminaContext) || {};

  const handleSelect = (mol: OrganicMolecule) => {
    setSelectedMol(mol);
    if (updateContext) {
      updateContext({
        module: 'Chemistry',
        model_id: 'organic_structures',
        selected_component: mol.name,
        current_lesson: 'Organic Chemistry: Skeletal Structures',
        student_action: 'Looking at the 2D skeletal structure of ' + mol.name
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-6 overflow-hidden">
      <div className="mb-6 flex justify-between items-end shrink-0">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-wide">Organic Structures</h2>
          <p className="text-gray-400 mt-1">Explore 2D skeletal formulas of complex biological molecules</p>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Gallery Selection List */}
        <div className="w-72 shrink-0 bg-gray-900/80 rounded-2xl border border-gray-700/50 p-4 shadow-2xl flex flex-col overflow-y-auto custom-scrollbar">
          <div className="text-xs font-bold uppercase text-gray-500 mb-4 px-2 tracking-wider">Compound Gallery</div>
          <div className="flex flex-col gap-2">
            {ORGANIC_MOLECULES.map(mol => (
              <button
                key={mol.id}
                onClick={() => handleSelect(mol)}
                className={`text-left px-4 py-3 rounded-xl border transition-all ${
                  selectedMol.id === mol.id 
                    ? 'bg-blue-600/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                    : 'bg-black/40 border-gray-800 hover:border-gray-600 hover:bg-black/60'
                }`}
              >
                <div className={`font-bold ${selectedMol.id === mol.id ? 'text-white' : 'text-gray-300'}`}>{mol.name}</div>
                <div className={`text-xs mt-1 ${selectedMol.id === mol.id ? 'text-blue-300' : 'text-gray-500'}`}>{mol.category}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Viewer Panel */}
        <div className="flex-1 bg-gray-900/80 rounded-2xl border border-gray-700/50 p-8 shadow-2xl flex flex-col overflow-y-auto custom-scrollbar">
          <div className="flex items-start justify-between mb-8 shrink-0">
            <div>
              <div className="inline-block px-3 py-1 bg-blue-900/30 rounded-lg text-xs font-bold text-blue-400 uppercase tracking-wider w-fit mb-4 border border-blue-800/50">
                {selectedMol.category}
              </div>
              <h3 className="text-4xl font-black text-white mb-2">{selectedMol.name}</h3>
              <div className="text-gray-400 font-mono text-sm">{selectedMol.iupac}</div>
            </div>
            <div className="bg-gray-800/80 px-6 py-3 rounded-xl border border-gray-700 flex flex-col items-center justify-center">
              <span className="text-xs text-gray-500 font-bold uppercase mb-1">Formula</span>
              <span className="text-xl text-white font-bold tracking-widest">{selectedMol.formula}</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 min-h-0">
            {/* Image Viewer */}
            <div className="lg:w-1/2 shrink-0 bg-white rounded-xl overflow-hidden shadow-inner flex items-center justify-center p-8 border-4 border-gray-800">
              <img 
                src={selectedMol.imagePath} 
                alt={selectedMol.name} 
                className="w-full h-auto max-h-[400px] object-contain drop-shadow-lg"
              />
            </div>

            {/* Information */}
            <div className="lg:w-1/2 flex flex-col gap-6">
              <div className="bg-gray-800/40 p-6 rounded-xl border border-gray-700/50">
                <h4 className="text-blue-400 font-bold text-sm mb-3 uppercase tracking-wider flex items-center gap-2">
                  <span className="text-lg">📖</span> Description
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {selectedMol.description}
                </p>
              </div>

              <div className="bg-indigo-900/20 p-6 rounded-xl border border-indigo-500/30">
                <h4 className="text-indigo-400 font-bold text-sm mb-3 uppercase tracking-wider flex items-center gap-2">
                  <span className="text-lg">⚡</span> Biological Function
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {selectedMol.function}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
