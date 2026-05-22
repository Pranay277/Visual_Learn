export const moleculesData = {
  methane: {
    id: "methane",
    name: "Methane (CH₄)",
    formula: "CH4",
    geometry: "Tetrahedral",
    hybridization: "sp³",
    bondAngle: "109.5°",
    neetFact: "Classic example of perfect sp³ hybridization with zero dipole moment due to symmetry.",
    atoms: [
      { id: 'c1', element: 'C', position: [0, 0, 0], color: '#3b3b3b', size: 1.2 },
      { id: 'h1', element: 'H', position: [0, 1.09, 0], color: '#ffffff', size: 0.8 },
      { id: 'h2', element: 'H', position: [1.03, -0.36, 0], color: '#ffffff', size: 0.8 },
      { id: 'h3', element: 'H', position: [-0.51, -0.36, 0.89], color: '#ffffff', size: 0.8 },
      { id: 'h4', element: 'H', position: [-0.51, -0.36, -0.89], color: '#ffffff', size: 0.8 }
    ],
    bonds: [
      { source: 'c1', target: 'h1' },
      { source: 'c1', target: 'h2' },
      { source: 'c1', target: 'h3' },
      { source: 'c1', target: 'h4' }
    ]
  },
  ammonia: {
    id: "ammonia",
    name: "Ammonia (NH₃)",
    formula: "NH3",
    geometry: "Trigonal Pyramidal",
    hybridization: "sp³",
    bondAngle: "107°",
    neetFact: "The presence of one lone pair repels bond pairs, reducing the angle from 109.5° to 107°.",
    atoms: [
      { id: 'n1', element: 'N', position: [0, 0, 0], color: '#3b82f6', size: 1.1 },
      { id: 'h1', element: 'H', position: [0, -0.38, 1.01], color: '#ffffff', size: 0.8 },
      { id: 'h2', element: 'H', position: [0.88, -0.38, -0.5], color: '#ffffff', size: 0.8 },
      { id: 'h3', element: 'H', position: [-0.88, -0.38, -0.5], color: '#ffffff', size: 0.8 }
    ],
    bonds: [
      { source: 'n1', target: 'h1' },
      { source: 'n1', target: 'h2' },
      { source: 'n1', target: 'h3' }
    ],
    lonePairs: [
      { id: 'lp1', position: [0, 0.8, 0], direction: [0, 1, 0] }
    ]
  },
  water: {
    id: "water",
    name: "Water (H₂O)",
    formula: "H2O",
    geometry: "Bent / V-shaped",
    hybridization: "sp³",
    bondAngle: "104.5°",
    neetFact: "Two lone pairs cause stronger repulsion (lp-lp > lp-bp > bp-bp), significantly compressing the bond angle to 104.5°.",
    atoms: [
      { id: 'o1', element: 'O', position: [0, 0, 0], color: '#ef4444', size: 1.1 },
      { id: 'h1', element: 'H', position: [0.76, -0.59, 0], color: '#ffffff', size: 0.8 },
      { id: 'h2', element: 'H', position: [-0.76, -0.59, 0], color: '#ffffff', size: 0.8 }
    ],
    bonds: [
      { source: 'o1', target: 'h1' },
      { source: 'o1', target: 'h2' }
    ],
    lonePairs: [
      { id: 'lp1', position: [0, 0.59, 0.76], direction: [0, 1, 1] },
      { id: 'lp2', position: [0, 0.59, -0.76], direction: [0, 1, -1] }
    ],
    annotations: [
      { position: [0, 0.8, 0], text: "Bent molecule (104.5°)" },
      { position: [0.38, -0.29, 0], text: "Polar bond" }
    ]
  },
  pcl5: {
    id: "pcl5",
    name: "Phosphorus Pentachloride (PCl₅)",
    formula: "PCl5",
    geometry: "Trigonal Bipyramidal",
    hybridization: "sp³d",
    bondAngle: "90° & 120°",
    neetFact: "Equatorial bonds are at 120°, axial bonds at 90°. Axial bonds are longer and weaker due to greater repulsion.",
    atoms: [
      { id: 'p1', element: 'P', position: [0, 0, 0], color: '#f59e0b', size: 1.3 },
      { id: 'cl1', element: 'Cl', position: [0, 1.6, 0], color: '#10b981', size: 1.1 }, // axial top
      { id: 'cl2', element: 'Cl', position: [0, -1.6, 0], color: '#10b981', size: 1.1 }, // axial bottom
      { id: 'cl3', element: 'Cl', position: [1.6, 0, 0], color: '#10b981', size: 1.1 }, // equatorial
      { id: 'cl4', element: 'Cl', position: [-0.8, 0, 1.38], color: '#10b981', size: 1.1 }, // equatorial
      { id: 'cl5', element: 'Cl', position: [-0.8, 0, -1.38], color: '#10b981', size: 1.1 } // equatorial
    ],
    bonds: [
      { source: 'p1', target: 'cl1' },
      { source: 'p1', target: 'cl2' },
      { source: 'p1', target: 'cl3' },
      { source: 'p1', target: 'cl4' },
      { source: 'p1', target: 'cl5' }
    ]
  },
  sf6: {
    id: "sf6",
    name: "Sulfur Hexafluoride (SF₆)",
    formula: "SF6",
    geometry: "Octahedral",
    hybridization: "sp³d²",
    bondAngle: "90°",
    neetFact: "Highly symmetrical octahedral shape makes it non-polar and chemically inert despite polar S-F bonds.",
    atoms: [
      { id: 's1', element: 'S', position: [0, 0, 0], color: '#eab308', size: 1.3 },
      { id: 'f1', element: 'F', position: [0, 1.5, 0], color: '#8b5cf6', size: 0.9 }, // top
      { id: 'f2', element: 'F', position: [0, -1.5, 0], color: '#8b5cf6', size: 0.9 }, // bottom
      { id: 'f3', element: 'F', position: [1.5, 0, 0], color: '#8b5cf6', size: 0.9 }, // right
      { id: 'f4', element: 'F', position: [-1.5, 0, 0], color: '#8b5cf6', size: 0.9 }, // left
      { id: 'f5', element: 'F', position: [0, 0, 1.5], color: '#8b5cf6', size: 0.9 }, // front
      { id: 'f6', element: 'F', position: [0, 0, -1.5], color: '#8b5cf6', size: 0.9 } // back
    ],
    bonds: [
      { source: 's1', target: 'f1' },
      { source: 's1', target: 'f2' },
      { source: 's1', target: 'f3' },
      { source: 's1', target: 'f4' },
      { source: 's1', target: 'f5' },
      { source: 's1', target: 'f6' }
    ]
  }
};
