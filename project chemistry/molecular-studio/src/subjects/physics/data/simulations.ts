export interface SimulationVariable {
  id: string
  label: string
  unit: string
  min: number
  max: number
  default: number
  step: number
}

export interface SimulationData {
  id: string
  name: string
  category: 'mechanics' | 'electromagnetism' | 'thermodynamics' | 'optics' | 'waves'
  description: string
  variables: SimulationVariable[]
  formulaDisplay: string
  formulaExplanation: string
}

const SIMULATIONS: SimulationData[] = [
  {
    id: 'projectile_motion',
    name: 'Projectile Motion',
    category: 'mechanics',
    description: 'Explore how launch angle and velocity affect the trajectory of a projectile under gravity.',
    variables: [
      { id:'velocity', label:'Initial Velocity', unit:'m/s', min:5, max:100, default:30, step:1 },
      { id:'angle', label:'Launch Angle', unit:'°', min:1, max:89, default:45, step:1 },
      { id:'gravity', label:'Gravity', unit:'m/s²', min:1.6, max:24.8, default:9.8, step:0.1 },
      { id:'mass', label:'Mass', unit:'kg', min:0.1, max:100, default:1, step:0.1 }
    ],
    formulaDisplay: 'R = (v₀² × sin(2θ)) / g',
    formulaExplanation: 'Range R depends on initial velocity squared divided by gravity, maximized at 45°'
  },
  {
    id: 'pendulum',
    name: 'Simple Pendulum',
    category: 'mechanics',
    description: 'Visualize oscillation period as a function of pendulum length and gravity.',
    variables: [
      { id:'length', label:'Pendulum Length', unit:'m', min:0.1, max:5, default:1, step:0.1 },
      { id:'gravity', label:'Gravity', unit:'m/s²', min:1.6, max:24.8, default:9.8, step:0.1 },
      { id:'angle', label:'Initial Angle', unit:'°', min:1, max:45, default:15, step:1 }
    ],
    formulaDisplay: 'T = 2π√(L/g)',
    formulaExplanation: 'Period T is independent of mass and amplitude (for small angles)'
  },
  {
    id: 'spring_oscillator',
    name: 'Spring Oscillator',
    category: 'mechanics',
    description: 'See Hooke\'s Law in action with a mass on a spring.',
    variables: [
      { id:'spring_constant', label:'Spring Constant', unit:'N/m', min:1, max:200, default:50, step:1 },
      { id:'mass', label:'Mass', unit:'kg', min:0.1, max:10, default:1, step:0.1 },
      { id:'amplitude', label:'Amplitude', unit:'m', min:0.1, max:2, default:0.5, step:0.05 }
    ],
    formulaDisplay: 'T = 2π√(m/k)',
    formulaExplanation: 'Period T increases with mass and decreases with spring stiffness k'
  },
  {
    id: 'electric_field',
    name: 'Electric Field Lines',
    category: 'electromagnetism',
    description: 'Visualize the electric field between point charges.',
    variables: [
      { id:'charge1', label:'Charge 1', unit:'μC', min:-10, max:10, default:1, step:0.5 },
      { id:'charge2', label:'Charge 2', unit:'μC', min:-10, max:10, default:-1, step:0.5 },
      { id:'distance', label:'Separation', unit:'m', min:0.5, max:5, default:2, step:0.1 }
    ],
    formulaDisplay: 'F = k(q₁q₂)/r²',
    formulaExplanation: 'Coulomb force is proportional to the product of charges and inversely proportional to distance squared'
  },
  {
    id: 'wave_interference',
    name: 'Wave Interference',
    category: 'waves',
    description: 'Observe constructive and destructive interference patterns.',
    variables: [
      { id:'frequency1', label:'Frequency 1', unit:'Hz', min:0.5, max:5, default:2, step:0.1 },
      { id:'frequency2', label:'Frequency 2', unit:'Hz', min:0.5, max:5, default:2.5, step:0.1 },
      { id:'amplitude1', label:'Amplitude 1', unit:'m', min:0.1, max:2, default:1, step:0.1 },
      { id:'amplitude2', label:'Amplitude 2', unit:'m', min:0.1, max:2, default:1, step:0.1 }
    ],
    formulaDisplay: 'y = A₁sin(2πf₁t) + A₂sin(2πf₂t)',
    formulaExplanation: 'Superposition of two waves — interference pattern depends on frequency difference'
  },
  {
    id: 'optics_refraction',
    name: 'Snell\'s Law — Refraction',
    category: 'optics',
    description: 'Trace a light ray through two optical media with adjustable refractive indices.',
    variables: [
      { id:'n1', label:'Medium 1 Index', unit:'', min:1, max:2.5, default:1, step:0.05 },
      { id:'n2', label:'Medium 2 Index', unit:'', min:1, max:2.5, default:1.5, step:0.05 },
      { id:'incident_angle', label:'Incident Angle', unit:'°', min:1, max:89, default:30, step:1 }
    ],
    formulaDisplay: 'n₁sin(θ₁) = n₂sin(θ₂)',
    formulaExplanation: 'The refracted angle depends on the ratio of refractive indices'
  }
];

export default SIMULATIONS;
