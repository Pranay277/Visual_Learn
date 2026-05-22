export interface MathParameter {
  id: string
  label: string
  min: number
  max: number
  default: number
  step: number
}

export interface MathConcept {
  id: string
  name: string
  category: 'algebra' | 'geometry' | 'calculus' | 'trigonometry' | 'linear_algebra'
  description: string
  formulaDisplay: string
  formulaExplanation: string
  parameters: MathParameter[]
  visualType: '3d_surface' | '2d_curve' | '3d_geometry' | 'vector_field'
}

const MATH_CONCEPTS: MathConcept[] = [
  {
    id: 'sine_wave',
    name: 'Sine Wave',
    category: 'trigonometry',
    description: 'Visualize how amplitude, frequency, and phase shift transform the sine function.',
    formulaDisplay: 'y = A·sin(Bx + C)',
    formulaExplanation: 'A controls amplitude, B controls frequency (period = 2π/B), C shifts phase',
    parameters: [
      { id:'amplitude', label:'Amplitude (A)', min:0.1, max:5, default:1, step:0.1 },
      { id:'frequency', label:'Frequency (B)', min:0.1, max:5, default:1, step:0.1 },
      { id:'phase', label:'Phase (C)', min:-3.14, max:3.14, default:0, step:0.1 }
    ],
    visualType: '2d_curve'
  },
  {
    id: 'parabola',
    name: 'Quadratic Function',
    category: 'algebra',
    description: 'Explore how coefficients a, b, c transform the parabola y = ax² + bx + c.',
    formulaDisplay: 'y = ax² + bx + c',
    formulaExplanation: 'a controls width/direction, -b/2a gives vertex x, c is y-intercept',
    parameters: [
      { id:'a', label:'Coefficient a', min:-3, max:3, default:1, step:0.1 },
      { id:'b', label:'Coefficient b', min:-5, max:5, default:0, step:0.1 },
      { id:'c', label:'Coefficient c', min:-5, max:5, default:0, step:0.1 }
    ],
    visualType: '2d_curve'
  },
  {
    id: 'sphere_volume',
    name: 'Sphere Geometry',
    category: 'geometry',
    description: 'Visualize how radius affects surface area and volume of a sphere.',
    formulaDisplay: 'V = (4/3)πr³  |  A = 4πr²',
    formulaExplanation: 'Volume grows as the cube of radius, surface area as the square',
    parameters: [
      { id:'radius', label:'Radius r', min:0.2, max:3, default:1, step:0.1 },
      { id:'segments', label:'Mesh Detail', min:4, max:64, default:32, step:4 }
    ],
    visualType: '3d_geometry'
  },
  {
    id: 'cylinder_geometry',
    name: 'Cylinder Geometry',
    category: 'geometry',
    description: 'See how height and radius affect cylinder volume and surface area.',
    formulaDisplay: 'V = πr²h  |  A = 2πr(r+h)',
    formulaExplanation: 'Volume scales with radius squared and height linearly',
    parameters: [
      { id:'radius', label:'Radius r', min:0.2, max:3, default:1, step:0.1 },
      { id:'height', label:'Height h', min:0.2, max:5, default:2, step:0.1 }
    ],
    visualType: '3d_geometry'
  },
  {
    id: 'derivative_tangent',
    name: 'Derivative — Tangent Line',
    category: 'calculus',
    description: 'Visualize the derivative as the slope of the tangent line at any point on a curve.',
    formulaDisplay: 'f(x) = x³ - 3x  →  f\'(x) = 3x² - 3',
    formulaExplanation: 'The tangent line slope at x₀ equals f\'(x₀) — the instantaneous rate of change',
    parameters: [
      { id:'x0', label:'Point x₀', min:-2.5, max:2.5, default:1, step:0.05 }
    ],
    visualType: '2d_curve'
  },
  {
    id: 'matrix_transform',
    name: '2D Linear Transformation',
    category: 'linear_algebra',
    description: 'See how a 2×2 matrix transforms a unit grid and standard basis vectors.',
    formulaDisplay: '[a b; c d] · v',
    formulaExplanation: 'Columns of the matrix show where basis vectors î and ĵ land after transformation',
    parameters: [
      { id:'a', label:'a (row1,col1)', min:-3, max:3, default:1, step:0.1 },
      { id:'b', label:'b (row1,col2)', min:-3, max:3, default:0, step:0.1 },
      { id:'c', label:'c (row2,col1)', min:-3, max:3, default:0, step:0.1 },
      { id:'d', label:'d (row2,col2)', min:-3, max:3, default:1, step:0.1 }
    ],
    visualType: '2d_curve'
  }
];

export default MATH_CONCEPTS;
