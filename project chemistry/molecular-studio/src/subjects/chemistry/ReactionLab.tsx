import React, { useEffect, useRef, useState, useContext } from 'react'
import REACTIONS, { Reaction } from './data/reactions'
import { LuminaContext } from '../../App'

class Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  life: number
  maxLife: number

  constructor(x: number, y: number, color: string, isBubble: boolean = false) {
    this.x = x
    this.y = y
    this.vx = (Math.random() - 0.5) * (isBubble ? 1 : 4)
    this.vy = (Math.random() - 0.5) * 4 - (isBubble ? 2 : 0) // Bubbles float up
    this.radius = Math.random() * 3 + 2
    this.color = color
    this.maxLife = Math.random() * 100 + 50
    this.life = this.maxLife
  }

  update(ctx: CanvasRenderingContext2D, effectType: string) {
    this.x += this.vx
    this.y += this.vy
    this.life--

    if (effectType === 'explosion') {
      this.vy += 0.05 // Gravity
      this.radius *= 0.96 // Shrink
    } else if (effectType === 'bubble') {
      this.vy -= 0.05 // Buoyancy
      this.vx += (Math.random() - 0.5) * 0.5 // Wiggle
      this.radius *= 1.01 // Grow slightly
    } else if (effectType === 'precipitate') {
      this.vy += 0.02 // Slow fall
      this.vx *= 0.95 // Air resistance
    }

    // Draw
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = this.color + Math.floor((this.life / this.maxLife) * 255).toString(16).padStart(2, '0')
    if (effectType === 'bubble') {
      ctx.strokeStyle = this.color
      ctx.stroke()
      ctx.fillStyle = 'transparent'
    } else {
      ctx.fill()
    }
  }
}

