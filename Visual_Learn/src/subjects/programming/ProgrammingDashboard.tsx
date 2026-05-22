import React, { useState, useContext, useRef, useEffect, useCallback } from 'react'
import { Code2, Play, Square, RotateCcw, CheckCircle, XCircle, Sparkles, X, Trash2 } from 'lucide-react'
import { LuminaContext } from '../../App'
import PUZZLE_LEVELS, { CODE_BLOCKS, PuzzleLevel, GridCell, CodeBlock } from './data/puzzles'
import QuizModal from '../../quiz/QuizModal'
import PerformanceModal from '../../quiz/PerformanceModal'
import { SubjectQuizScore } from '../../quiz/quizData'

interface PlacedBlock {
  instanceId: string
  blockId: string
  parameters: Record<string, string | number>
  children?: PlacedBlock[]
}

interface CharacterState {
  x: number
  y: number
  direction: 'up' | 'right' | 'down' | 'left'
  collected: { x: number, y: number }[]
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const ProgrammingDashboard = () => {
  const [selectedLevel, setSelectedLevel] = useState<PuzzleLevel>(PUZZLE_LEVELS[0])
  const [placedBlocks, setPlacedBlocks] = useState<PlacedBlock[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [characterState, setCharacterState] = useState<CharacterState>({ x:0, y:0, direction:'right', collected:[] })
  const [executionStep, setExecutionStep] = useState<number>(-1)
  const [consoleOutput, setConsoleOutput] = useState<string[]>([])
  const [levelComplete, setLevelComplete] = useState(false)
  const [levelFailed, setLevelFailed] = useState(false)
  const [activeTab, setActiveTab] = useState<'blocks' | 'console'>('blocks')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  const { updateContext, setDrawerOpen } = useContext(LuminaContext) || {}

  // Quiz & Performance States
  const [isQuizOpen, setIsQuizOpen] = useState(false)
  const [isPerformanceOpen, setIsPerformanceOpen] = useState(false)
  const [lastQuizScore, setLastQuizScore] = useState<SubjectQuizScore | null>(null)

  const handleQuizComplete = (score: SubjectQuizScore) => {
    setLastQuizScore(score)
    if (updateContext) {
      updateContext({
        module: 'Programming',
        model_id: 'quiz_result',
        selected_component: 'quiz_completed',
        current_lesson: 'Post-quiz review',
        student_action: 'completed quiz with score ' + score.percentage + '% — weak topics: ' + score.weakTopics.join(', ')
      })
    }
  }

  // Initialization
  const resetToStart = useCallback(() => {
    const startCell = selectedLevel.grid.find(c => c.type === 'start') || {x:0, y:0}
    setCharacterState({ x: startCell.x, y: startCell.y, direction: 'right', collected: [] })
    setLevelComplete(false)
    setLevelFailed(false)
    setExecutionStep(-1)
  }, [selectedLevel])

  useEffect(() => {
    resetToStart()
    setPlacedBlocks([])
    setConsoleOutput([])
  }, [selectedLevel, resetToStart])

  // Canvas Drawing
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { rows, cols } = selectedLevel.gridSize
    // Fit canvas to parent container nicely
    canvas.width = canvas.parentElement?.clientWidth || 400
    canvas.height = canvas.parentElement?.clientHeight || 400
    
    const cellSize = Math.floor(Math.min(canvas.width / cols, canvas.height / rows))
    const offsetX = (canvas.width - cols * cellSize) / 2
    const offsetY = (canvas.height - rows * cellSize) / 2

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw Grid Cells
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cellInfo = selectedLevel.grid.find(g => g.x === c && g.y === r)
        const type = cellInfo ? cellInfo.type : 'empty'
        
        ctx.fillStyle = type === 'wall' ? '#374151' : '#1F2937'
        ctx.fillRect(offsetX + c * cellSize, offsetY + r * cellSize, cellSize, cellSize)
        
        ctx.strokeStyle = '#374151'
        ctx.lineWidth = 1
        ctx.strokeRect(offsetX + c * cellSize, offsetY + r * cellSize, cellSize, cellSize)

        if (type === 'goal') {
          ctx.fillStyle = '#FCD34D'
          ctx.beginPath()
          ctx.arc(offsetX + c * cellSize + cellSize/2, offsetY + r * cellSize + cellSize/2, cellSize/3, 0, Math.PI*2)
          ctx.fill()
        } else if (type === 'start') {
          ctx.fillStyle = '#6EE7B7'
          ctx.globalAlpha = 0.3
          ctx.fillRect(offsetX + c * cellSize, offsetY + r * cellSize, cellSize, cellSize)
          ctx.globalAlpha = 1.0
        } else if (type === 'collectible') {
          const isCollected = characterState.collected.some(col => col.x === c && col.y === r)
          if (!isCollected) {
            ctx.fillStyle = '#F9A8D4'
            ctx.font = `${cellSize/2}px Arial`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText('⭐', offsetX + c * cellSize + cellSize/2, offsetY + r * cellSize + cellSize/2 + 2)
          }
        } else if (type === 'hazard') {
          ctx.fillStyle = '#FCA5A5'
          ctx.fillRect(offsetX + c * cellSize, offsetY + r * cellSize, cellSize, cellSize)
        }
      }
    }

