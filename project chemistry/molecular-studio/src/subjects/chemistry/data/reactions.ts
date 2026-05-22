export interface Reaction {
  id: string
  name: string
  reactants: string[]
  products: string[]
  equation: string
  type: 'Synthesis' | 'Decomposition' | 'Single Replacement' | 'Double Replacement' | 'Combustion'
  description: string
  energyChange: 'Exothermic' | 'Endothermic'
  visualEffect: 'explosion' | 'bubble' | 'color-change' | 'precipitate'
  colorEffect?: string
}

const REACTIONS: Reaction[] = [
  {
    id: 'combustion_methane',
    name: 'Combustion of Methane',
    reactants: ['CH₄', '2O₂'],
    products: ['CO₂', '2H₂O'],
    equation: 'CH₄ + 2O₂ → CO₂ + 2H₂O + Heat',
    type: 'Combustion',
    description: 'The burning of natural gas (methane) in the presence of oxygen. This highly exothermic reaction powers many homes and stoves.',
    energyChange: 'Exothermic',
    visualEffect: 'explosion',
    colorEffect: '#F97316' // Orange flame
  },
  {
    id: 'water_synthesis',
    name: 'Synthesis of Water',
    reactants: ['2H₂', 'O₂'],
    products: ['2H₂O'],
    equation: '2H₂ + O₂ → 2H₂O',
    type: 'Synthesis',
    description: 'Hydrogen gas reacts explosively with oxygen to form water vapor. This reaction powers hydrogen fuel cells and rocket engines.',
    energyChange: 'Exothermic',
    visualEffect: 'explosion',
    colorEffect: '#3B82F6' // Blue flash
  },
  {
    id: 'baking_soda_vinegar',
    name: 'Acid-Base Neutralization',
    reactants: ['NaHCO₃', 'HC₂H₃O₂'],
    products: ['NaC₂H₃O₂', 'H₂O', 'CO₂'],
    equation: 'NaHCO₃ + HC₂H₃O₂ → NaC₂H₃O₂ + H₂O + CO₂↑',
    type: 'Double Replacement',
    description: 'The classic volcano experiment. Baking soda and vinegar react to produce sodium acetate, water, and copious amounts of carbon dioxide gas bubbles.',
    energyChange: 'Endothermic', // Feels cold!
    visualEffect: 'bubble'
  },
  {
    id: 'elephants_toothpaste',
    name: 'Elephant\'s Toothpaste',
    reactants: ['2H₂O₂', '(KI catalyst)'],
    products: ['2H₂O', 'O₂'],
    equation: '2H₂O₂ → 2H₂O + O₂↑',
    type: 'Decomposition',
    description: 'The rapid decomposition of hydrogen peroxide, catalyzed by potassium iodide, produces massive amounts of oxygen gas trapped in soapy foam.',
    energyChange: 'Exothermic',
    visualEffect: 'bubble',
    colorEffect: '#FEF08A' // Yellowish foam
  },
  {
    id: 'silver_nitrate_copper',
    name: 'Silver Crystal Growth',
    reactants: ['Cu', '2AgNO₃'],
    products: ['Cu(NO₃)₂', '2Ag'],
    equation: 'Cu + 2AgNO₃ → Cu(NO₃)₂ + 2Ag↓',
    type: 'Single Replacement',
    description: 'A strip of copper placed in a silver nitrate solution will displace the silver, growing beautiful fractal silver crystals while the solution turns blue.',
    energyChange: 'Exothermic',
    visualEffect: 'precipitate',
    colorEffect: '#94A3B8' // Silver
  },
  {
    id: 'golden_rain',
    name: 'Golden Rain (Lead Iodide)',
    reactants: ['Pb(NO₃)₂', '2KI'],
    products: ['PbI₂', '2KNO₃'],
    equation: 'Pb(NO₃)₂ + 2KI → PbI₂↓ + 2KNO₃',
    type: 'Double Replacement',
    description: 'Mixing colorless lead nitrate and potassium iodide produces a stunning, brilliant yellow precipitate of lead iodide that looks like gold dust.',
    energyChange: 'Exothermic',
    visualEffect: 'color-change',
    colorEffect: '#FBBF24' // Brilliant yellow
  }
]

export default REACTIONS
