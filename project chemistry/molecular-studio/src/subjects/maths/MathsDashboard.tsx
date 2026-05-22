import React, { useState, useContext, useMemo, useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html, Line, Plane, Box, Sphere, Cylinder } from '@react-three/drei'
import * as THREE from 'three'
import { Sigma, Play, Pause, Calculator, ArrowRight, Sparkles } from 'lucide-react'
import { LuminaContext } from '../../App'
import MATH_CONCEPTS, { MathConcept, MathParameter } from './data/concepts'
import QuizModal from '../../quiz/QuizModal'
import PerformanceModal from '../../quiz/PerformanceModal'
import { SubjectQuizScore } from '../../quiz/quizData'

// --- SCENES ---

const Grid2D = () => {
  const gridPoints = []
  for (let i = -10; i <= 10; i++) {
    gridPoints.push(
      <Line key={`h${i}`} points={[[-10, i, 0], [10, i, 0]]} color={i === 0 ? "#6b7280" : "#374151"} lineWidth={i === 0 ? 2 : 1} opacity={i === 0 ? 1 : 0.2} transparent />,
      <Line key={`v${i}`} points={[[i, -10, 0], [i, 10, 0]]} color={i === 0 ? "#6b7280" : "#374151"} lineWidth={i === 0 ? 2 : 1} opacity={i === 0 ? 1 : 0.2} transparent />
    )
  }
  return (
    <group>
      {gridPoints}
      <Html position={[10.5, 0, 0]} center><div className="text-gray-400 text-xs font-mono">x</div></Html>
      <Html position={[0, 10.5, 0]} center><div className="text-gray-400 text-xs font-mono">y</div></Html>
    </group>
  )
}

const SineWaveScene = ({ amplitude, frequency, phase }: any) => {
  const [animPhase, setAnimPhase] = useState(phase)
  const isInteracting = useRef(false)

  useEffect(() => {
    setAnimPhase(phase)
    isInteracting.current = true
    const timeout = setTimeout(() => { isInteracting.current = false }, 1000)
    return () => clearTimeout(timeout)
  }, [amplitude, frequency, phase])

  useFrame((_, delta) => {
    if (!isInteracting.current) {
      setAnimPhase((p: number) => p + delta * 0.5)
    }
  })

  const points = useMemo(() => {
    const pts = []
    for (let x = -10; x <= 10; x += 0.1) {
      pts.push(new THREE.Vector3(x, amplitude * Math.sin(frequency * x + animPhase), 0))
    }
    return pts
  }, [amplitude, frequency, animPhase])

  return (
    <group>
      <Grid2D />
      <Line points={points} color="#8b5cf6" lineWidth={3} />
    </group>
  )
}

const ParabolaScene = ({ a, b, c }: any) => {
  const points = useMemo(() => {
    const pts = []
    for (let x = -5; x <= 5; x += 0.1) {
      const y = a * x * x + b * x + c
      if (y >= -10 && y <= 10) {
        pts.push(new THREE.Vector3(x, y, 0))
      }
    }
    return pts
  }, [a, b, c])

  const vertexX = -b / (2 * a)
  const vertexY = a * vertexX * vertexX + b * vertexX + c
  
  const discriminant = b * b - 4 * a * c
  const roots = []
  if (discriminant >= 0 && a !== 0) {
    roots.push((-b + Math.sqrt(discriminant)) / (2 * a))
    roots.push((-b - Math.sqrt(discriminant)) / (2 * a))
  }

  return (
    <group>
      <Grid2D />
      {points.length > 0 && <Line points={points} color="#f59e0b" lineWidth={3} />}
      
      <Sphere args={[0.2, 16, 16]} position={[vertexX, vertexY, 0]}>
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
      </Sphere>
      <Html position={[vertexX, vertexY + 0.5, 0]} center>
        <div className="bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          Vertex: ({vertexX.toFixed(2)}, {vertexY.toFixed(2)})
        </div>
      </Html>

      {roots.map((root, i) => (
        <Sphere key={i} args={[0.15, 16, 16]} position={[root, 0, 0]}>
          <meshStandardMaterial color="#10b981" />
        </Sphere>
      ))}
    </group>
  )
}

