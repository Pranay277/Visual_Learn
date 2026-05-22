export interface AtomData {
  id: string;
  label: string;
  element: string;
  position: [number, number, number];
  atomicNumber: number;
  mass: number;
  electronegativity: number;
  bondType: string;
}

export interface BondData {
  source: string;
  target: string;
  type: number;
}

export interface MoleculeData {
  id: string;
  name: string;
  formula: string;
  type: string;
  atoms: AtomData[];
  bonds: BondData[];
  properties: { [key: string]: string | number };
}

export const MOLECULES: MoleculeData[] = [
  {
    id: 'h2o',
    name: 'Water',
    formula: 'H₂O',
    type: 'Polar Covalent',
    atoms: [
      { id: 'O1', label: 'O', element: 'O', position: [0, 0, 0], atomicNumber: 8, mass: 16.00, electronegativity: 3.44, bondType: 'Polar Covalent' },
      { id: 'H1', label: 'H1', element: 'H', position: [-0.76, -0.59, 0], atomicNumber: 1, mass: 1.008, electronegativity: 2.20, bondType: 'Polar Covalent' },
      { id: 'H2', label: 'H2', element: 'H', position: [0.76, -0.59, 0], atomicNumber: 1, mass: 1.008, electronegativity: 2.20, bondType: 'Polar Covalent' },
    ],
    bonds: [
      { source: 'O1', target: 'H1', type: 1 },
      { source: 'O1', target: 'H2', type: 1 }
    ],
    properties: {
      'Molar Mass': '18.015 g/mol',
      'Boiling Point': '100 °C',
      'Geometry': 'Bent'
    }
  },
  {
    id: 'co2',
    name: 'Carbon Dioxide',
    formula: 'CO₂',
    type: 'Nonpolar Covalent',
    atoms: [
      { id: 'C1', label: 'C', element: 'C', position: [0, 0, 0], atomicNumber: 6, mass: 12.01, electronegativity: 2.55, bondType: 'Double Covalent' },
      { id: 'O1', label: 'O1', element: 'O', position: [-1.16, 0, 0], atomicNumber: 8, mass: 16.00, electronegativity: 3.44, bondType: 'Double Covalent' },
      { id: 'O2', label: 'O2', element: 'O', position: [1.16, 0, 0], atomicNumber: 8, mass: 16.00, electronegativity: 3.44, bondType: 'Double Covalent' },
    ],
    bonds: [
      { source: 'C1', target: 'O1', type: 2 },
      { source: 'C1', target: 'O2', type: 2 }
    ],
    properties: {
      'Molar Mass': '44.009 g/mol',
      'Boiling Point': '-78.5 °C (sublimes)',
      'Geometry': 'Linear'
    }
  },
  {
    id: 'ch4',
    name: 'Methane',
    formula: 'CH₄',
    type: 'Nonpolar Covalent',
    atoms: [
      { id: 'C1', label: 'C', element: 'C', position: [0, 0, 0], atomicNumber: 6, mass: 12.01, electronegativity: 2.55, bondType: 'Nonpolar Covalent' },
      { id: 'H1', label: 'H1', element: 'H', position: [0.63, 0.63, 0.63], atomicNumber: 1, mass: 1.008, electronegativity: 2.20, bondType: 'Nonpolar Covalent' },
      { id: 'H2', label: 'H2', element: 'H', position: [-0.63, -0.63, 0.63], atomicNumber: 1, mass: 1.008, electronegativity: 2.20, bondType: 'Nonpolar Covalent' },
      { id: 'H3', label: 'H3', element: 'H', position: [-0.63, 0.63, -0.63], atomicNumber: 1, mass: 1.008, electronegativity: 2.20, bondType: 'Nonpolar Covalent' },
      { id: 'H4', label: 'H4', element: 'H', position: [0.63, -0.63, -0.63], atomicNumber: 1, mass: 1.008, electronegativity: 2.20, bondType: 'Nonpolar Covalent' }
    ],
    bonds: [
      { source: 'C1', target: 'H1', type: 1 },
      { source: 'C1', target: 'H2', type: 1 },
      { source: 'C1', target: 'H3', type: 1 },
      { source: 'C1', target: 'H4', type: 1 }
    ],
    properties: {
      'Molar Mass': '16.04 g/mol',
      'Boiling Point': '-161.5 °C',
      'Geometry': 'Tetrahedral'
    }
  },
  {
    id: 'nh3',
    name: 'Ammonia',
    formula: 'NH₃',
    type: 'Polar Covalent',
    atoms: [
      { id: 'N1', label: 'N', element: 'N', position: [0, 0.22, 0], atomicNumber: 7, mass: 14.01, electronegativity: 3.04, bondType: 'Polar Covalent' },
      { id: 'H1', label: 'H1', element: 'H', position: [0, -0.15, 0.94], atomicNumber: 1, mass: 1.008, electronegativity: 2.20, bondType: 'Polar Covalent' },
      { id: 'H2', label: 'H2', element: 'H', position: [0.81, -0.15, -0.47], atomicNumber: 1, mass: 1.008, electronegativity: 2.20, bondType: 'Polar Covalent' },
      { id: 'H3', label: 'H3', element: 'H', position: [-0.81, -0.15, -0.47], atomicNumber: 1, mass: 1.008, electronegativity: 2.20, bondType: 'Polar Covalent' }
    ],
    bonds: [
      { source: 'N1', target: 'H1', type: 1 },
      { source: 'N1', target: 'H2', type: 1 },
      { source: 'N1', target: 'H3', type: 1 }
    ],
    properties: {
      'Molar Mass': '17.031 g/mol',
      'Boiling Point': '-33.34 °C',
      'Geometry': 'Trigonal Pyramidal'
    }
  },
  {
    id: 'o2',
    name: 'Oxygen Gas',
    formula: 'O₂',
    type: 'Nonpolar Covalent',
    atoms: [
      { id: 'O1', label: 'O1', element: 'O', position: [-0.6, 0, 0], atomicNumber: 8, mass: 16.00, electronegativity: 3.44, bondType: 'Double Covalent' },
      { id: 'O2', label: 'O2', element: 'O', position: [0.6, 0, 0], atomicNumber: 8, mass: 16.00, electronegativity: 3.44, bondType: 'Double Covalent' }
    ],
    bonds: [
      { source: 'O1', target: 'O2', type: 2 }
    ],
    properties: {
      'Molar Mass': '31.999 g/mol',
      'Boiling Point': '-183 °C',
      'Geometry': 'Linear'
    }
  },
  {
    id: 'hcl',
    name: 'Hydrogen Chloride',
    formula: 'HCl',
    type: 'Polar Covalent',
    atoms: [
      { id: 'H1', label: 'H', element: 'H', position: [-0.64, 0, 0], atomicNumber: 1, mass: 1.008, electronegativity: 2.20, bondType: 'Polar Covalent' },
      { id: 'Cl1', label: 'Cl', element: 'Cl', position: [0.64, 0, 0], atomicNumber: 17, mass: 35.45, electronegativity: 3.16, bondType: 'Polar Covalent' }
    ],
    bonds: [
      { source: 'H1', target: 'Cl1', type: 1 }
    ],
    properties: {
      'Molar Mass': '36.46 g/mol',
      'Boiling Point': '-85.05 °C',
      'Geometry': 'Linear'
    }
  },
  {
    id: 'bf3',
    name: 'Boron Trifluoride',
    formula: 'BF₃',
    type: 'Polar Covalent',
    atoms: [
      { id: 'B1', label: 'B', element: 'B', position: [0, 0, 0], atomicNumber: 5, mass: 10.81, electronegativity: 2.04, bondType: 'Polar Covalent' },
      { id: 'F1', label: 'F1', element: 'F', position: [0, 1.3, 0], atomicNumber: 9, mass: 18.998, electronegativity: 3.98, bondType: 'Polar Covalent' },
      { id: 'F2', label: 'F2', element: 'F', position: [1.13, -0.65, 0], atomicNumber: 9, mass: 18.998, electronegativity: 3.98, bondType: 'Polar Covalent' },
      { id: 'F3', label: 'F3', element: 'F', position: [-1.13, -0.65, 0], atomicNumber: 9, mass: 18.998, electronegativity: 3.98, bondType: 'Polar Covalent' }
    ],
    bonds: [
      { source: 'B1', target: 'F1', type: 1 },
      { source: 'B1', target: 'F2', type: 1 },
      { source: 'B1', target: 'F3', type: 1 }
    ],
    properties: {
      'Molar Mass': '67.81 g/mol',
      'Boiling Point': '-100.3 °C',
      'Geometry': 'Trigonal Planar'
    }
  }
];

export default MOLECULES;
