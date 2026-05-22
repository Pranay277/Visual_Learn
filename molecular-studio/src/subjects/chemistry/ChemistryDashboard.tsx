import React, { useState, useContext, useMemo } from 'react';
import { Search, FlaskConical, X, Activity, Droplet, Grid3X3, Beaker, Atom } from 'lucide-react';
import CanvasSetup from '../../components/3d/CanvasSetup';
import { LuminaContext } from '../../App';
import MoleculeViewer from './components/MoleculeViewer';
import MOLECULES from './data/molecules';
import PeriodicTable from './PeriodicTable';
import ReactionLab from './ReactionLab';
import OrganicCompounds from './OrganicCompounds';
import QuizModal from '../../quiz/QuizModal';
import PerformanceModal from '../../quiz/PerformanceModal';
import { SubjectQuizScore } from '../../quiz/quizData';

type DashboardMode = 'molecules' | 'periodic_table' | 'reactions' | 'organic';

const ChemistryDashboard = () => {
  const [dashboardMode, setDashboardMode] = useState<DashboardMode>('molecules');
  
  // Molecules Mode States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMolecule, setSelectedMolecule] = useState(MOLECULES[0]);
  const [selectedAtom, setSelectedAtom] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'structure' | 'properties'>('structure');
  
  // Quiz & Performance States
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isPerformanceOpen, setIsPerformanceOpen] = useState(false);
  const [lastQuizScore, setLastQuizScore] = useState<SubjectQuizScore | null>(null);

  const context = useContext(LuminaContext);

  const filteredMolecules = useMemo(() => {
    return MOLECULES.filter(m => 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.formula.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleAtomClick = (atomId: string, atomLabel: string, elementName: string) => {
    setSelectedAtom(atomId);
    
    if (context) {
      context.updateContext({
        module: "Chemistry",
        model_id: selectedMolecule.id,
        selected_component: `${atomLabel} (${elementName})`,
        current_lesson: `${selectedMolecule.name} — Molecular Structure`,
        student_action: `clicked atom ${atomLabel} in ${selectedMolecule.name}`
      });
    }
  };

  const selectedAtomData = useMemo(() => {
    if (!selectedAtom) return null;
    return selectedMolecule.atoms.find(a => a.id === selectedAtom);
  }, [selectedAtom, selectedMolecule]);

  const handleQuizComplete = (score: SubjectQuizScore) => {
    setLastQuizScore(score);
    if (context) {
      context.updateContext({
        module: 'Chemistry',
        model_id: 'quiz_result',
        selected_component: 'quiz_completed',
        current_lesson: 'Post-quiz review',
        student_action: 'completed quiz with score ' + score.percentage + '% — weak topics: ' + score.weakTopics.join(', ')
      });
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-gray-950 text-white overflow-hidden relative">
      
      {/* GLOBAL TOP NAV */}
      <div className="h-[60px] shrink-0 bg-gray-900 border-b border-white/10 flex items-center justify-between px-6 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-blue-500/20 rounded-lg">
            <FlaskConical className="w-5 h-5 text-blue-400" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-wide">Chemistry</h1>
        </div>
        
        {/* Mode Selector */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
          <button
            onClick={() => setDashboardMode('molecules')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ${
              dashboardMode === 'molecules' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
          >
            <FlaskConical className="w-4 h-4" /> Molecules
          </button>
          <button
            onClick={() => setDashboardMode('periodic_table')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ${
              dashboardMode === 'periodic_table' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
          >
            <Grid3X3 className="w-4 h-4" /> Periodic Table
          </button>
          <button
            onClick={() => setDashboardMode('reactions')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ${
              dashboardMode === 'reactions' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
          >
            <Beaker className="w-4 h-4" /> Reaction Lab
          </button>
          <button
            onClick={() => setDashboardMode('organic')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ${
              dashboardMode === 'organic' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
          >
            <span className="text-sm">⌬</span> Organic
          </button>
        </div>

        {/* Quiz & Performance Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPerformanceOpen(true)}
            className="flex items-center gap-2 px-4 py-1.5 bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 rounded-lg text-sm hover:bg-indigo-500/30 transition-colors font-semibold"
          >
            <span>📊</span> Performance
          </button>
          <button
            onClick={() => setIsQuizOpen(true)}
            className="flex items-center gap-2 px-4 py-1.5 bg-blue-500/20 border border-blue-500/40 text-blue-300 rounded-lg text-sm hover:bg-blue-500/30 transition-colors font-semibold"
          >
            <span>📝</span> Take Quiz
            {lastQuizScore && (
              <span className="ml-1 text-xs bg-blue-500/30 px-2 py-0.5 rounded-full">
                {lastQuizScore.percentage}%
              </span>
            )}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex overflow-hidden">
        
        {dashboardMode === 'molecules' && (
          <>
            {/* LEFT SIDEBAR for Molecules */}
            <div className="w-[260px] shrink-0 bg-gray-900 border-r border-white/10 flex flex-col h-full z-20">
              <div className="p-4 border-b border-white/10 bg-gray-900/50">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search molecules..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-shadow"
                  />
                </div>
              </div>

              {/* Molecule List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {filteredMolecules.map((mol) => {
                  const isActive = selectedMolecule.id === mol.id;
                  return (
                    <button
                      key={mol.id}
                      onClick={() => {
                        setSelectedMolecule(mol);
                        setSelectedAtom(null);
                      }}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group ${
                        isActive 
                          ? 'bg-blue-500/10 border-blue-500/50 border-l-4 border-l-blue-500 shadow-md' 
                          : 'bg-white/5 border-transparent hover:bg-white/10'
                      }`}
                    >
                      <div>
                        <div className={`font-semibold text-sm ${isActive ? 'text-blue-100' : 'text-gray-300 group-hover:text-white'}`}>
                          {mol.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 font-mono tracking-wider">{mol.formula}</div>
                      </div>
                      <div 
                        className={`w-2.5 h-2.5 rounded-full shadow-sm ${
                          mol.type.includes('Polar') ? 'bg-blue-400' : 'bg-gray-400'
                        }`} 
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Molecule Viewer Area */}
            <div className="flex-1 flex flex-col relative h-full">
              
              {/* Top Bar for Molecule Viewer */}
              <div className="h-[50px] shrink-0 bg-gray-900 border-b border-white/10 flex items-center justify-between px-6 z-10">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-bold text-white tracking-wide">{selectedMolecule.name}</h2>
                  <span className="px-2.5 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-md text-[11px] font-mono font-bold tracking-widest uppercase text-blue-300">
                    {selectedMolecule.formula}
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
                  {(['structure', 'properties'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-1 rounded-md text-xs font-semibold capitalize transition-all duration-200 ${
                        activeTab === tab 
                          ? 'bg-gray-700 text-white shadow-sm' 
                          : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === 'structure' && (
                <div className="flex-1 relative flex flex-col overflow-hidden">
                  
                  {/* Info bar above canvas */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
                    <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-full px-5 py-2 text-xs text-gray-400 shadow-xl pointer-events-auto flex items-center gap-3">
                      <span>
                        <span className="font-semibold text-gray-200 uppercase tracking-widest text-[10px] mr-2">Selected</span>
                        <span className="text-white font-medium">{selectedAtomData ? selectedAtomData.label : 'None'}</span>
                      </span>
                      <span className="text-gray-600">|</span>
                      <span>
                        <span className="font-semibold text-gray-200 uppercase tracking-widest text-[10px] mr-2">Molecule</span>
                        <span className="text-white font-mono font-medium">{selectedMolecule.formula}</span>
                      </span>
                    </div>
                  </div>

                  {/* Canvas */}
                  <div className="flex-1 bg-gradient-to-br from-gray-900 to-black w-full h-full relative">
                    <CanvasSetup>
                      <MoleculeViewer 
                        molecule={selectedMolecule}
                        selectedAtom={selectedAtom}
                        onAtomClick={handleAtomClick}
                      />
                    </CanvasSetup>
                  </div>

                  {/* Bottom Data Panel */}
                  <div 
                    className={`absolute bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-t border-white/10 shadow-[0_-10px_50px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-out z-20 ${
                      selectedAtom ? 'translate-y-0' : 'translate-y-full'
                    }`}
                    style={{ height: '200px' }}
                  >
                    {selectedAtomData && (
                      <div className="p-6 h-full flex flex-col relative max-w-5xl mx-auto">
                        <button 
                          onClick={() => setSelectedAtom(null)}
                          className="absolute top-5 right-5 p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                        
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                          <span className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/30 text-lg font-black shadow-inner">
                            {selectedAtomData.element}
                          </span>
                          {selectedAtomData.element} Atom <span className="text-gray-500 font-medium">({selectedAtomData.label})</span>
                        </h3>

                        <div className="grid grid-cols-4 gap-6">
                          <div className="bg-black/40 border border-white/5 rounded-xl p-4 shadow-inner">
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Atomic Number</div>
                            <div className="text-2xl font-semibold text-gray-100">{selectedAtomData.atomicNumber}</div>
                          </div>
                          <div className="bg-black/40 border border-white/5 rounded-xl p-4 shadow-inner">
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Atomic Mass</div>
                            <div className="text-2xl font-semibold text-gray-100">{selectedAtomData.mass} <span className="text-sm text-gray-500 font-normal">u</span></div>
                          </div>
                          <div className="bg-black/40 border border-white/5 rounded-xl p-4 shadow-inner">
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Electronegativity</div>
                            <div className="text-2xl font-semibold text-gray-100">{selectedAtomData.electronegativity}</div>
                          </div>
                          <div className="bg-black/40 border border-white/5 rounded-xl p-4 shadow-inner">
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Bond Type</div>
                            <div className="text-2xl font-semibold text-blue-300">{selectedAtomData.bondType}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Properties Tab */}
              {activeTab === 'properties' && (
                <div className="flex-1 bg-gray-950 p-8 overflow-y-auto">
                  <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Activity className="w-5 h-5 text-purple-400" />
                    </div>
                    Physical Properties
                  </h3>
                  <div className="grid grid-cols-2 gap-6 max-w-4xl">
                    {Object.entries(selectedMolecule.properties).map(([key, value]) => (
                      <div key={key} className="bg-gray-900/50 border border-white/5 rounded-2xl p-6 flex flex-col gap-2 shadow-sm hover:border-white/10 transition-colors">
                        <span className="text-[11px] text-gray-500 uppercase tracking-widest font-bold">{key}</span>
                        <span className="text-xl text-gray-200 font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {dashboardMode === 'periodic_table' && (
          <PeriodicTable />
        )}

        {dashboardMode === 'reactions' && (
          <ReactionLab />
        )}

        {dashboardMode === 'organic' && (
          <OrganicCompounds />
        )}
        
      </div>

      <QuizModal
        subject="chemistry"
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onComplete={handleQuizComplete}
      />
      <PerformanceModal
        isOpen={isPerformanceOpen}
        onClose={() => setIsPerformanceOpen(false)}
      />
    </div>
  );
};

export default ChemistryDashboard;