const DerivativeTangentScene = ({ x0 }: any) => {
  const f = (x: number) => x * x * x - 3 * x
  const fPrime = (x: number) => 3 * x * x - 3

  const curvePoints = useMemo(() => {
    const pts = []
    for (let x = -3; x <= 3; x += 0.1) {
      const y = f(x)
      if (y >= -10 && y <= 10) pts.push(new THREE.Vector3(x, y, 0))
    }
    return pts
  }, [])

  const y0 = f(x0)
  const slope = fPrime(x0)
  
  const tangentPoints = [
    new THREE.Vector3(x0 - 2, y0 - 2 * slope, 0),
    new THREE.Vector3(x0 + 2, y0 + 2 * slope, 0)
  ]

  return (
    <group>
      <Grid2D />
      <Line points={curvePoints} color="#14b8a6" lineWidth={3} />
      <Line points={tangentPoints} color="#f43f5e" lineWidth={2} />
      
      <Line points={[[x0, 0, 0], [x0, y0, 0]]} color="#64748b" dashed lineWidth={1} />
      
      <Sphere args={[0.2, 16, 16]} position={[x0, y0, 0]}>
        <meshStandardMaterial color="#f43f5e" emissive="#f43f5e" emissiveIntensity={0.5} />
      </Sphere>
      
      <Html position={[x0 + 0.5, y0 - 0.5, 0]}>
        <div className="bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          f'({x0.toFixed(2)}) = {slope.toFixed(2)}
        </div>
      </Html>
    </group>
  )
}

const MatrixTransformScene = ({ a, b, c, d }: any) => {
  const originalGrid = []
  const transformedGrid = []
  
  for (let i = -3; i <= 3; i++) {
    originalGrid.push(
      <Line key={`h${i}`} points={[[-3, i, 0], [3, i, 0]]} color="#4b5563" lineWidth={1} />
    )
    transformedGrid.push(
      <Line key={`th${i}`} points={[
        [-3*a + i*b, -3*c + i*d, 0], 
        [3*a + i*b, 3*c + i*d, 0]
      ]} color="#a855f7" lineWidth={1} opacity={0.4} transparent />
    )
    originalGrid.push(
      <Line key={`v${i}`} points={[[i, -3, 0], [i, 3, 0]]} color="#4b5563" lineWidth={1} />
    )
    transformedGrid.push(
      <Line key={`tv${i}`} points={[
        [i*a - 3*b, i*c - 3*d, 0], 
        [i*a + 3*b, i*c + 3*d, 0]
      ]} color="#a855f7" lineWidth={1} opacity={0.4} transparent />
    )
  }

  const iHat = [a, c, 0] as [number, number, number]
  const jHat = [b, d, 0] as [number, number, number]

  return (
    <group>
      {originalGrid}
      {transformedGrid}
      
      <Line points={[[0,0,0], [1,0,0]]} color="#ef4444" lineWidth={3} opacity={0.5} transparent />
      <Line points={[[0,0,0], [0,1,0]]} color="#22c55e" lineWidth={3} opacity={0.5} transparent />
      
      <Line points={[[0,0,0], iHat]} color="#ef4444" lineWidth={5} />
      <Line points={[[0,0,0], jHat]} color="#22c55e" lineWidth={5} />
      
      <Html position={iHat} center>
        <div className="bg-red-900/80 text-white text-xs px-1 py-0.5 rounded font-mono">î [{a.toFixed(1)}, {c.toFixed(1)}]</div>
      </Html>
      <Html position={jHat} center>
        <div className="bg-green-900/80 text-white text-xs px-1 py-0.5 rounded font-mono">ĵ [{b.toFixed(1)}, {d.toFixed(1)}]</div>
      </Html>
    </group>
  )
}

const SphereGeometryScene = ({ radius, segments }: any) => {
  const groupRef = useRef<THREE.Group>(null)
  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.y += 0.005
  })

  return (
    <group>
      <group ref={groupRef}>
        <Sphere args={[radius, segments, segments]}>
          <meshStandardMaterial color="#a855f7" roughness={0.4} metalness={0.2} wireframe={segments < 16} />
        </Sphere>
      </group>
      <Html position={[0, radius + 0.5, 0]} center>
        <div className="bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap border border-white/20 text-center">
          V = {((4/3) * Math.PI * radius**3).toFixed(2)} u³<br/>
          A = {(4 * Math.PI * radius**2).toFixed(2)} u²
        </div>
      </Html>
    </group>
  )
}

