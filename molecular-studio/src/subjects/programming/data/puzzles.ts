export type BlockType = 'move' | 'turn' | 'loop' | 'condition' | 'variable' | 'print' | 'function'

export interface CodeBlock {
  id: string
  type: BlockType
  label: string
  color: string
  description: string
  parameters?: { id: string, label: string, type: 'number' | 'direction' | 'condition', default: string | number }[]
}

export interface GridCell {
  x: number
  y: number
  type: 'empty' | 'wall' | 'goal' | 'start' | 'collectible' | 'hazard'
}

export interface PuzzleLevel {
  id: string
  name: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: 'maze' | 'pattern' | 'algorithm' | 'logic'
  description: string
  objective: string
  hint: string
  gridSize: { rows: number, cols: number }
  grid: GridCell[]
  availableBlocks: string[]
  minBlocksToSolve: number
  conceptTaught: string
}

export const CODE_BLOCKS: Record<string, CodeBlock> = {
  'move_forward': { id:'move_forward', type:'move', label:'Move Forward', color:'#3B82F6', description:'Move the character one cell forward in the current direction', parameters:[{id:'steps', label:'Steps', type:'number', default:1}] },
  'turn_left': { id:'turn_left', type:'turn', label:'Turn Left', color:'#8B5CF6', description:'Rotate the character 90° to the left', parameters:[] },
  'turn_right': { id:'turn_right', type:'turn', label:'Turn Right', color:'#8B5CF6', description:'Rotate the character 90° to the right', parameters:[] },
  'repeat_loop': { id:'repeat_loop', type:'loop', label:'Repeat', color:'#F59E0B', description:'Repeat the blocks inside this loop N times', parameters:[{id:'count', label:'Times', type:'number', default:3}] },
  'if_condition': { id:'if_condition', type:'condition', label:'If...', color:'#10B981', description:'Execute inner blocks only if condition is true', parameters:[{id:'condition', label:'Condition', type:'condition', default:'path_ahead_clear'}] },
  'collect': { id:'collect', type:'variable', label:'Collect Item', color:'#F97316', description:'Pick up a collectible item at the current position', parameters:[] },
  'print_message': { id:'print_message', type:'print', label:'Print', color:'#EC4899', description:'Display a message in the output console', parameters:[{id:'message', label:'Message', type:'condition', default:'Hello!'}] },
}

export const PUZZLE_LEVELS: PuzzleLevel[] = [
  {
    id: 'maze_beginner_1',
    name: 'Find the Exit',
    difficulty: 'beginner',
    category: 'maze',
    gridSize: { rows:5, cols:5 },
    description: 'Guide your character to the golden goal using move and turn blocks.',
    objective: 'Reach the gold star in as few blocks as possible.',
    hint: 'Think about how many steps forward and turns you need before placing blocks.',
    conceptTaught: 'Sequential instructions — computers execute code in order, one step at a time.',
    minBlocksToSolve: 4,
    availableBlocks: ['move_forward','turn_left','turn_right'],
    grid: [
      {x:0, y:0, type:'start'},
      {x:4, y:4, type:'goal'},
      {x:1, y:0, type:'wall'},
      {x:1, y:1, type:'wall'},
      {x:3, y:2, type:'wall'},
      {x:3, y:3, type:'wall'}
    ]
  },
  {
    id: 'maze_loop_1',
    name: 'The Long Corridor',
    difficulty: 'beginner',
    category: 'maze',
    gridSize: { rows:3, cols:7 },
    description: 'A long corridor — use the Repeat block instead of placing Move Forward 6 times.',
    objective: 'Reach the goal using a loop. Max 3 blocks total.',
    hint: 'A Repeat block can hold other blocks inside. How many times do you need to move forward?',
    conceptTaught: 'Loops — repeating instructions efficiently instead of duplicating code.',
    minBlocksToSolve: 2,
    availableBlocks: ['move_forward','turn_left','turn_right','repeat_loop'],
    grid: [
      {x:0, y:1, type:'start'},
      {x:6, y:1, type:'goal'},
      {x:0, y:0, type:'wall'}, {x:1, y:0, type:'wall'}, {x:2, y:0, type:'wall'}, {x:3, y:0, type:'wall'}, {x:4, y:0, type:'wall'}, {x:5, y:0, type:'wall'}, {x:6, y:0, type:'wall'},
      {x:0, y:2, type:'wall'}, {x:1, y:2, type:'wall'}, {x:2, y:2, type:'wall'}, {x:3, y:2, type:'wall'}, {x:4, y:2, type:'wall'}, {x:5, y:2, type:'wall'}, {x:6, y:2, type:'wall'}
    ]
  },
  {
    id: 'collect_pattern',
    name: 'Collect All Stars',
    difficulty: 'intermediate',
    category: 'pattern',
    gridSize: { rows:5, cols:5 },
    description: 'Collect all 3 stars in the grid. You\'ll need to plan your path carefully.',
    objective: 'Collect all collectibles and reach the goal. Use a loop where possible.',
    hint: 'Draw the path on paper first. Look for repeating patterns in the movement.',
    conceptTaught: 'Pattern recognition — identifying repeating structures to write efficient loops.',
    minBlocksToSolve: 6,
    availableBlocks: ['move_forward','turn_left','turn_right','repeat_loop','collect'],
    grid: [
      {x:0, y:0, type:'start'},
      {x:4, y:4, type:'goal'},
      {x:2, y:0, type:'collectible'},
      {x:4, y:0, type:'collectible'},
      {x:4, y:2, type:'collectible'},
      {x:1, y:2, type:'wall'},
      {x:2, y:3, type:'wall'}
    ]
  },
  {
    id: 'if_maze',
    name: 'The Fork',
    difficulty: 'intermediate',
    category: 'logic',
    gridSize: { rows:5, cols:6 },
    description: 'The path splits! Use an If block to handle different situations.',
    objective: 'Reach the goal — the path has a fork. Use If...then to handle it.',
    hint: 'An If block checks a condition before deciding what to do next — just like an if statement in real code.',
    conceptTaught: 'Conditionals — making decisions in code based on the current state of the world.',
    minBlocksToSolve: 5,
    availableBlocks: ['move_forward','turn_left','turn_right','repeat_loop','if_condition'],
    grid: [
      {x:0, y:2, type:'start'},
      {x:5, y:2, type:'goal'},
      {x:2, y:0, type:'wall'},
      {x:2, y:1, type:'wall'},
      {x:2, y:3, type:'wall'},
      {x:2, y:4, type:'wall'},
      {x:3, y:4, type:'hazard'}
    ]
  },
  {
    id: 'nested_loop_1',
    name: 'Draw a Square',
    difficulty: 'advanced',
    category: 'pattern',
    gridSize: { rows:6, cols:6 },
    description: 'Use a loop inside a loop! Draw a square path by repeating a sequence of move and turn.',
    objective: 'Collect all 3 stars placed in a square pattern using a nested loop and return to the start (goal).',
    hint: 'Put a Repeat block INSIDE another Repeat block. Repeat 4 times for each side of the square.',
    conceptTaught: 'Nested Loops — putting loops inside loops allows you to repeat entire patterns of behavior.',
    minBlocksToSolve: 4,
    availableBlocks: ['move_forward','turn_left','turn_right','repeat_loop','collect'],
    grid: [
      {x:1, y:1, type:'start'},
      {x:4, y:1, type:'collectible'},
      {x:4, y:4, type:'collectible'},
      {x:1, y:4, type:'collectible'},
      {x:1, y:1, type:'goal'}
    ]
  }
];

export default PUZZLE_LEVELS;
