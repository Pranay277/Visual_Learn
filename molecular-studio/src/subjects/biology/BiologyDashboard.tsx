import React, { useState, useContext, useMemo, useEffect, Suspense } from 'react';
import { Dna, ChevronRight, Info } from 'lucide-react';
import { Html, useFBX, useTexture, Center, Bounds, Line } from '@react-three/drei';
import * as THREE from 'three';
import CanvasSetup from '../../components/3d/CanvasSetup';
import { LuminaContext } from '../../App';
import modelsData from './data/models.json';
import QuizModal from '../../quiz/QuizModal';
import PerformanceModal from '../../quiz/PerformanceModal';
import { SubjectQuizScore } from '../../quiz/quizData';
import ORGAN_INFO, { OrganInfo } from './data/organInfo';

const AnatomyModel = ({ 
  modelData, 
  onSelectOrgan,
  labellingMode,
  selectedOrganInfo,
  isSplit
}: { 
  modelData: any, 
  onSelectOrgan: (name: string) => void,
  labellingMode: boolean,
  selectedOrganInfo: OrganInfo | null,
  isSplit: boolean
}) => {
  const fbx = useFBX(modelData.path + modelData.fbx);
  const clonedFbx = useMemo(() => fbx.clone(true), [fbx]);
  
  const texturesToLoad: Record<string, string> = {};
  if (modelData.textures.baseColor) texturesToLoad.map = modelData.path + modelData.textures.baseColor;
  if (modelData.textures.normal) texturesToLoad.normalMap = modelData.path + modelData.textures.normal;
  if (modelData.textures.roughness) texturesToLoad.roughnessMap = modelData.path + modelData.textures.roughness;
  if (modelData.textures.metallic) texturesToLoad.metalnessMap = modelData.path + modelData.textures.metallic;
  if (modelData.textures.emission) texturesToLoad.emissiveMap = modelData.path + modelData.textures.emission;

  const textures = useTexture(texturesToLoad) as Record<string, THREE.Texture>;

  const clipPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);

  useEffect(() => {
    clonedFbx.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        
        // Ensure textures are configured properly for PBR
        if (textures.map) {
          textures.map.colorSpace = THREE.SRGBColorSpace;
        }

        const newMat = new THREE.MeshStandardMaterial({
          map: textures.map || null,
          normalMap: textures.normalMap || null,
          roughnessMap: textures.roughnessMap || null,
          metalnessMap: textures.metalnessMap || null,
          emissiveMap: textures.emissiveMap || null,
          roughness: 0.8,
          metalness: 0.1,
          side: THREE.DoubleSide,
          clippingPlanes: isSplit ? [clipPlane] : [],
          clipShadows: true
        });
        mesh.material = newMat;
      }
    });
  }, [clonedFbx, textures, isSplit, clipPlane]);

  const [hovered, setHovered] = useState(false);
  const [expandedLabelIdx, setExpandedLabelIdx] = useState<number | null>(null);
  const { updateContext, setDrawerOpen } = useContext(LuminaContext) || {};

  const handleClick = (e: any) => {
    e.stopPropagation();
    const targetName = e.object.name && e.object.name !== 'default' ? e.object.name : modelData.name;
    
    // Find matching organ info if possible by mapping target name to id loosely
    const organId = Object.keys(ORGAN_INFO).find(key => targetName.toLowerCase().includes(key)) || targetName.toLowerCase();
    
    onSelectOrgan(organId);
    
    if (updateContext) {
      updateContext({
        module: "Biology",
        model_id: modelData.name, // Sending human-readable name instead of raw file ID
        selected_component: targetName !== modelData.name ? targetName : 'the entire organ',
        current_lesson: modelData.name,
        student_action: "Looking at the 3D model of " + modelData.name
      });
    }
  };

  const organId = Object.keys(ORGAN_INFO).find(key => modelData.name.toLowerCase().includes(key));
  const currentOrganInfo = organId ? ORGAN_INFO[organId] : null;

  return (
    <Center>
      <primitive 
        object={clonedFbx} 
        scale={0.02} // Adjust scale as Meshy models are usually quite large (cm scale)
        onPointerOver={(e: any) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e: any) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
        onClick={handleClick}
      />
      {hovered && !labellingMode && (
        <Html position={[0, 2, 0]} center zIndexRange={[100, 0]} pointerEvents="none">
          <div className="bg-black/90 backdrop-blur-sm border border-white/10 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-2xl whitespace-nowrap">
            {modelData.name}
          </div>
        </Html>
      )}

      {labellingMode && currentOrganInfo?.labelling?.map((label, idx) => {
        const start = new THREE.Vector3(...label.position);
        const isExpanded = expandedLabelIdx === idx;
        const isLeft = idx % 2 === 0;
        const lineLength = 100;
        
        return (
          <Html key={idx} position={start} center zIndexRange={[100, 0]}>
            <div className="relative flex items-center justify-center">
              {/* Center dot at exact 3D point */}
              <div className={`w-2 h-2 rounded-full border-2 border-black ${isExpanded ? 'bg-blue-400' : 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]'}`} />
              
              {/* Connecting Line (SVG) */}
              <svg className="absolute pointer-events-none" style={{ left: '50%', top: '50%', width: 2, height: 2, overflow: 'visible' }}>
                <line 
                  x1="0" 
                  y1="0" 
                  x2={isLeft ? -lineLength : lineLength} 
                  y2={-30} 
                  stroke={isExpanded ? "#60A5FA" : "white"} 
                  strokeWidth={isExpanded ? "2" : "1"} 
                  strokeOpacity={isExpanded ? "0.8" : "0.4"} 
                />
                <line 
                  x1={isLeft ? -lineLength : lineLength} 
                  y1={-30} 
                  x2={isLeft ? -lineLength - 20 : lineLength + 20} 
                  y2={-30} 
                  stroke={isExpanded ? "#60A5FA" : "white"} 
                  strokeWidth={isExpanded ? "2" : "1"} 
                  strokeOpacity={isExpanded ? "0.8" : "0.4"} 
                />
              </svg>

              {/* Label Box */}
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedLabelIdx(isExpanded ? null : idx);
                }}
                className={`absolute bg-black/90 backdrop-blur-md border ${isExpanded ? 'border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.2)]' : 'border-white/20 hover:border-blue-400/50'} rounded-lg px-3 py-2 shadow-2xl cursor-pointer transition-all duration-200`}
                style={{ 
                  top: '-30px', 
                  transform: 'translateY(-50%)',
                  [isLeft ? 'right' : 'left']: `${lineLength + 25}px`,
                  width: 'max-content',
                  maxWidth: '220px',
                  textAlign: isLeft ? 'right' : 'left'
                }}
              >
                <div className={`text-white text-xs font-bold ${isExpanded ? 'mb-1 text-blue-200' : ''}`}>{label.structureName}</div>
                
                {isExpanded && (
                  <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="text-gray-400 text-[9px] whitespace-pre-wrap leading-tight mb-2">{label.description}</div>
                    {label.examRelevance && (
                      <div className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[8px] font-bold tracking-wider px-1.5 py-1 rounded flex items-start text-left gap-1.5 mt-2">
                        <span className="shrink-0 mt-0.5">🎯</span> 
                        <span className="leading-tight">{label.examRelevance}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Html>
        );
      })}
    </Center>
  );
};

const BiologyDashboard = () => {
  const [activeLesson, setActiveLesson] = useState(modelsData[0].name);
  const [viewingComponent, setViewingComponent] = useState<string>("None");
  
  // Organ Info states
  const [labellingMode, setLabellingMode] = useState(false);
  const [isSplit, setIsSplit] = useState(false);
  const [selectedOrganInfo, setSelectedOrganInfo] = useState<OrganInfo | null>(null);

  // Quiz states
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isPerformanceOpen, setIsPerformanceOpen] = useState(false);
  const [lastQuizScore, setLastQuizScore] = useState<SubjectQuizScore | null>(null);

  const { updateContext, setDrawerOpen } = useContext(LuminaContext) || {};
  
  const activeModelData = useMemo(() => 
    modelsData.find(m => m.name === activeLesson) || modelsData[0], 
  [activeLesson]);

  const currentOrganKey = Object.keys(ORGAN_INFO).find(key => activeModelData.name.toLowerCase().includes(key));
  const currentOrganInfo = currentOrganKey ? ORGAN_INFO[currentOrganKey] : null;

  const handleSelectOrgan = (name: string) => {
    setViewingComponent(name);
    // Find matching organ in ORGAN_INFO
    const organKey = Object.keys(ORGAN_INFO).find(key => name.toLowerCase().includes(key));
    setSelectedOrganInfo(organKey ? ORGAN_INFO[organKey] : null);
  };

  const handleQuizComplete = (score: SubjectQuizScore) => {
    setLastQuizScore(score);
    if (updateContext) {
      updateContext({
        module: 'Biology',
        model_id: 'quiz_result',
        selected_component: 'quiz_completed',
        current_lesson: 'Post-quiz review',
        student_action: 'completed quiz with score ' + score.percentage + '% — weak topics: ' + score.weakTopics.join(', ')
      });
    }
  };

  return (
    <div className="flex h-full w-full bg-black overflow-hidden relative">
      
      {/* Left Sidebar */}
      <div className="w-[280px] shrink-0 bg-gray-950 border-r border-white/5 flex flex-col h-full z-20 shadow-2xl">
        <div className="p-6 border-b border-white/5 bg-gray-900/50">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-green-500/20 rounded-lg">
               <Dna className="w-6 h-6 text-green-400" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-wide">Biology</h1>
          </div>
          <p className="text-xs text-gray-400 font-medium tracking-wide">Anatomy Studio</p>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 px-2">
            Dynamic Curriculum
          </h2>
          <div className="space-y-1.5">
            {modelsData.map(model => (
              <button
                key={model.id}
                onClick={() => {
                  setActiveLesson(model.name);
                  setViewingComponent("None");
                  setSelectedOrganInfo(null);
                  setIsSplit(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeLesson === model.name 
                    ? 'bg-green-500/15 text-green-400 shadow-inner border border-green-500/20' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 border border-transparent'
                }`}
              >
                <span className="truncate pr-2">{model.name}</span>
                {activeLesson === model.name && <ChevronRight className="w-4 h-4 shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Canvas Area */}
      <div className="flex-1 flex flex-col relative h-full">
        
        {/* Top Info Overlay */}
        <div className="absolute top-6 left-6 right-6 z-10 flex justify-between items-start pointer-events-none">
          <div className="bg-gray-950/80 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-3 flex items-center gap-4 shadow-2xl pointer-events-auto">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Info className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Currently Viewing</span>
              <span className="text-sm font-semibold text-white tracking-wide">{viewingComponent}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pointer-events-auto">
            <button
              onClick={() => setIsSplit(!isSplit)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm transition-colors ${
                isSplit ? 'bg-red-500/20 border-red-500/40 text-red-300' : 'bg-gray-800/80 border-gray-700 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span>✂️</span> {isSplit ? 'Close View' : 'Split View'}
            </button>
            <button
              onClick={() => setLabellingMode(!labellingMode)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm transition-colors ${
                labellingMode ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' : 'bg-gray-800/80 border-gray-700 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span>🏷️</span> Labels
            </button>
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
                className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-lg text-sm hover:bg-emerald-500/30 transition-colors font-semibold"
              >
                <span>📝</span> Take Quiz
                {lastQuizScore && (
                  <span className="ml-1 text-xs bg-emerald-500/30 px-2 py-0.5 rounded-full">
                    {lastQuizScore.percentage}%
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 3D Canvas */}
        <div className="flex-1 w-full h-full bg-gradient-to-tr from-gray-900 via-gray-950 to-black">
          <CanvasSetup>
            <Suspense fallback={
              <Html center>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                  <div className="text-green-400 font-bold tracking-widest text-xs uppercase whitespace-nowrap bg-black/50 px-3 py-1 rounded">Loading Model...</div>
                </div>
              </Html>
            }>
              <AnatomyModel 
                key={activeModelData.id} // Force remount on model change
                modelData={activeModelData} 
                onSelectOrgan={handleSelectOrgan} 
                labellingMode={labellingMode}
                selectedOrganInfo={selectedOrganInfo}
                isSplit={isSplit}
              />
            </Suspense>
          </CanvasSetup>
        </div>

        {/* Bottom Info Section for Labelling Mode */}
        {labellingMode && currentOrganInfo && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none w-full max-w-2xl px-4">
            <div className="bg-gray-950/90 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-2xl pointer-events-auto">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: currentOrganInfo.color }}></div>
                <h3 className="text-white text-lg font-bold">{currentOrganInfo.displayName}</h3>
                <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider bg-gray-800 px-2 py-0.5 rounded">
                  {currentOrganInfo.system}
                </span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                {currentOrganInfo.shortDescription}
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Organ Info Panel */}
      {selectedOrganInfo && (
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-gray-900/95 backdrop-blur border-l border-gray-700 overflow-y-auto p-5 z-30 shadow-2xl">
          <button 
            onClick={() => setSelectedOrganInfo(null)}
            className="absolute top-4 right-4 text-gray-500 hover:text-white"
          >
            ✕
          </button>

          <div className="flex items-center gap-2 mb-1 mt-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedOrganInfo.color }}></div>
            <h2 className="text-white text-xl font-bold">{selectedOrganInfo.displayName}</h2>
          </div>
          <span className="inline-block px-2 py-0.5 bg-gray-800 text-gray-300 text-[10px] uppercase font-bold rounded mb-4">
            {selectedOrganInfo.system}
          </span>

          <div className="text-gray-300 text-sm leading-relaxed border-b border-gray-800 pb-4 mb-4">
            {selectedOrganInfo.shortDescription}
          </div>

          <div className="mb-4">
            <h3 className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-bold">Functions</h3>
            <ul className="space-y-1.5 ml-1">
              {selectedOrganInfo.functions.map((fn, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                  <span className="text-[10px] mt-1" style={{ color: selectedOrganInfo.color }}>●</span>
                  {fn}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-bold">Details</h3>
            <div className="text-gray-400 text-xs leading-relaxed max-h-32 overflow-y-auto pr-2 custom-scrollbar">
              {selectedOrganInfo.fullDescription.split('\n\n')[0]}
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
            <h3 className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-bold">Key Facts</h3>
            <div className="space-y-2">
              {selectedOrganInfo.keyFacts.map((fact, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-yellow-500 shrink-0">⚡</span>
                  <span className="text-gray-300 text-xs">{fact}</span>
                </div>
              ))}
            </div>
          </div>

          {selectedOrganInfo.labelling.length > 0 && (
            <div className="mb-4">
              <h3 className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-bold">Internal Structures</h3>
              <div className="space-y-2">
                {selectedOrganInfo.labelling.map((label, i) => (
                  <div key={i} className="bg-gray-800/30 p-2 rounded border border-gray-700/50">
                    <div className="text-white text-xs font-medium mb-0.5">{label.structureName}</div>
                    <div className="text-gray-500 text-[10px] leading-tight">{label.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-xs text-red-400 uppercase tracking-wide mb-2 font-bold">Related Conditions</h3>
            <div className="flex flex-wrap gap-1.5">
              {selectedOrganInfo.commonConditions.map((cond, i) => (
                <span key={i} className="bg-red-900/20 text-red-400 text-[10px] border border-red-900/30 px-2 py-1 rounded leading-tight">
                  {cond}
                </span>
              ))}
            </div>
          </div>

          <button 
            onClick={() => {
              if (updateContext) {
                updateContext({
                  module: "Biology",
                  model_id: "organ_info",
                  selected_component: selectedOrganInfo.id,
                  current_lesson: 'Organ deep dive',
                  student_action: "asked Lumina about " + selectedOrganInfo.displayName
                });
                if (setDrawerOpen) setDrawerOpen(true);
              }
            }}
            className="w-full bg-blue-600/20 border border-blue-500/50 hover:bg-blue-600/30 text-blue-300 font-medium py-2 rounded-lg text-sm transition-colors"
          >
            Ask Lumina about the {selectedOrganInfo.displayName} →
          </button>
        </div>
      )}

      <QuizModal
        subject="biology"
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

export default BiologyDashboard;
