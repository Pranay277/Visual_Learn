import React, { useState, useContext, useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html, Line, Plane } from '@react-three/drei'
import * as THREE from 'three'
import { Atom, Play, Pause, Sparkles } from 'lucide-react'
import { LuminaContext } from '../../App'
import SIMULATIONS, { SimulationData, SimulationVariable } from './data/simulations'
import QuizModal from '../../quiz/QuizModal'
import PerformanceModal from '../../quiz/PerformanceModal'
import { SubjectQuizScore } from '../../quiz/quizData'

// --- SCENES ---

const ProjectileMotionScene = ({ velocity, angle, gravity, isPlaying }: any) => {
  const [time, setTime] = useState(0)
  const [hitGround, setHitGround] = useState(false)
  const radAngle = (angle * Math.PI) / 180

  useFrame((state, delta) => {
    if (isPlaying && !hitGround) {
      const nextTime = time + delta * 2; 
      const nextY = velocity * Math.sin(radAngle) * nextTime - 0.5 * gravity * nextTime * nextTime;
      if (nextY <= 0 && nextTime > 0.1) {
        setHitGround(true)
        setTime((velocity * Math.sin(radAngle) * 2) / gravity) 
      } else {
        setTime(nextTime)
      }
    }
  })

  useEffect(() => { setTime(0); setHitGround(false) }, [velocity, angle, gravity])

  const x = velocity * Math.cos(radAngle) * time
  const y = Math.max(0, velocity * Math.sin(radAngle) * time - 0.5 * gravity * time * time)

  const points = useMemo(() => {
    const pts = [];
    const tTotal = (velocity * Math.sin(radAngle) * 2) / gravity;
    for (let t = 0; t <= tTotal; t += tTotal / 50) {
      const px = velocity * Math.cos(radAngle) * t;
      const py = velocity * Math.sin(radAngle) * t - 0.5 * gravity * t * t;
      if (py >= 0) pts.push(new THREE.Vector3(px - (velocity * Math.cos(radAngle) * tTotal)/2, py, 0));
    }
    return pts;
  }, [velocity, angle, gravity]);

  const maxRange = (velocity * velocity * Math.sin(2 * radAngle)) / gravity;
  const offsetX = -maxRange / 2;
  const scale = 10 / Math.max(maxRange, (velocity * velocity * Math.sin(radAngle) * Math.sin(radAngle)) / (2 * gravity), 10);

  return (
    <group scale={[scale, scale, scale]} position={[0, -2, 0]}>
      <Plane args={[maxRange * 2 + 20, 10]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <meshStandardMaterial color="#166534" />
      </Plane>
      {points.length > 0 && <Line points={points} color="#f59e0b" lineWidth={2} dashed={true} />}
      <mesh position={[x + offsetX, y, 0]}>
        <sphereGeometry args={[1/scale, 32, 32]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      {hitGround && (
        <Html position={[maxRange + offsetX, 0, 0]}>
          <div className="bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            Range: {maxRange.toFixed(1)}m
          </div>
        </Html>
      )}
    </group>
  )
}

const PendulumScene = ({ length, gravity, angle, isPlaying }: any) => {
  const [time, setTime] = useState(0)
  const radAngle = (angle * Math.PI) / 180

  useFrame((_, delta) => {
    if (isPlaying) setTime(prev => prev + delta)
  })

  const omega = Math.sqrt(gravity / length)
  const currentAngle = radAngle * Math.cos(omega * time)
  
  const pivot = new THREE.Vector3(0, 3, 0)
  const visualLength = length * 1.5 
  const bobX = pivot.x + visualLength * Math.sin(currentAngle)
  const bobY = pivot.y - visualLength * Math.cos(currentAngle)

  return (
    <group>
      <mesh position={pivot}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <Line points={[pivot, new THREE.Vector3(bobX, bobY, 0)]} color="#a3a3a3" lineWidth={2} />
      <mesh position={[bobX, bobY, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#3b82f6" roughness={0.2} metalness={0.8} />
      </mesh>
      <Html position={[pivot.x, pivot.y + 0.5, 0]} center>
        <div className="bg-black/80 text-white text-xs px-2 py-1 rounded border border-white/20">
          T = {(2 * Math.PI * Math.sqrt(length / gravity)).toFixed(2)}s
        </div>
      </Html>
    </group>
  )
}

const SpringOscillatorScene = ({ spring_constant, mass, amplitude, isPlaying }: any) => {
  const [time, setTime] = useState(0)

  useFrame((_, delta) => {
    if (isPlaying) setTime(prev => prev + delta)
  })

  const omega = Math.sqrt(spring_constant / mass)
  const x = amplitude * Math.cos(omega * time)

  const points = []
  const startX = -4
  const numCoils = 15
  const endX = x
  const length = endX - startX
  
  points.push(new THREE.Vector3(startX, 0, 0))
  for (let i = 1; i <= numCoils; i++) {
    const px = startX + (length * (i - 0.5)) / numCoils
    const py = i % 2 === 0 ? 0.5 : -0.5
    points.push(new THREE.Vector3(px, py, 0))
  }
  points.push(new THREE.Vector3(endX, 0, 0))

  return (
    <group>
      <mesh position={[-4.5, 0, 0]}>
        <boxGeometry args={[1, 4, 4]} />
        <meshStandardMaterial color="#4b5563" />
      </mesh>
      <Line points={points} color="#9ca3af" lineWidth={3} />
      <mesh position={[x + 0.5, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.3} />
      </mesh>
      <Html position={[x + 0.5, 1, 0]} center>
        <div className="bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap border border-white/20">
          x = {x.toFixed(2)}m<br/>
          T = {(2 * Math.PI * Math.sqrt(mass / spring_constant)).toFixed(2)}s
        </div>
      </Html>
    </group>
  )
}

const ElectricFieldScene = ({ charge1, charge2, distance }: any) => {
  const k = 8.99e9
  const force = (k * Math.abs(charge1 * 1e-6) * Math.abs(charge2 * 1e-6)) / (distance * distance)
  
  const q1Color = charge1 > 0 ? '#ef4444' : (charge1 < 0 ? '#3b82f6' : '#9ca3af')
  const q2Color = charge2 > 0 ? '#ef4444' : (charge2 < 0 ? '#3b82f6' : '#9ca3af')
  
  const q1Size = Math.max(0.2, Math.min(1, Math.abs(charge1) * 0.1 + 0.2))
  const q2Size = Math.max(0.2, Math.min(1, Math.abs(charge2) * 0.1 + 0.2))

  const p1 = new THREE.Vector3(-distance / 2, 0, 0)
  const p2 = new THREE.Vector3(distance / 2, 0, 0)

  const lines = useMemo(() => {
    const l = []
    const numLines = 8
    
    if (charge1 * charge2 < 0) {
      for (let i = 0; i < numLines; i++) {
        const angle = (i / numLines) * Math.PI * 2
        const curve = new THREE.QuadraticBezierCurve3(
          p1,
          new THREE.Vector3(0, Math.sin(angle) * distance * 0.8, Math.cos(angle) * distance * 0.8),
          p2
        )
        l.push(curve.getPoints(20))
      }
    } else if (charge1 * charge2 > 0) {
      for (let i = 0; i < numLines; i++) {
        const angle = (i / numLines) * Math.PI * 2
        const mid = new THREE.Vector3(0, Math.sin(angle) * distance, Math.cos(angle) * distance)
        const c1 = new THREE.QuadraticBezierCurve3(p1, new THREE.Vector3(-distance/4, mid.y, mid.z), new THREE.Vector3(-0.1, mid.y*1.5, mid.z*1.5))
        const c2 = new THREE.QuadraticBezierCurve3(p2, new THREE.Vector3(distance/4, mid.y, mid.z), new THREE.Vector3(0.1, mid.y*1.5, mid.z*1.5))
        l.push(c1.getPoints(20))
        l.push(c2.getPoints(20))
      }
    }
    return l
  }, [charge1, charge2, distance])

  return (
    <group>
      <mesh position={p1}>
        <sphereGeometry args={[q1Size, 32, 32]} />
        <meshStandardMaterial color={q1Color} emissive={q1Color} emissiveIntensity={0.5} />
        <Html position={[0, q1Size + 0.5, 0]} center>
          <div className="bg-black/80 text-white text-xs px-2 py-1 rounded">{charge1}μC</div>
        </Html>
      </mesh>

      <mesh position={p2}>
        <sphereGeometry args={[q2Size, 32, 32]} />
        <meshStandardMaterial color={q2Color} emissive={q2Color} emissiveIntensity={0.5} />
        <Html position={[0, q2Size + 0.5, 0]} center>
          <div className="bg-black/80 text-white text-xs px-2 py-1 rounded">{charge2}μC</div>
        </Html>
      </mesh>

      {lines.map((pts, i) => (
        <Line key={i} points={pts} color="#ffffff" opacity={0.3} transparent lineWidth={1} />
      ))}

      <Html position={[0, 0, 0]} center>
        <div className="bg-black/80 text-white text-xs px-3 py-1.5 rounded-lg border border-white/20">
          Force: {force.toFixed(4)} N
        </div>
      </Html>
    </group>
  )
}

const WaveInterferenceScene = ({ frequency1, frequency2, amplitude1, amplitude2, isPlaying }: any) => {
  const [time, setTime] = useState(0)

  useFrame((_, delta) => {
    if (isPlaying) setTime(prev => prev + delta)
  })

  const points = useMemo(() => {
    const pts1 = []
    const pts2 = []
    const ptsSum = []
    for (let x = -5; x <= 5; x += 0.1) {
      const y1 = amplitude1 * Math.sin(2 * Math.PI * frequency1 * time + x * 2)
      const y2 = amplitude2 * Math.sin(2 * Math.PI * frequency2 * time + x * 2)
      pts1.push(new THREE.Vector3(x, y1 + 3, 0)) 
      pts2.push(new THREE.Vector3(x, y2 - 3, 0)) 
      ptsSum.push(new THREE.Vector3(x, y1 + y2, 0))
    }
    return { pts1, pts2, ptsSum }
  }, [frequency1, frequency2, amplitude1, amplitude2, time])

  return (
    <group>
      <Line points={points.pts1} color="#3b82f6" lineWidth={2} opacity={0.6} transparent />
      <Line points={points.pts2} color="#ef4444" lineWidth={2} opacity={0.6} transparent />
      <Line points={points.ptsSum} color="#a855f7" lineWidth={3} />
      
      <Html position={[0, 4.5, 0]} center>
        <div className="bg-black/80 text-white text-xs px-2 py-1 rounded border border-white/20">
          Beat Frequency: {Math.abs(frequency1 - frequency2).toFixed(2)} Hz
        </div>
      </Html>
    </group>
  )
}

const OpticsRefractionScene = ({ n1, n2, incident_angle }: any) => {
  const radAngle = (incident_angle * Math.PI) / 180
  
  const sinT2 = (n1 * Math.sin(radAngle)) / n2
  const tir = sinT2 > 1
  
  const length = 5
  const p1 = new THREE.Vector3(-Math.sin(radAngle) * length, Math.cos(radAngle) * length, 0)
  const origin = new THREE.Vector3(0, 0, 0)
  
  let p2 = new THREE.Vector3(0, 0, 0)
  if (!tir) {
    const refAngle = Math.asin(sinT2)
    p2 = new THREE.Vector3(Math.sin(refAngle) * length, -Math.cos(refAngle) * length, 0)
  }

  const pReflect = new THREE.Vector3(Math.sin(radAngle) * length, Math.cos(radAngle) * length, 0)

  return (
    <group>
      <Plane args={[10, 10]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#1e3a8a" transparent opacity={0.3} />
      </Plane>
      <Line points={[new THREE.Vector3(-5,0,0), new THREE.Vector3(5,0,0)]} color="#ffffff" lineWidth={1} />
      <Line points={[new THREE.Vector3(0,-5,0), new THREE.Vector3(0,5,0)]} color="#9ca3af" dashed lineWidth={1} />

      <Line points={[p1, origin]} color="#facc15" lineWidth={3} />
      <Line points={[origin, pReflect]} color="#fb923c" lineWidth={2} opacity={tir ? 1 : 0.3} transparent />
      {!tir && <Line points={[origin, p2]} color="#22d3ee" lineWidth={3} />}

      <Html position={[-2, 2, 0]}>
        <div className="bg-black/80 text-white text-xs px-2 py-1 rounded">n₁ = {n1}</div>
      </Html>
      <Html position={[2, -2, 0]}>
        <div className="bg-black/80 text-white text-xs px-2 py-1 rounded">n₂ = {n2}</div>
      </Html>

      {tir && (
        <Html position={[0, -1, 0]} center>
          <div className="bg-red-500/80 text-white text-xs px-2 py-1 rounded font-bold border border-red-500">
            Total Internal Reflection
          </div>
        </Html>
      )}
    </group>
  )
}

// --- MAIN DASHBOARD COMPONENT ---

const PhysicsDashboard = () => {
  const [selectedSim, setSelectedSim] = useState<SimulationData>(SIMULATIONS[0])
  const [varValues, setVarValues] = useState<Record<string, number>>(() =>
    Object.fromEntries(selectedSim.variables.map(v => [v.id, v.default]))
  )
  const [isPlaying, setIsPlaying] = useState(true)
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
        module: 'Physics',
        model_id: 'quiz_result',
        selected_component: 'quiz_completed',
        current_lesson: 'Post-quiz review',
        student_action: 'completed quiz with score ' + score.percentage + '% — weak topics: ' + score.weakTopics.join(', ')
      })
    }
  }

  const handleVarChange = (varId: string, value: number) => {
    setVarValues(prev => ({ ...prev, [varId]: value }))
    const changedVar = selectedSim.variables.find(v => v.id === varId)
    if (updateContext) {
      updateContext({
        module: 'Physics',
        model_id: selectedSim.id,
        selected_component: varId,
        current_lesson: selectedSim.name,
        student_action: 'changed ' + (changedVar?.label ?? varId) + ' to ' + value + ' ' + (changedVar?.unit ?? '')
      })
    }
  }

  const handleSimSelect = (sim: SimulationData) => {
    setSelectedSim(sim)
    setVarValues(Object.fromEntries(sim.variables.map(v => [v.id, v.default])))
    setIsPlaying(true)
    if (updateContext) {
      updateContext({
        module: 'Physics',
        model_id: sim.id,
        selected_component: 'none',
        current_lesson: sim.name,
        student_action: 'loaded simulation ' + sim.name
      })
    }
  }

  const filteredSims = useMemo(() => 
    SIMULATIONS.filter(s => activeCategory === 'all' || s.category === activeCategory)
  , [activeCategory])

  return (
    <div className="flex h-full w-full bg-gray-950 text-white overflow-hidden">
      
      {/* LEFT SIDEBAR */}
      <div className="w-64 shrink-0 bg-gray-900 border-r border-gray-700 flex flex-col h-full z-20">
        <div className="p-4 border-b border-gray-700 bg-gray-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Atom className="w-5 h-5 text-orange-400" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-wide">Physics</h1>
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
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-orange-500/20 border border-orange-500/40 text-orange-300 rounded-lg text-xs hover:bg-orange-500/30 transition-colors font-semibold"
            >
              <span>📝</span> Take Quiz
              {lastQuizScore && (
                <span className="ml-1 text-[10px] bg-orange-500/30 px-1.5 py-0.5 rounded-full">
                  {lastQuizScore.percentage}%
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="px-3 py-3 flex flex-wrap gap-1.5 border-b border-gray-700/50">
          {['all', 'mechanics', 'electromagnetism', 'thermodynamics', 'optics', 'waves'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 text-[10px] uppercase font-bold rounded-md transition-colors ${
                activeCategory === cat 
                  ? 'bg-orange-600 text-white shadow-sm' 
                  : 'bg-gray-800 text-gray-400 hover:text-gray-200 hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredSims.map((sim) => (
            <div
              key={sim.id}
              onClick={() => handleSimSelect(sim)}
              className={`cursor-pointer px-3 py-3 rounded-xl transition-all group ${
                selectedSim.id === sim.id 
                  ? 'bg-orange-900/20 border-l-4 border-orange-400 shadow-md' 
                  : 'border-l-4 border-transparent hover:bg-gray-800/50'
              }`}
            >
              <div className={`font-semibold text-sm ${selectedSim.id === sim.id ? 'text-orange-100' : 'text-gray-300 group-hover:text-white'}`}>
                {sim.name}
              </div>
              <div className="text-[10px] text-gray-500 uppercase font-bold mt-1 tracking-wider">{sim.category}</div>
              <div className="text-xs text-gray-400 truncate mt-1">{sim.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col h-full relative">
        
        {/* Top Bar */}
        <div className="h-16 shrink-0 border-b border-gray-800 flex items-center justify-between px-6 bg-gray-900/90 backdrop-blur-sm z-10">
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">{selectedSim.name}</h2>
            <p className="text-xs text-gray-400 font-medium">{selectedSim.description}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors shadow-sm"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setDrawerOpen && setDrawerOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold rounded-lg hover:bg-blue-500/20 transition-colors shadow-sm"
            >
              <Sparkles className="w-4 h-4" /> Ask Lumina
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative bg-gradient-to-br from-gray-900 to-black">
          <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
            
            {selectedSim.id === 'projectile_motion' && <ProjectileMotionScene {...varValues} isPlaying={isPlaying} />}
            {selectedSim.id === 'pendulum' && <PendulumScene {...varValues} isPlaying={isPlaying} />}
            {selectedSim.id === 'spring_oscillator' && <SpringOscillatorScene {...varValues} isPlaying={isPlaying} />}
            {selectedSim.id === 'electric_field' && <ElectricFieldScene {...varValues} />}
            {selectedSim.id === 'wave_interference' && <WaveInterferenceScene {...varValues} isPlaying={isPlaying} />}
            {selectedSim.id === 'optics_refraction' && <OpticsRefractionScene {...varValues} />}
          </Canvas>
        </div>

        {/* BOTTOM CONTROL PANEL */}
        <div className="h-48 shrink-0 bg-gray-900/95 backdrop-blur-xl border-t border-gray-700 px-8 py-5 flex gap-10 z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
          <div className="flex-1 flex flex-col justify-center border-r border-gray-700 pr-8">
            <div className="font-mono text-white text-3xl font-bold tracking-wider mb-2 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300">
              {selectedSim.formulaDisplay}
            </div>
            <div className="text-gray-400 text-sm leading-relaxed max-w-md">
              {selectedSim.formulaExplanation}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-4 space-y-4">
            {selectedSim.variables.map(v => (
              <div key={v.id} className="flex items-center gap-4">
                <label className="text-gray-400 text-xs w-36 flex-shrink-0 font-bold uppercase tracking-wider">
                  {v.label} <span className="text-gray-600 normal-case font-medium ml-1">({v.unit})</span>
                </label>
                <input 
                  type="range" 
                  min={v.min} 
                  max={v.max} 
                  step={v.step}
                  value={varValues[v.id] ?? v.default}
                  onChange={(e) => handleVarChange(v.id, parseFloat(e.target.value))}
                  className="flex-1 accent-orange-500 h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer" 
                />
                <span className="text-orange-300 text-sm font-mono w-20 text-right font-bold bg-black/40 px-2.5 py-1 rounded border border-white/5">
                  {varValues[v.id] ?? v.default}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <QuizModal
        subject="physics"
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

export default PhysicsDashboard