const CylinderGeometryScene = ({ radius, height }: any) => {
  const groupRef = useRef<THREE.Group>(null)
  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.y += 0.005
  })

  return (
    <group>
      <group ref={groupRef}>
        <Cylinder args={[radius, radius, height, 32]}>
          <meshStandardMaterial color="#8b5cf6" roughness={0.4} metalness={0.2} />
        </Cylinder>
      </group>
      <Html position={[0, height/2 + 0.5, 0]} center>
        <div className="bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap border border-white/20 text-center">
          V = {(Math.PI * radius**2 * height).toFixed(2)} u³<br/>
          A = {(2 * Math.PI * radius * (radius + height)).toFixed(2)} u²
        </div>
      </Html>
    </group>
  )
}

// --- MAIN DASHBOARD COMPONENT ---

const MathsDashboard = () => {
  const [selectedConcept, setSelectedConcept] = useState<MathConcept>(MATH_CONCEPTS[0])
  const [paramValues, setParamValues] = useState<Record<string, number>>(() =>
    Object.fromEntries(MATH_CONCEPTS[0].parameters.map(p => [p.id, p.default]))
  )
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const { updateContext, setDrawerOpen } = useContext(LuminaContext) || {}
  
  // Quiz & Performance States
  const [isQuizOpen, setIsQuizOpen] = useState(false)
  const [isPerformanceOpen, setIsPerformanceOpen] = useState(false)
  const [lastQuizScore, setLastQuizScore] = useState<SubjectQuizScore | null>(null)

  const handleQuizComplete = (score: SubjectQuizScore) => {
    setLastQuizScore(score)
    if (updateContext) {
      updateContext({
        module: 'Mathematics',
        model_id: 'quiz_result',
        selected_component: 'quiz_completed',
        current_lesson: 'Post-quiz review',
        student_action: 'completed quiz with score ' + score.percentage + '% — weak topics: ' + score.weakTopics.join(', ')
      })
    }
  }

  const handleParamChange = (paramId: string, value: number) => {
    setParamValues(prev => ({ ...prev, [paramId]: value }))
    const param = selectedConcept.parameters.find(p => p.id === paramId)
    if (updateContext) {
      updateContext({
        module: 'Mathematics',
        model_id: selectedConcept.id,
        selected_component: paramId,
        current_lesson: selectedConcept.name,
        student_action: 'changed ' + (param?.label ?? paramId) + ' to ' + value
      })
    }
  }

  const handleConceptSelect = (concept: MathConcept) => {
    setSelectedConcept(concept)
    setParamValues(Object.fromEntries(concept.parameters.map(p => [p.id, p.default])))
    if (updateContext) {
      updateContext({
        module: 'Mathematics',
        model_id: concept.id,
        selected_component: 'none',
        current_lesson: concept.name,
        student_action: 'loaded concept ' + concept.name
      })
    }
  }

  const filteredConcepts = useMemo(() => 
    MATH_CONCEPTS.filter(c => activeCategory === 'all' || c.category === activeCategory)
  , [activeCategory])

  return (
    <div className="flex h-full w-full bg-gray-950 text-white overflow-hidden">
      {/* LEFT SIDEBAR */}
      <div className="w-64 shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col h-full z-20">
        <div className="p-4 border-b border-gray-800 bg-gray-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Sigma className="w-5 h-5 text-purple-400" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-wide">Mathematics</h1>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => setIsPerformanceOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 rounded-lg text-xs hover:bg-indigo-500/30 transition-colors font-semibold"
            >
              <span>📊</span> Performance
            </button>
            <button
              onClick={() => setIsQuizOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-500/20 border border-purple-500/40 text-purple-300 rounded-lg text-xs hover:bg-purple-500/30 transition-colors font-semibold"
            >
              <span>📝</span> Take Quiz
              {lastQuizScore && (
                <span className="ml-1 text-[10px] bg-purple-500/30 px-1.5 py-0.5 rounded-full">
                  {lastQuizScore.percentage}%
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="px-3 py-3 flex flex-wrap gap-1.5 border-b border-gray-800/50">
          {['all', 'algebra', 'geometry', 'calculus', 'trigonometry', 'linear_algebra'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 text-[10px] uppercase font-bold rounded-md transition-colors ${
                activeCategory === cat 
                  ? 'bg-purple-600 text-white shadow-sm' 
                  : 'bg-gray-800 text-gray-400 hover:text-gray-200 hover:bg-gray-700'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredConcepts.map((concept) => (
            <div
              key={concept.id}
              onClick={() => handleConceptSelect(concept)}
              className={`cursor-pointer px-3 py-3 rounded-xl transition-all group ${
                selectedConcept.id === concept.id 
                  ? 'bg-purple-900/20 border-l-4 border-purple-500 shadow-md' 
                  : 'border-l-4 border-transparent hover:bg-gray-800/50'
              }`}
            >
              <div className={`font-semibold text-sm ${selectedConcept.id === concept.id ? 'text-purple-100' : 'text-gray-300 group-hover:text-white'}`}>
                {concept.name}
              </div>
              <div className="text-[10px] text-gray-500 uppercase font-bold mt-1 tracking-wider">{concept.category.replace('_', ' ')}</div>
              <div className="text-xs text-gray-400 truncate mt-1">{concept.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Top Bar */}
        <div className="h-16 shrink-0 border-b border-gray-800 flex items-center justify-between px-6 bg-gray-900/90 backdrop-blur-sm z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-white tracking-wide">{selectedConcept.name}</h2>
            <span className="px-2.5 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded-md text-[11px] font-mono font-bold tracking-widest uppercase text-purple-300">
              {selectedConcept.formulaDisplay}
            </span>
          </div>
          
          <button
            onClick={() => setDrawerOpen && setDrawerOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold rounded-lg hover:bg-blue-500/20 transition-colors shadow-sm"
          >
            <Sparkles className="w-4 h-4" /> Ask Lumina about this
          </button>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative bg-gray-950">
          <Canvas camera={{ position: [0, 0, selectedConcept.visualType === '3d_geometry' ? 8 : 12], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <OrbitControls 
              enablePan={true} 
              enableZoom={true} 
              enableRotate={selectedConcept.visualType === '3d_geometry'} 
            />
            
            {selectedConcept.id === 'sine_wave' && <SineWaveScene {...paramValues} />}
            {selectedConcept.id === 'parabola' && <ParabolaScene {...paramValues} />}
            {selectedConcept.id === 'derivative_tangent' && <DerivativeTangentScene {...paramValues} />}
            {selectedConcept.id === 'matrix_transform' && <MatrixTransformScene {...paramValues} />}
            {selectedConcept.id === 'sphere_volume' && <SphereGeometryScene {...paramValues} />}
            {selectedConcept.id === 'cylinder_geometry' && <CylinderGeometryScene {...paramValues} />}
          </Canvas>
        </div>

        {/* BOTTOM PANEL */}
        <div className="h-44 shrink-0 bg-gray-900/95 backdrop-blur-xl border-t border-gray-800 px-8 py-5 flex gap-10 z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
          <div className="flex-1 flex flex-col justify-center border-r border-gray-800 pr-8">
            <div className="font-mono text-white text-2xl font-bold tracking-wider mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              {selectedConcept.formulaDisplay}
            </div>
            <div className="text-gray-400 text-sm leading-relaxed max-w-md">
              {selectedConcept.formulaExplanation}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-4 space-y-4">
            {selectedConcept.parameters.map(p => (
              <div key={p.id} className="flex items-center gap-4">
                <label className="text-gray-400 text-xs w-36 flex-shrink-0 font-bold uppercase tracking-wider">
                  {p.label}
                </label>
                <input 
                  type="range" 
                  min={p.min} 
                  max={p.max} 
                  step={p.step}
                  value={paramValues[p.id] ?? p.default}
                  onChange={(e) => handleParamChange(p.id, parseFloat(e.target.value))}
                  className="flex-1 accent-purple-500 h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer" 
                />
                <span className="text-purple-300 text-sm font-mono w-16 text-right font-bold bg-black/40 px-2 py-1 rounded border border-white/5">
                  {paramValues[p.id] ?? p.default}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <QuizModal
        subject="maths"
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onComplete={handleQuizComplete}
      />
      <PerformanceModal
        isOpen={isPerformanceOpen}
        onClose={() => setIsPerformanceOpen(false)}
      />
    </div>
  )
}

export default MathsDashboard