export default function ReactionLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedReaction, setSelectedReaction] = useState<Reaction>(REACTIONS[0])
  const [isReacting, setIsReacting] = useState(false)
  const { updateContext, setDrawerOpen } = useContext(LuminaContext) || {}
  
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>(0)
  const beakerColorRef = useRef<string>('rgba(59, 130, 246, 0.2)') // Default liquid color

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const parent = canvas.parentElement
      if (parent) {
        canvas.width = parent.clientWidth
        canvas.height = parent.clientHeight
      }
    }
    resize()
    window.addEventListener('resize', resize)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Draw Beaker
      const cx = canvas.width / 2
      const cy = canvas.height / 2 + 50
      const width = 200
      const height = 250
      
      // Draw Liquid
      ctx.beginPath()
      ctx.roundRect(cx - width/2 + 5, cy - height/2 + 50, width - 10, height - 55, 15)
      ctx.fillStyle = beakerColorRef.current
      ctx.fill()

      // Draw Beaker Glass
      ctx.beginPath()
      ctx.roundRect(cx - width/2, cy - height/2, width, height, 20)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
      ctx.lineWidth = 4
      ctx.stroke()
      
      // Beaker lip
      ctx.beginPath()
      ctx.ellipse(cx, cy - height/2, width/2 + 10, 10, 0, 0, Math.PI * 2)
      ctx.stroke()

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(p => p.life > 0)
      particlesRef.current.forEach(p => p.update(ctx, selectedReaction.visualEffect))

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [selectedReaction])

  const triggerReaction = () => {
    if (isReacting) return
    setIsReacting(true)
    particlesRef.current = []

    const canvas = canvasRef.current
    if (!canvas) return
    const cx = canvas.width / 2
    const cy = canvas.height / 2 + 50
    const effect = selectedReaction.visualEffect
    const baseColor = selectedReaction.colorEffect || '#FFFFFF'

    if (updateContext) {
      updateContext({
        module: 'Chemistry',
        model_id: 'reaction_lab',
        selected_component: selectedReaction.name,
        current_lesson: 'Chemical Reactions',
        student_action: 'triggered reaction: ' + selectedReaction.equation
      })
    }

    // Effect Logic
    if (effect === 'explosion') {
      for (let i = 0; i < 200; i++) {
        particlesRef.current.push(new Particle(cx, cy + 50, baseColor))
        particlesRef.current.push(new Particle(cx, cy + 50, '#FCA5A5')) // Mix in some red/orange
      }
    } else if (effect === 'bubble') {
      let count = 0
      const bubbleInterval = setInterval(() => {
        if (count > 50) clearInterval(bubbleInterval)
        for (let i = 0; i < 5; i++) {
          particlesRef.current.push(new Particle(cx + (Math.random() - 0.5) * 150, cy + 100, baseColor, true))
        }
        count++
      }, 50)
    } else if (effect === 'color-change') {
      beakerColorRef.current = baseColor
      for (let i = 0; i < 100; i++) {
        particlesRef.current.push(new Particle(cx + (Math.random() - 0.5) * 150, cy + (Math.random() - 0.5) * 150 + 50, baseColor))
      }
    } else if (effect === 'precipitate') {
      let count = 0
      const precInterval = setInterval(() => {
        if (count > 30) clearInterval(precInterval)
        for (let i = 0; i < 10; i++) {
          particlesRef.current.push(new Particle(cx + (Math.random() - 0.5) * 150, cy - 50, baseColor))
        }
        count++
      }, 100)
    }

    setTimeout(() => {
      setIsReacting(false)
      // Reset color change after 5s
      if (effect === 'color-change') {
        beakerColorRef.current = 'rgba(59, 130, 246, 0.2)'
      }
    }, 5000)
  }

  return (
    <div className="w-full h-full flex overflow-hidden bg-gray-950">
      
      {/* Left Sidebar */}
      <div className="w-80 shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col h-full z-10">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white mb-2">Reaction Lab</h2>
          <p className="text-gray-400 text-sm">Select a reaction and observe the chemical change in the virtual beaker.</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {REACTIONS.map(rxn => (
            <button
              key={rxn.id}
              onClick={() => {
                if (!isReacting) setSelectedReaction(rxn)
              }}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedReaction.id === rxn.id 
                  ? 'bg-blue-900/30 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                  : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:bg-gray-800 hover:border-gray-500'
              } ${isReacting ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isReacting}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-blue-400 mb-1">{rxn.type}</div>
              <div className="font-semibold">{rxn.name}</div>
              <div className="text-xs font-mono mt-2 bg-gray-950/50 p-2 rounded truncate">{rxn.equation}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Canvas Area */}
      <div className="flex-1 relative flex flex-col">
        <div className="absolute top-6 left-6 right-6 z-10 flex gap-6">
          <div className="flex-1 bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-white">{selectedReaction.name}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${selectedReaction.energyChange === 'Exothermic' ? 'bg-red-900/30 text-red-400 border border-red-500/50' : 'bg-blue-900/30 text-blue-400 border border-blue-500/50'}`}>
                {selectedReaction.energyChange}
              </span>
            </div>
            <div className="text-xl font-mono text-center py-4 bg-gray-950 rounded-xl border border-gray-800 mb-4 text-gray-200">
              {selectedReaction.equation}
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {selectedReaction.description}
            </p>
          </div>

          <div className="w-48 flex flex-col gap-3">
            <button
              onClick={triggerReaction}
              disabled={isReacting}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl transition-all ${
                isReacting 
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white hover:scale-105 active:scale-95'
              }`}
            >
              {isReacting ? 'Reacting...' : 'TRIGGER'}
            </button>
            <button
              onClick={() => {
                particlesRef.current = []
                beakerColorRef.current = 'rgba(59, 130, 246, 0.2)'
              }}
              disabled={isReacting}
              className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 font-medium rounded-xl transition-colors"
            >
              Reset Beaker
            </button>
          </div>
        </div>

        <div className="flex-1 w-full relative">
          {/* Background grid for a "lab" feel */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
          
          <canvas ref={canvasRef} className="w-full h-full block" />
        </div>
      </div>
    </div>
  )
}
