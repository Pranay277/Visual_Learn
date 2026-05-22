import React, { useState, useContext } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import ELEMENTS, { ChemicalElement } from './data/elements'
import { LuminaContext } from '../../App'
import AtomModel from './components/AtomModel'

export default function PeriodicTable() {
  const [selectedElement, setSelectedElement] = useState<ChemicalElement | null>(null)
  const { updateContext, setDrawerOpen } = useContext(LuminaContext) || {}

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'alkali-metal': return 'bg-red-500/20 border-red-500/50 text-red-200 hover:bg-red-500/40'
      case 'alkaline-earth': return 'bg-orange-500/20 border-orange-500/50 text-orange-200 hover:bg-orange-500/40'
      case 'transition-metal': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-200 hover:bg-yellow-500/40'
      case 'post-transition-metal': return 'bg-green-500/20 border-green-500/50 text-green-200 hover:bg-green-500/40'
      case 'metalloid': return 'bg-teal-500/20 border-teal-500/50 text-teal-200 hover:bg-teal-500/40'
      case 'nonmetal': return 'bg-blue-500/20 border-blue-500/50 text-blue-200 hover:bg-blue-500/40'
      case 'halogen': return 'bg-indigo-500/20 border-indigo-500/50 text-indigo-200 hover:bg-indigo-500/40'
      case 'noble-gas': return 'bg-purple-500/20 border-purple-500/50 text-purple-200 hover:bg-purple-500/40'
      case 'lanthanide': return 'bg-pink-500/20 border-pink-500/50 text-pink-200 hover:bg-pink-500/40'
      case 'actinide': return 'bg-rose-500/20 border-rose-500/50 text-rose-200 hover:bg-rose-500/40'
      default: return 'bg-gray-700 border-gray-500 text-gray-200 hover:bg-gray-600'
    }
  }

  const handleElementClick = (el: ChemicalElement) => {
    setSelectedElement(el)
    if (updateContext) {
      updateContext({
        module: 'Chemistry',
        model_id: 'periodic_table',
        selected_component: el.name,
        current_lesson: 'Element properties',
        student_action: 'viewed element ' + el.name + ' (' + el.symbol + ')'
      })
    }
  }

  // Create a 10x18 grid
  const grid = Array(10).fill(null).map(() => Array(18).fill(null))
  
  ELEMENTS.forEach(el => {
    // 0-indexed
    grid[el.row - 1][el.col - 1] = el
  })

  return (
    <div className="w-full h-full flex flex-col p-6 overflow-hidden">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-wide">Interactive Periodic Table</h2>
          <p className="text-gray-400 mt-1">Explore element properties and atomic structure</p>
        </div>
        
        {/* Legend */}
        <div className="hidden xl:flex gap-4 text-[10px] uppercase font-bold tracking-wider">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-red-500/50 border border-red-500"></div>Alkali</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-yellow-500/50 border border-yellow-500"></div>Transition</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-blue-500/50 border border-blue-500"></div>Nonmetal</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-purple-500/50 border border-purple-500"></div>Noble Gas</div>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Table Area */}
        <div className="flex-1 overflow-auto custom-scrollbar pr-4">
          <div className="min-w-[900px] flex flex-col gap-1 pb-10">
            {grid.map((row, rIdx) => {
              // Add a gap before lanthanides (row 8 in our 10-row grid mapping)
              const isFBlock = rIdx >= 7
              return (
                <div key={rIdx} className={`flex gap-1 ${isFBlock && rIdx === 7 ? 'mt-4' : ''}`}>
                  {row.map((el, cIdx) => {
                    if (!el) {
                      return <div key={`${rIdx}-${cIdx}`} className="w-12 h-14 sm:w-14 sm:h-16 flex-shrink-0"></div>
                    }
                    
                    const isSelected = selectedElement?.number === el.number

                    return (
                      <button
                        key={el.number}
                        onClick={() => handleElementClick(el)}
                        className={`w-12 h-14 sm:w-14 sm:h-16 flex-shrink-0 border flex flex-col p-1 rounded-md transition-all ${getCategoryColor(el.category)} ${isSelected ? 'ring-2 ring-white scale-110 z-10 shadow-2xl' : ''}`}
                      >
                        <div className="w-full flex justify-between items-start">
                          <span className="text-[9px] font-bold opacity-70">{el.number}</span>
                          <span className="text-[7px] opacity-50">{el.atomic_mass.toFixed(1)}</span>
                        </div>
                        <div className="flex-1 flex items-center justify-center">
                          <span className="text-lg font-black">{el.symbol}</span>
                        </div>
                        <span className="text-[8px] truncate w-full text-center opacity-80">{el.name}</span>
                      </button>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>

        {/* Details Panel */}
        <div className="w-80 shrink-0 bg-gray-900/80 rounded-2xl border border-gray-700/50 p-6 shadow-2xl flex flex-col overflow-y-auto custom-scrollbar">
          {selectedElement ? (
            <>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-gray-400 font-bold text-sm">Atomic Number {selectedElement.number}</div>
                  <h3 className="text-3xl font-black text-white mt-1">{selectedElement.name}</h3>
                  <div className="text-xl text-blue-400 font-bold">{selectedElement.symbol}</div>
                </div>
                <div className={`w-16 h-16 rounded-xl border flex items-center justify-center text-3xl font-bold ${getCategoryColor(selectedElement.category)}`}>
                  {selectedElement.symbol}
                </div>
              </div>

              <div className="inline-block px-3 py-1 bg-gray-800 rounded-lg text-xs font-bold text-gray-300 uppercase tracking-wider w-fit mb-4 border border-gray-700 shrink-0">
                {selectedElement.category.replace('-', ' ')}
              </div>

              {/* 3D Atom Visualizer */}
              <div className="w-full h-48 bg-black/40 rounded-xl mb-6 border border-gray-700/50 shrink-0 overflow-hidden relative group">
                <div className="absolute top-2 left-2 text-[10px] uppercase font-bold tracking-wider text-gray-500 z-10 pointer-events-none">3D Bohr Model</div>
                <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} intensity={1} />
                  <AtomModel atomicNumber={selectedElement.number} />
                  <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
                </Canvas>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed mb-6 bg-gray-800/30 p-4 rounded-xl border border-gray-700/50 shrink-0">
                {selectedElement.description}
              </p>

              <div className="space-y-4 shrink-0">
                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                  <span className="text-gray-500 text-xs font-bold uppercase">Atomic Mass</span>
                  <span className="text-gray-200 text-sm font-medium">{selectedElement.atomic_mass} u</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                  <span className="text-gray-500 text-xs font-bold uppercase">Phase at STP</span>
                  <span className="text-gray-200 text-sm font-medium">{selectedElement.phase}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                  <span className="text-gray-500 text-xs font-bold uppercase">Electron Config</span>
                  <span className="text-gray-200 text-sm font-mono">{selectedElement.electron_configuration}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                  <span className="text-gray-500 text-xs font-bold uppercase">Electronegativity</span>
                  <span className="text-gray-200 text-sm font-medium">{selectedElement.electronegativity || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                  <span className="text-gray-500 text-xs font-bold uppercase">Discovered</span>
                  <span className="text-gray-200 text-sm font-medium">{selectedElement.discovery_year}</span>
                </div>
              </div>

              {/* Educational Section */}
              <div className="mt-6 bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 shrink-0">
                <h4 className="text-blue-400 font-bold text-sm mb-2 flex items-center gap-2">
                  <span className="text-lg">⚛️</span> Atomic Structure
                </h4>
                <p className="text-gray-300 text-xs leading-relaxed mb-3">
                  The electron configuration <strong className="font-mono text-white">{selectedElement.electron_configuration}</strong> defines how electrons are distributed in the atom's orbitals. 
                  The outermost electrons dictate the element's chemical properties.
                </p>
                <div className="text-xs bg-black/40 p-3 rounded border border-gray-700/50 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-red-400 font-bold shrink-0">− e⁻</span>
                    <span className="text-gray-400">Removing an electron forms a positively charged <strong>cation</strong> (common in metals).</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400 font-bold shrink-0">+ e⁻</span>
                    <span className="text-gray-400">Adding an electron forms a negatively charged <strong>anion</strong> (common in nonmetals).</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
              <div className="text-6xl mb-4">🧪</div>
              <h3 className="text-xl font-bold text-white mb-2">Select an Element</h3>
              <p className="text-gray-400 text-sm">Click on any element in the periodic table to view its detailed properties and atomic structure.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