    // Draw Character
    const cx = offsetX + characterState.x * cellSize + cellSize/2
    const cy = offsetY + characterState.y * cellSize + cellSize/2
    
    ctx.save()
    ctx.translate(cx, cy)
    if (characterState.direction === 'up') ctx.rotate(-Math.PI/2)
    else if (characterState.direction === 'down') ctx.rotate(Math.PI/2)
    else if (characterState.direction === 'left') ctx.rotate(Math.PI)
    
    ctx.fillStyle = '#60A5FA'
    ctx.beginPath()
    ctx.moveTo(cellSize/3, 0)
    ctx.lineTo(-cellSize/3, -cellSize/4)
    ctx.lineTo(-cellSize/3, cellSize/4)
    ctx.closePath()
    ctx.fill()
    ctx.restore()

    // Highlight current cell if executing
    if (executionStep >= 0 && isRunning) {
      ctx.strokeStyle = '#3B82F6'
      ctx.lineWidth = 3
      ctx.strokeRect(offsetX + characterState.x * cellSize + 2, offsetY + characterState.y * cellSize + 2, cellSize - 4, cellSize - 4)
    }

  }, [characterState, selectedLevel, executionStep, isRunning])

  // Interpreter Engine
  const executeBlocks = async (blocks: PlacedBlock[], currentState: CharacterState): Promise<CharacterState> => {
    let state = { ...currentState }
    
    for (let i = 0; i < blocks.length; i++) {
      if (!isRunningRef.current) break
      
      const block = blocks[i]
      setExecutionStep(i) // very basic visualization

      if (block.blockId === 'move_forward') {
        const steps = Number(block.parameters.steps || 1)
        for (let s = 0; s < steps; s++) {
          if (!isRunningRef.current) break
          
          let nextX = state.x
          let nextY = state.y
          if (state.direction === 'up') nextY--
          else if (state.direction === 'down') nextY++
          else if (state.direction === 'left') nextX--
          else if (state.direction === 'right') nextX++

          // Bounds check
          if (nextX < 0 || nextX >= selectedLevel.gridSize.cols || nextY < 0 || nextY >= selectedLevel.gridSize.rows) {
            setConsoleOutput(p => [...p, '> Error: Hit boundary'])
            throw new Error('boundary')
          }
          
          // Wall / Hazard check
          const cell = selectedLevel.grid.find(c => c.x === nextX && c.y === nextY)
          if (cell?.type === 'wall') {
            setConsoleOutput(p => [...p, '> Error: Hit a wall'])
            throw new Error('wall')
          }
          if (cell?.type === 'hazard') {
            setConsoleOutput(p => [...p, '> Error: Hit a hazard'])
            throw new Error('hazard')
          }

          state.x = nextX
          state.y = nextY
          
          // Auto-collect
          if (cell?.type === 'collectible' && !state.collected.some(c => c.x === nextX && c.y === nextY)) {
            state.collected.push({x: nextX, y: nextY})
            setConsoleOutput(p => [...p, `> Collected item at ${nextX},${nextY}`])
          }

          setCharacterState({...state})
          await sleep(400)
        }
      } 
      else if (block.blockId === 'turn_left') {
        const dirs = ['up', 'right', 'down', 'left']
        const idx = (dirs.indexOf(state.direction) - 1 + 4) % 4
        state.direction = dirs[idx] as any
        setCharacterState({...state})
        await sleep(300)
      }
      else if (block.blockId === 'turn_right') {
        const dirs = ['up', 'right', 'down', 'left']
        const idx = (dirs.indexOf(state.direction) + 1) % 4
        state.direction = dirs[idx] as any
        setCharacterState({...state})
        await sleep(300)
      }
      else if (block.blockId === 'repeat_loop') {
        const times = Number(block.parameters.count || 3)
        if (block.children && block.children.length > 0) {
          for (let t = 0; t < times; t++) {
            if (!isRunningRef.current) break
            state = await executeBlocks(block.children, state)
          }
        }
      }
      else if (block.blockId === 'if_condition') {
        // Evaluate condition
        let nextX = state.x
        let nextY = state.y
        if (state.direction === 'up') nextY--
        else if (state.direction === 'down') nextY++
        else if (state.direction === 'left') nextX--
        else if (state.direction === 'right') nextX++
        
        const cell = selectedLevel.grid.find(c => c.x === nextX && c.y === nextY)
        const isClear = nextX >= 0 && nextX < selectedLevel.gridSize.cols && 
                        nextY >= 0 && nextY < selectedLevel.gridSize.rows && 
                        cell?.type !== 'wall'
        
        if (isClear && block.children) {
          state = await executeBlocks(block.children, state)
        }
      }
      else if (block.blockId === 'collect') {
        const cell = selectedLevel.grid.find(c => c.x === state.x && c.y === state.y)
        if (cell?.type === 'collectible' && !state.collected.some(c => c.x === state.x && c.y === state.y)) {
          state.collected.push({x: state.x, y: state.y})
          setConsoleOutput(p => [...p, `> Collected item at ${state.x},${state.y}`])
        } else {
          setConsoleOutput(p => [...p, '> Nothing to collect here'])
        }
        setCharacterState({...state})
        await sleep(300)
      }
      else if (block.blockId === 'print_message') {
        setConsoleOutput(p => [...p, `> ${block.parameters.message}`])
        await sleep(200)
      }
    }
    return state
  }

  const isRunningRef = useRef(false)

  const handleRun = async () => {
    resetToStart()
    setConsoleOutput([])
    setIsRunning(true)
    isRunningRef.current = true
    setActiveTab('console')

    const startCell = selectedLevel.grid.find(c => c.type === 'start') || {x:0, y:0}
    const initialState: CharacterState = { x: startCell.x, y: startCell.y, direction: 'right', collected: [] }

    try {
      const finalState = await executeBlocks(placedBlocks, initialState)
      
      // Check win condition
      const isAtGoal = selectedLevel.grid.some(c => c.type === 'goal' && c.x === finalState.x && c.y === finalState.y)
      const totalCollectibles = selectedLevel.grid.filter(c => c.type === 'collectible').length
      const collectedAll = finalState.collected.length === totalCollectibles

      if (isAtGoal && collectedAll) {
        setLevelComplete(true)
        setConsoleOutput(p => [...p, '> SUCCESS: Goal reached!'])
      } else {
        setLevelFailed(true)
        setConsoleOutput(p => [...p, '> Program finished — goal not reached'])
      }
    } catch (e) {
      setLevelFailed(true)
    }

    setIsRunning(false)
    isRunningRef.current = false
    setExecutionStep(-1)

    if (updateContext) {
      updateContext({
        module: 'Programming',
        model_id: selectedLevel.id,
        selected_component: 'level_complete',
        current_lesson: selectedLevel.name,
        student_action: `ran program with ${placedBlocks.length} blocks`
      })
    }
  }

  const handleStop = () => {
    setIsRunning(false)
    isRunningRef.current = false
    setConsoleOutput(p => [...p, '> Program stopped by user'])
  }

  // Drag & Drop Handlers
  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    e.dataTransfer.setData('blockId', blockId)
  }

  const handleDrop = (e: React.DragEvent, parentList: PlacedBlock[], setList: (b: PlacedBlock[]) => void) => {
    e.preventDefault()
    e.stopPropagation()
    const blockId = e.dataTransfer.getData('blockId')
    if (blockId && CODE_BLOCKS[blockId]) {
      const baseBlock = CODE_BLOCKS[blockId]
      const defaultParams: Record<string, string | number> = {}
      baseBlock.parameters?.forEach(p => defaultParams[p.id] = p.default)
      
      const newBlock: PlacedBlock = {
        instanceId: Date.now().toString() + Math.random().toString(),
        blockId: blockId,
        parameters: defaultParams,
        children: ['loop', 'condition'].includes(baseBlock.type) ? [] : undefined
      }
      setList([...parentList, newBlock])
    }
  }

  const renderPlacedBlocks = (blocks: PlacedBlock[], setList: (b: PlacedBlock[]) => void) => {
    return blocks.map((pb, idx) => {
      const blockDef = CODE_BLOCKS[pb.blockId]
      return (
        <div key={pb.instanceId} className="flex flex-col mb-2">
          <div 
            className="flex items-center p-3 rounded-lg border bg-gray-800 shadow-sm"
            style={{ borderLeftColor: blockDef.color, borderLeftWidth: '4px', borderColor: 'rgba(255,255,255,0.1)' }}
          >
            <span className="font-bold text-sm text-gray-200 flex-1">{blockDef.label}</span>
            
            {/* Parameters */}
            {blockDef.parameters?.map(param => (
              <div key={param.id} className="flex items-center gap-2 mx-3">
                <span className="text-xs text-gray-400">{param.label}:</span>
                {param.type === 'number' ? (
                  <input 
                    type="number" 
                    className="w-12 bg-black/50 border border-gray-600 rounded px-1 text-white text-xs py-1"
                    value={pb.parameters[param.id]}
                    onChange={e => {
                      const newList = [...blocks]
                      newList[idx].parameters[param.id] = Number(e.target.value)
                      setList(newList)
                    }}
                  />
                ) : (
                  <input 
                    type="text" 
                    className="w-24 bg-black/50 border border-gray-600 rounded px-1 text-white text-xs py-1"
                    value={pb.parameters[param.id]}
                    onChange={e => {
                      const newList = [...blocks]
                      newList[idx].parameters[param.id] = e.target.value
                      setList(newList)
                    }}
                  />
                )}
              </div>
            ))}

            <button 
              onClick={() => setList(blocks.filter((_, i) => i !== idx))}
              className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Children Dropzone */}
          {pb.children !== undefined && (
            <div 
              className="ml-6 mt-2 p-2 min-h-[50px] border-l-2 border-dashed rounded-r bg-black/20"
              style={{ borderColor: blockDef.color }}
              onDragOver={e => e.preventDefault()}
              onDrop={e => handleDrop(e, pb.children!, (newChildren) => {
                const newList = [...blocks]
                newList[idx].children = newChildren
                setList(newList)
              })}
            >
              {pb.children.length === 0 ? (
                <div className="text-xs text-gray-600 italic px-2 py-1">Drop blocks inside...</div>
              ) : (
                renderPlacedBlocks(pb.children, (newChildren) => {
                  const newList = [...blocks]
                  newList[idx].children = newChildren
                  setList(newList)
                })
              )}
            </div>
          )}
        </div>
      )
    })
  }


  return (
    <div className="flex h-screen w-full bg-gray-950 text-white overflow-hidden font-sans">
      
      {/* LEFT PANEL */}
      <div className="w-72 shrink-0 bg-gray-900 border-r border-gray-700 flex flex-col h-full z-20">
        
        {/* Level Selector */}
        <div className="p-4 border-b border-gray-700 bg-gray-900/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-pink-500/20 rounded-lg">
              <Code2 className="w-5 h-5 text-pink-400" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-wide">Programming</h1>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setIsPerformanceOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 rounded-lg text-xs hover:bg-indigo-500/30 transition-colors font-semibold"
            >
              <span>📊</span> Performance
            </button>
            <button
              onClick={() => setIsQuizOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-pink-500/20 border border-pink-500/40 text-pink-300 rounded-lg text-xs hover:bg-pink-500/30 transition-colors font-semibold"
            >
              <span>📝</span> Take Quiz
              {lastQuizScore && (
                <span className="ml-1 text-[10px] bg-pink-500/30 px-1.5 py-0.5 rounded-full">
                  {lastQuizScore.percentage}%
                </span>
              )}
            </button>
          </div>
          
          <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
            {PUZZLE_LEVELS.map(level => (
              <button
                key={level.id}
                onClick={() => setSelectedLevel(level)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  selectedLevel.id === level.id 
                    ? 'bg-pink-900/20 border-pink-500/50 border-l-4 border-l-pink-400 shadow-md' 
                    : 'bg-gray-800/50 border-transparent hover:bg-gray-800'
                }`}
              >
                <div className={`font-semibold text-sm ${selectedLevel.id === level.id ? 'text-pink-100' : 'text-gray-300'}`}>
                  {level.name}
                </div>
                <div className="flex gap-2 mt-1.5">
                  <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                    level.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' : 
                    level.difficulty === 'intermediate' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {level.difficulty}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-gray-500 px-1.5 py-0.5 bg-black/40 rounded">
                    {level.category}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Concept Card */}
        <div className="p-4 border-b border-gray-700 bg-black/20">
          <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">Concept Taught</div>
          <div className="text-sm text-gray-200 leading-relaxed font-medium">
            {selectedLevel.conceptTaught}
          </div>
          <div className="text-xs text-pink-400/80 italic mt-3 bg-pink-500/10 p-2 rounded-lg border border-pink-500/10">
            💡 {selectedLevel.hint}
          </div>
        </div>

        {/* Block Palette */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-900">
          <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-3">Available Blocks</div>
          <div className="space-y-2.5">
            {selectedLevel.availableBlocks.map(blockId => {
              const block = CODE_BLOCKS[blockId]
              return (
                <div
                  key={blockId}
                  draggable
                  onDragStart={(e) => handleDragStart(e, blockId)}
                  className="cursor-grab active:cursor-grabbing p-3 rounded-lg border shadow-sm transition-transform hover:scale-[1.02]"
                  style={{ backgroundColor: `${block.color}20`, borderColor: block.color }}
                >
                  <div className="font-bold text-sm mb-1" style={{ color: block.color }}>{block.label}</div>
                  <div className="text-xs text-gray-400/90 leading-tight">{block.description}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* MIDDLE AREA */}
      <div className="flex-1 flex flex-col bg-gray-950 relative">
        
        {/* Top Header */}
        <div className="h-20 shrink-0 border-b border-gray-800 flex items-center justify-between px-6 bg-gray-900/80 backdrop-blur-sm z-10">
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">{selectedLevel.name}</h2>
            <p className="text-sm text-gray-400 mt-1 font-medium">{selectedLevel.objective}</p>
          </div>
          
          <div className="flex items-center gap-3">
            {!isRunning ? (
              <button
                onClick={handleRun}
                className="flex items-center gap-2 px-5 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors shadow-lg shadow-green-500/20"
              >
                <Play className="w-4 h-4 fill-current" /> Run
              </button>
            ) : (
              <button
                onClick={handleStop}
                className="flex items-center gap-2 px-5 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors shadow-lg shadow-red-500/20"
              >
                <Square className="w-4 h-4 fill-current" /> Stop
              </button>
            )}
            
            <button
              onClick={resetToStart}
              disabled={isRunning}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => setDrawerOpen && setDrawerOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-pink-500/10 border border-pink-500/20 text-pink-400 text-sm font-semibold rounded-lg hover:bg-pink-500/20 transition-colors ml-2"
            >
              <Sparkles className="w-4 h-4" /> Ask Lumina
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex items-center justify-center p-8 bg-[#111827]">
          <div className="w-full h-full max-w-2xl max-h-2xl flex items-center justify-center relative">
            <canvas 
              ref={canvasRef} 
              className="rounded-2xl border border-gray-700 shadow-2xl bg-gray-900 w-full h-full"
            />
          </div>
        </div>

        {/* Overlays */}
        {levelComplete && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center">
            <CheckCircle className="w-24 h-24 text-green-400 mb-6 drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]" />
            <h2 className="text-5xl font-black text-white mb-4 tracking-tight">Level Complete!</h2>
            
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 text-center max-w-md w-full mb-8">
              <p className="text-gray-300 text-lg mb-2">Solved in <span className="text-white font-bold">{placedBlocks.length}</span> blocks</p>
              <p className="text-gray-500 text-sm">Minimum required: {selectedLevel.minBlocksToSolve}</p>
              
              {placedBlocks.length <= selectedLevel.minBlocksToSolve && (
                <div className="mt-4 inline-block px-4 py-1.5 bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 font-bold rounded-full text-sm">
                  ⭐ Optimal Solution! ⭐
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button 
                onClick={resetToStart}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg transition-colors"
              >
                Try Again
              </button>
              <button 
                onClick={() => {
                  const currIdx = PUZZLE_LEVELS.findIndex(p => p.id === selectedLevel.id)
                  if (currIdx < PUZZLE_LEVELS.length - 1) setSelectedLevel(PUZZLE_LEVELS[currIdx + 1])
                }}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors shadow-lg shadow-green-500/20"
              >
                Next Level
              </button>
            </div>
          </div>
        )}

        {levelFailed && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center">
            <XCircle className="w-20 h-20 text-red-500 mb-6" />
            <h2 className="text-4xl font-bold text-white mb-4">Not quite...</h2>
            <p className="text-gray-400 mb-8 max-w-sm text-center text-lg">Trace through each block step by step to find where it went wrong.</p>
            <button 
              onClick={resetToStart}
              className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* RIGHT PANEL */}
      <div className="w-[340px] shrink-0 bg-gray-900 border-l border-gray-700 flex flex-col h-full z-20">
        
        {/* Tabs */}
        <div className="flex border-b border-gray-700 bg-gray-900">
          <button
            onClick={() => setActiveTab('blocks')}
            className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'blocks' ? 'bg-gray-800 text-white border-b-2 border-pink-500' : 'text-gray-500 hover:bg-gray-800/50'
            }`}
          >
            Workspace
          </button>
          <button
            onClick={() => setActiveTab('console')}
            className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'console' ? 'bg-gray-800 text-white border-b-2 border-pink-500' : 'text-gray-500 hover:bg-gray-800/50'
            }`}
          >
            Console
          </button>
        </div>

        {/* Content */}
        {activeTab === 'blocks' && (
          <div className="flex-1 flex flex-col p-4 overflow-hidden">
            <div className="flex justify-between items-center mb-3">
              <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Your Program</div>
              <div className="text-xs text-gray-400 font-mono">{placedBlocks.length} blocks</div>
            </div>
            
            <div 
              className={`flex-1 overflow-y-auto border-2 border-dashed rounded-xl p-3 transition-colors ${
                placedBlocks.length === 0 ? 'border-gray-700 bg-gray-800/20' : 'border-gray-700 bg-gray-900'
              }`}
              onDragOver={e => e.preventDefault()}
              onDrop={e => handleDrop(e, placedBlocks, setPlacedBlocks)}
            >
              {placedBlocks.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-600 text-sm text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-3">
                    <Code2 className="w-6 h-6 text-gray-500" />
                  </div>
                  Drag blocks here to build your program
                </div>
              ) : (
                renderPlacedBlocks(placedBlocks, setPlacedBlocks)
              )}
            </div>
          </div>
        )}

        {activeTab === 'console' && (
          <div className="flex-1 bg-black p-4 font-mono text-xs overflow-y-auto flex flex-col">
            <div className="text-[10px] text-gray-600 uppercase tracking-widest font-bold mb-4 border-b border-gray-800 pb-2">Terminal Output</div>
            <div className="flex-1 space-y-1.5">
              {consoleOutput.length === 0 ? (
                <div className="text-gray-600 italic">No output yet. Run the program.</div>
              ) : (
                consoleOutput.map((line, i) => (
                  <div key={i} className={`${line.includes('Error') ? 'text-red-400' : line.includes('SUCCESS') ? 'text-green-400 font-bold' : 'text-blue-300'}`}>
                    {line}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
      
      <QuizModal
        subject="programming"
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

export default ProgrammingDashboard
