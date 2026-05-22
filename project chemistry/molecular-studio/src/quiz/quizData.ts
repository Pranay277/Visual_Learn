export interface QuizOption {
  id: string
  text: string
}

export interface QuizQuestion {
  id: string
  subject: 'biology' | 'chemistry' | 'physics' | 'maths' | 'programming'
  topic: string
  difficulty: 'easy' | 'medium' | 'hard'
  question: string
  options: QuizOption[]
  correctOptionId: string
  explanation: string
  youtubeSearchQuery: string
}

export interface QuizResult {
  questionId: string
  topic: string
  subject: string
  correct: boolean
  timeSpentSeconds: number
}

export interface SubjectQuizScore {
  subject: string
  totalQuestions: number
  correctAnswers: number
  percentage: number
  weakTopics: string[]
  strongTopics: string[]
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  // --- BIOLOGY ---
  // Topic: "cardiovascular system"
  {
    id: 'bio_cv_1',
    subject: 'biology',
    topic: 'cardiovascular system',
    difficulty: 'easy',
    question: 'What is the main function of the left ventricle?',
    options: [
      { id: 'a', text: 'Receives oxygenated blood from lungs' },
      { id: 'b', text: 'Pumps oxygenated blood to the entire body' },
      { id: 'c', text: 'Filters blood for the kidneys' },
      { id: 'd', text: 'Stores blood between heartbeats' }
    ],
    correctOptionId: 'b',
    explanation: "The left ventricle is the heart's most powerful chamber — it pumps freshly oxygenated blood out through the aorta to the entire body. Its thick muscular walls are needed because it works against the high pressure of systemic circulation.",
    youtubeSearchQuery: 'left ventricle heart function explained'
  },
  {
    id: 'bio_cv_2',
    subject: 'biology',
    topic: 'cardiovascular system',
    difficulty: 'medium',
    question: "What causes the 'lub-dub' sound of a heartbeat?",
    options: [
      { id: 'a', text: 'Blood rushing through arteries' },
      { id: 'b', text: 'The heart muscle contracting' },
      { id: 'c', text: 'Heart valves opening and closing' },
      { id: 'd', text: 'Electrical signals firing' }
    ],
    correctOptionId: 'c',
    explanation: "The 'lub' is the mitral and tricuspid valves snapping shut at the start of systole. The 'dub' is the aortic and pulmonary valves closing at the end of systole. Damaged valves produce murmurs — extra sounds between these two.",
    youtubeSearchQuery: 'heart sounds lub dub valve explained'
  },
  {
    id: 'bio_cv_3',
    subject: 'biology',
    topic: 'cardiovascular system',
    difficulty: 'hard',
    question: 'During ventricular systole, which event occurs first?',
    options: [
      { id: 'a', text: 'Aortic valve opens' },
      { id: 'b', text: 'Mitral valve closes' },
      { id: 'c', text: 'Blood enters the aorta' },
      { id: 'd', text: 'Pulmonary valve opens' }
    ],
    correctOptionId: 'b',
    explanation: "The sequence is: mitral valve closes (end of diastole) → ventricular pressure rises → aortic valve opens → blood ejects. The mitral valve must close before ventricular pressure can build sufficiently to force the aortic valve open.",
    youtubeSearchQuery: 'cardiac cycle ventricular systole phases'
  },

  // Topic: "respiratory system"
  {
    id: 'bio_resp_1',
    subject: 'biology',
    topic: 'respiratory system',
    difficulty: 'easy',
    question: 'What is the primary function of the alveoli?',
    options: [
      { id: 'a', text: 'Filter dust from air' },
      { id: 'b', text: 'Exchange oxygen and carbon dioxide with blood' },
      { id: 'c', text: 'Produce mucus to trap pathogens' },
      { id: 'd', text: 'Warm incoming air' }
    ],
    correctOptionId: 'b',
    explanation: "Alveoli are tiny air sacs at the end of bronchioles where gas exchange happens. Their walls are just one cell thick and surrounded by capillaries — oxygen diffuses in, CO2 diffuses out, across this incredibly thin barrier.",
    youtubeSearchQuery: 'alveoli gas exchange respiratory system'
  },
  {
    id: 'bio_resp_2',
    subject: 'biology',
    topic: 'respiratory system',
    difficulty: 'medium',
    question: 'Why does breathing rate increase during exercise?',
    options: [
      { id: 'a', text: 'Lungs get larger' },
      { id: 'b', text: 'More CO2 accumulates in blood triggering faster breathing' },
      { id: 'c', text: 'The brain directly commands faster breathing as a reflex' },
      { id: 'd', text: 'Oxygen levels drop immediately in the blood' }
    ],
    correctOptionId: 'b',
    explanation: "Rising CO2 (not falling O2) is the primary driver. Chemoreceptors in the medulla oblongata and carotid arteries detect increased blood CO2 and acidity — they signal the respiratory center to increase breathing rate and depth.",
    youtubeSearchQuery: 'breathing rate control chemoreceptors CO2'
  },
  {
    id: 'bio_resp_3',
    subject: 'biology',
    topic: 'respiratory system',
    difficulty: 'hard',
    question: 'What is the partial pressure of oxygen in alveolar air approximately?',
    options: [
      { id: 'a', text: '21 kPa' },
      { id: 'b', text: '13.3 kPa' },
      { id: 'c', text: '5.3 kPa' },
      { id: 'd', text: '0.5 kPa' }
    ],
    correctOptionId: 'b',
    explanation: "Although atmospheric O2 is ~21 kPa, alveolar pO2 is ~13.3 kPa because it is diluted by water vapor and CO2. This gradient (13.3 kPa alveolar vs ~5.3 kPa venous blood) drives oxygen diffusion into the capillaries.",
    youtubeSearchQuery: 'partial pressure oxygen alveoli diffusion'
  },

  // Topic: "nervous system"
  {
    id: 'bio_nerv_1',
    subject: 'biology',
    topic: 'nervous system',
    difficulty: 'easy',
    question: 'What is a synapse?',
    options: [
      { id: 'a', text: 'The cell body of a neuron' },
      { id: 'b', text: 'The junction between two neurons where signals are transmitted' },
      { id: 'c', text: 'The protective sheath around a nerve fiber' },
      { id: 'd', text: 'The electrical charge inside a neuron' }
    ],
    correctOptionId: 'b',
    explanation: "A synapse is the tiny gap between a presynaptic neuron and the next cell. Chemical signals called neurotransmitters cross this gap — acetylcholine, dopamine, serotonin are examples. The synapse is where learning and memory physically occur.",
    youtubeSearchQuery: 'synapse neurotransmitter explained'
  },
  {
    id: 'bio_nerv_2',
    subject: 'biology',
    topic: 'nervous system',
    difficulty: 'medium',
    question: 'What is the role of myelin sheath in signal conduction?',
    options: [
      { id: 'a', text: 'Generates the electrical signal' },
      { id: 'b', text: 'Carries oxygen to the neuron' },
      { id: 'c', text: 'Insulates the axon and speeds up signal conduction' },
      { id: 'd', text: 'Stores neurotransmitters' }
    ],
    correctOptionId: 'c',
    explanation: "Myelin sheath is a fatty insulating layer formed by Schwann cells (PNS) or oligodendrocytes (CNS). It forces the action potential to 'jump' between nodes of Ranvier (saltatory conduction), increasing speed from 1 m/s to over 100 m/s.",
    youtubeSearchQuery: 'myelin sheath saltatory conduction speed'
  },
  {
    id: 'bio_nerv_3',
    subject: 'biology',
    topic: 'nervous system',
    difficulty: 'hard',
    question: 'During an action potential, what causes repolarization?',
    options: [
      { id: 'a', text: 'Na⁺ ions rush into the cell' },
      { id: 'b', text: 'K⁺ channels open and K⁺ flows out' },
      { id: 'c', text: 'Cl⁻ ions enter the cell' },
      { id: 'd', text: 'The sodium-potassium pump immediately restores balance' }
    ],
    correctOptionId: 'b',
    explanation: "Depolarization: voltage-gated Na⁺ channels open, Na⁺ rushes in. Repolarization: Na⁺ channels inactivate, voltage-gated K⁺ channels open, K⁺ rushes out — restoring negative charge. The Na⁺/K⁺ pump later restores the original ion balance.",
    youtubeSearchQuery: 'action potential repolarization potassium channels'
  },

  // Topic: "cell biology"
  {
    id: 'bio_cell_1',
    subject: 'biology',
    topic: 'cell biology',
    difficulty: 'easy',
    question: "Which organelle is called the 'powerhouse of the cell'?",
    options: [
      { id: 'a', text: 'Nucleus' },
      { id: 'b', text: 'Ribosome' },
      { id: 'c', text: 'Mitochondria' },
      { id: 'd', text: 'Golgi apparatus' }
    ],
    correctOptionId: 'c',
    explanation: "Mitochondria generate ATP (adenosine triphosphate) through cellular respiration — the process of oxidising glucose to release energy. A typical cell has hundreds to thousands of mitochondria depending on its energy demands.",
    youtubeSearchQuery: 'mitochondria ATP cellular respiration'
  },
  {
    id: 'bio_cell_2',
    subject: 'biology',
    topic: 'cell biology',
    difficulty: 'medium',
    question: 'What is the function of the Golgi apparatus?',
    options: [
      { id: 'a', text: 'Synthesizes proteins' },
      { id: 'b', text: 'Produces energy' },
      { id: 'c', text: 'Modifies, packages and ships proteins' },
      { id: 'd', text: 'Controls cell division' }
    ],
    correctOptionId: 'c',
    explanation: "The Golgi apparatus is the cell's 'post office'. Proteins made by ribosomes are sent here, modified (glycosylation, phosphorylation), sorted, and packaged into vesicles for delivery to their destination — inside or outside the cell.",
    youtubeSearchQuery: 'Golgi apparatus function protein packaging'
  },
  {
    id: 'bio_cell_3',
    subject: 'biology',
    topic: 'cell biology',
    difficulty: 'hard',
    question: 'Why does the endoplasmic reticulum have ribosomes on rough ER but not smooth ER?',
    options: [
      { id: 'a', text: 'Smooth ER is newer and hasn\'t developed ribosomes yet' },
      { id: 'b', text: 'Rough ER is specifically for synthesizing membrane/secretory proteins that need to enter the ER lumen' },
      { id: 'c', text: 'Ribosomes fall off smooth ER during lipid synthesis' },
      { id: 'd', text: 'Smooth ER has more surface area and doesn\'t need ribosomes' }
    ],
    correctOptionId: 'b',
    explanation: "Rough ER ribosomes synthesize proteins destined for secretion or membrane insertion. The ribosome feeds the growing protein directly into the ER lumen as it synthesizes it. Smooth ER lacks ribosomes because it focuses on lipid synthesis, detoxification, and calcium storage.",
    youtubeSearchQuery: 'rough smooth endoplasmic reticulum difference function'
  },

  // Topic: "digestive system"
  {
    id: 'bio_dig_1',
    subject: 'biology',
    topic: 'digestive system',
    difficulty: 'easy',
    question: 'Where does most chemical digestion of food occur?',
    options: [
      { id: 'a', text: 'Mouth' },
      { id: 'b', text: 'Stomach' },
      { id: 'c', text: 'Small intestine' },
      { id: 'd', text: 'Large intestine' }
    ],
    correctOptionId: 'c',
    explanation: "The small intestine is where the majority of chemical digestion and nutrient absorption happens. Bile from the liver emulsifies fats, pancreatic enzymes break down proteins, fats, and carbohydrates, and intestinal villi absorb the products into the bloodstream.",
    youtubeSearchQuery: 'small intestine digestion absorption villi'
  },
  {
    id: 'bio_dig_2',
    subject: 'biology',
    topic: 'digestive system',
    difficulty: 'medium',
    question: 'What is the role of hydrochloric acid (HCl) in the stomach?',
    options: [
      { id: 'a', text: 'Breaks down carbohydrates' },
      { id: 'b', text: 'Activates pepsinogen into pepsin and kills bacteria' },
      { id: 'c', text: 'Emulsifies fats' },
      { id: 'd', text: 'Neutralizes food before entering the intestine' }
    ],
    correctOptionId: 'b',
    explanation: "HCl (pH 1.5–3.5) converts inactive pepsinogen into active pepsin for protein digestion, and kills most ingested bacteria. The stomach protects itself with a thick mucus layer — H. pylori bacteria that break through this layer cause gastric ulcers.",
    youtubeSearchQuery: 'stomach HCl acid pepsin digestion'
  },
  {
    id: 'bio_dig_3',
    subject: 'biology',
    topic: 'digestive system',
    difficulty: 'hard',
    question: 'What drives the absorption of glucose from the small intestine into intestinal cells?',
    options: [
      { id: 'a', text: 'Facilitated diffusion using GLUT2 alone' },
      { id: 'b', text: 'Secondary active transport co-transported with Na⁺' },
      { id: 'c', text: 'Simple diffusion down concentration gradient' },
      { id: 'd', text: 'Primary active transport using ATP directly' }
    ],
    correctOptionId: 'b',
    explanation: "Glucose uses the SGLT1 (sodium-glucose cotransporter) — a secondary active transport mechanism. Na⁺ flows down its electrochemical gradient (maintained by the Na⁺/K⁺ ATPase pump) and drags glucose with it against its own concentration gradient.",
    youtubeSearchQuery: 'glucose absorption SGLT1 secondary active transport intestine'
  },

  // --- CHEMISTRY ---
  // Topic: "molecular geometry"
  {
    id: 'chem_geom_1',
    subject: 'chemistry',
    topic: 'molecular geometry',
    difficulty: 'easy',
    question: 'What is the shape of a water molecule (H₂O)?',
    options: [
      { id: 'a', text: 'Linear' },
      { id: 'b', text: 'Tetrahedral' },
      { id: 'c', text: 'Bent/V-shaped' },
      { id: 'd', text: 'Trigonal planar' }
    ],
    correctOptionId: 'c',
    explanation: "H₂O has 4 electron pairs around oxygen (2 bonding, 2 lone pairs). VSEPR theory: lone pairs repel more than bonding pairs, compressing the H-O-H bond angle from 109.5° to ~104.5°, creating the distinctive bent shape.",
    youtubeSearchQuery: 'water molecule bent shape VSEPR'
  },
  {
    id: 'chem_geom_2',
    subject: 'chemistry',
    topic: 'molecular geometry',
    difficulty: 'medium',
    question: 'Why is CO₂ linear but H₂O is bent, even though both have the same number of bonded atoms?',
    options: [
      { id: 'a', text: 'CO₂ has double bonds which make it linear' },
      { id: 'b', text: 'CO₂ carbon has no lone pairs so electron pairs are symmetrical' },
      { id: 'c', text: 'Oxygen is more electronegative in H₂O' },
      { id: 'd', text: 'CO₂ has a higher molecular mass' }
    ],
    correctOptionId: 'b',
    explanation: "Carbon in CO₂ has zero lone pairs — only two double bonds, giving linear geometry. Oxygen in H₂O has two lone pairs which occupy more space than bonding pairs, pushing the hydrogen atoms down and bending the molecule.",
    youtubeSearchQuery: 'CO2 linear H2O bent VSEPR lone pairs'
  },
  {
    id: 'chem_geom_3',
    subject: 'chemistry',
    topic: 'molecular geometry',
    difficulty: 'hard',
    question: 'What is the bond angle in methane (CH₄) and why?',
    options: [
      { id: 'a', text: '90° — square planar geometry' },
      { id: 'b', text: '120° — trigonal planar' },
      { id: 'c', text: '109.5° — tetrahedral geometry with 4 equivalent bonding pairs' },
      { id: 'd', text: '104.5° — like water' }
    ],
    correctOptionId: 'c',
    explanation: "Carbon has 4 bonding pairs and 0 lone pairs. VSEPR predicts tetrahedral geometry — 4 equivalent repulsions push bonds to the maximum separation angle of 109.5°. This is the perfect tetrahedral angle found in diamond and sp3-hybridized carbon.",
    youtubeSearchQuery: 'methane tetrahedral bond angle 109.5 VSEPR'
  },

  // Topic: "periodic table trends"
  {
    id: 'chem_per_1',
    subject: 'chemistry',
    topic: 'periodic table trends',
    difficulty: 'easy',
    question: 'What happens to atomic radius as you move LEFT to RIGHT across a period?',
    options: [
      { id: 'a', text: 'Increases' },
      { id: 'b', text: 'Decreases' },
      { id: 'c', text: 'Stays the same' },
      { id: 'd', text: 'First increases then decreases' }
    ],
    correctOptionId: 'b',
    explanation: "Moving left to right, the number of protons increases while electrons are added to the same shell. The increased nuclear charge pulls electrons closer to the nucleus — atomic radius decreases across a period.",
    youtubeSearchQuery: 'atomic radius trend periodic table period'
  },
  {
    id: 'chem_per_2',
    subject: 'chemistry',
    topic: 'periodic table trends',
    difficulty: 'medium',
    question: 'Why does ionization energy generally increase across a period?',
    options: [
      { id: 'a', text: 'Atoms get heavier and electrons are harder to remove' },
      { id: 'b', text: 'Increasing nuclear charge holds electrons more tightly' },
      { id: 'c', text: 'More electron shells increase the attraction' },
      { id: 'd', text: 'Valence electrons become paired and harder to remove' }
    ],
    correctOptionId: 'b',
    explanation: "As nuclear charge increases across a period (same electron shell), the effective nuclear charge experienced by valence electrons increases. More nuclear charge = electrons held more tightly = more energy needed to remove them.",
    youtubeSearchQuery: 'ionization energy trend periodic table nuclear charge'
  },
  {
    id: 'chem_per_3',
    subject: 'chemistry',
    topic: 'periodic table trends',
    difficulty: 'hard',
    question: 'Why does Oxygen have a slightly LOWER first ionization energy than Nitrogen, despite being further right?',
    options: [
      { id: 'a', text: 'Oxygen has more electron-electron repulsion due to paired electrons in 2p orbitals' },
      { id: 'b', text: 'Nitrogen is a gas and oxygen is more reactive' },
      { id: 'c', text: 'Oxygen has a higher atomic mass' },
      { id: 'd', text: 'The 2p orbital of oxygen is at a lower energy level' }
    ],
    correctOptionId: 'a',
    explanation: "Nitrogen has 3 half-filled 2p orbitals (extra stability from exchange energy). Oxygen must pair an electron in a 2p orbital — the electron-electron repulsion in that paired orbital makes it easier to remove than Nitrogen's unpaired electron.",
    youtubeSearchQuery: 'oxygen ionization energy lower nitrogen exception'
  },

  // Topic: "chemical bonding"
  {
    id: 'chem_bond_1',
    subject: 'chemistry',
    topic: 'chemical bonding',
    difficulty: 'easy',
    question: 'What type of bond forms between a metal and a non-metal?',
    options: [
      { id: 'a', text: 'Covalent bond' },
      { id: 'b', text: 'Ionic bond' },
      { id: 'c', text: 'Metallic bond' },
      { id: 'd', text: 'Hydrogen bond' }
    ],
    correctOptionId: 'b',
    explanation: "Ionic bonds form when a metal transfers electrons to a non-metal. The metal becomes a positive cation, the non-metal becomes a negative anion, and the electrostatic attraction between oppositely charged ions forms the ionic bond.",
    youtubeSearchQuery: 'ionic bond metal non-metal electron transfer'
  },
  {
    id: 'chem_bond_2',
    subject: 'chemistry',
    topic: 'chemical bonding',
    difficulty: 'medium',
    question: 'What makes a covalent bond polar?',
    options: [
      { id: 'a', text: 'The bond involves two different elements' },
      { id: 'b', text: 'A difference in electronegativity between bonded atoms causes unequal electron sharing' },
      { id: 'c', text: 'One atom is larger than the other' },
      { id: 'd', text: 'The molecule has an odd number of electrons' }
    ],
    correctOptionId: 'b',
    explanation: "When two atoms with different electronegativities bond, the more electronegative atom pulls electron density toward itself, creating a partial negative charge (δ-) on that atom and partial positive (δ+) on the other. The greater the electronegativity difference, the more polar the bond.",
    youtubeSearchQuery: 'polar covalent bond electronegativity difference'
  },
  {
    id: 'chem_bond_3',
    subject: 'chemistry',
    topic: 'chemical bonding',
    difficulty: 'hard',
    question: 'Why does ice float on water? (relates to hydrogen bonding)',
    options: [
      { id: 'a', text: 'Ice contains trapped air bubbles that reduce density' },
      { id: 'b', text: 'Hydrogen bonds in ice form a hexagonal lattice that is LESS dense than liquid water' },
      { id: 'c', text: 'Water molecules in ice are moving faster' },
      { id: 'd', text: 'Ice has a lower molecular mass than liquid water' }
    ],
    correctOptionId: 'b',
    explanation: "In liquid water, hydrogen bonds constantly break and reform — molecules pack relatively close. In ice, each water molecule forms exactly 4 hydrogen bonds in a rigid hexagonal lattice. This open structure is LESS dense (more space between molecules) — making ice float.",
    youtubeSearchQuery: 'ice floats water hydrogen bonding hexagonal lattice density'
  },

  // Topic: "reaction types"
  {
    id: 'chem_rxn_1',
    subject: 'chemistry',
    topic: 'reaction types',
    difficulty: 'easy',
    question: 'In the reaction 2H₂ + O₂ → 2H₂O, what type of reaction is this?',
    options: [
      { id: 'a', text: 'Decomposition' },
      { id: 'b', text: 'Single displacement' },
      { id: 'c', text: 'Synthesis/Combination' },
      { id: 'd', text: 'Acid-base neutralization' }
    ],
    correctOptionId: 'c',
    explanation: "A synthesis (combination) reaction: two or more reactants combine to form a single product. Here hydrogen and oxygen combine to form water. The reaction releases significant energy — it is the reaction used in hydrogen fuel cells.",
    youtubeSearchQuery: 'synthesis reaction hydrogen oxygen water formation'
  },
  {
    id: 'chem_rxn_2',
    subject: 'chemistry',
    topic: 'reaction types',
    difficulty: 'medium',
    question: 'What does it mean to balance a chemical equation?',
    options: [
      { id: 'a', text: 'Make the reactants and products have the same mass' },
      { id: 'b', text: 'Ensure the number of each type of atom is equal on both sides' },
      { id: 'c', text: 'Make the equation aesthetically symmetric' },
      { id: 'd', text: 'Ensure both sides have the same number of molecules' }
    ],
    correctOptionId: 'b',
    explanation: "The Law of Conservation of Mass: atoms are neither created nor destroyed in a chemical reaction. Balancing ensures atom count is equal on each side. You adjust coefficients (never subscripts) to balance — changing subscripts would change the substance itself.",
    youtubeSearchQuery: 'balancing chemical equations conservation of mass'
  },
  {
    id: 'chem_rxn_3',
    subject: 'chemistry',
    topic: 'reaction types',
    difficulty: 'hard',
    question: 'In the combustion of methane: CH₄ + 2O₂ → CO₂ + 2H₂O, what is oxidized?',
    options: [
      { id: 'a', text: 'Oxygen' },
      { id: 'b', text: 'Carbon in CH₄' },
      { id: 'c', text: 'Hydrogen' },
      { id: 'd', text: 'The CO₂ product' }
    ],
    correctOptionId: 'b',
    explanation: "Oxidation = increase in oxidation state. Carbon in CH₄ has oxidation state -4. In CO₂, carbon is +4. It lost electrons (increased oxidation state) — it was oxidized. Oxygen went from 0 to -2 (gained electrons = reduced). This is a redox reaction.",
    youtubeSearchQuery: 'oxidation reduction combustion methane redox'
  },

  // --- PHYSICS ---
  // Topic: "mechanics"
  {
    id: 'phys_mech_1',
    subject: 'physics',
    topic: 'mechanics',
    difficulty: 'easy',
    question: "What is Newton's Second Law of Motion?",
    options: [
      { id: 'a', text: 'Every action has an equal and opposite reaction' },
      { id: 'b', text: 'An object stays at rest unless a force acts on it' },
      { id: 'c', text: 'Force equals mass times acceleration (F = ma)' },
      { id: 'd', text: 'Energy is always conserved in a closed system' }
    ],
    correctOptionId: 'c',
    explanation: "F = ma is Newton's Second Law. A net force on an object causes acceleration proportional to the force and inversely proportional to mass. Double the force → double the acceleration. Double the mass → half the acceleration for the same force.",
    youtubeSearchQuery: 'Newton second law F=ma explained'
  },
  {
    id: 'phys_mech_2',
    subject: 'physics',
    topic: 'mechanics',
    difficulty: 'medium',
    question: 'A ball is thrown horizontally from a cliff. What is the horizontal acceleration of the ball (ignoring air resistance)?',
    options: [
      { id: 'a', text: '9.8 m/s² downward' },
      { id: 'b', text: '9.8 m/s² horizontal' },
      { id: 'c', text: '0 m/s² — no horizontal force acts on it' },
      { id: 'd', text: 'Decreases as the ball falls' }
    ],
    correctOptionId: 'c',
    explanation: "In projectile motion (no air resistance), the only force is gravity — acting vertically. There is zero horizontal force, so horizontal acceleration = 0. Horizontal velocity remains constant throughout the flight. Gravity only affects the vertical component.",
    youtubeSearchQuery: 'projectile motion horizontal acceleration zero'
  },
  {
    id: 'phys_mech_3',
    subject: 'physics',
    topic: 'mechanics',
    difficulty: 'hard',
    question: 'At what launch angle does a projectile achieve maximum range on flat ground?',
    options: [
      { id: 'a', text: '30°' },
      { id: 'b', text: '60°' },
      { id: 'c', text: '90°' },
      { id: 'd', text: '45°' }
    ],
    correctOptionId: 'd',
    explanation: "Range R = v₀²sin(2θ)/g is maximized when sin(2θ) = 1, i.e. 2θ = 90°, so θ = 45°. At 45°, horizontal and vertical components are equal, perfectly balancing time-of-flight (vertical) against horizontal speed. Complementary angles (30° and 60°) give the same range.",
    youtubeSearchQuery: 'projectile motion maximum range 45 degrees'
  },

  // Topic: "waves and optics"
  {
    id: 'phys_wav_1',
    subject: 'physics',
    topic: 'waves and optics',
    difficulty: 'easy',
    question: 'What is the relationship between wave frequency and wavelength?',
    options: [
      { id: 'a', text: 'They are directly proportional' },
      { id: 'b', text: 'They are inversely proportional (v = fλ)' },
      { id: 'c', text: 'They are unrelated' },
      { id: 'd', text: 'Both increase when wave speed increases' }
    ],
    correctOptionId: 'b',
    explanation: "Wave speed v = frequency × wavelength (v = fλ). For a fixed wave speed (like light in vacuum), doubling frequency halves wavelength. This explains why high-frequency radio waves have shorter wavelengths than low-frequency ones.",
    youtubeSearchQuery: 'wave frequency wavelength relationship v=fλ'
  },
  {
    id: 'phys_wav_2',
    subject: 'physics',
    topic: 'waves and optics',
    difficulty: 'medium',
    question: 'When light passes from air into glass, what happens to its speed and wavelength?',
    options: [
      { id: 'a', text: 'Both increase' },
      { id: 'b', text: 'Both decrease' },
      { id: 'c', text: 'Speed decreases but frequency stays constant (wavelength decreases)' },
      { id: 'd', text: 'Speed stays the same, wavelength decreases' }
    ],
    correctOptionId: 'c',
    explanation: "Light slows down when entering a denser medium (glass n≈1.5). Since frequency is determined by the source and doesn't change, and v = fλ, when v decreases, λ must decrease proportionally. This change in speed and direction is refraction.",
    youtubeSearchQuery: "light refraction speed wavelength glass Snell's law"
  },
  {
    id: 'phys_wav_3',
    subject: 'physics',
    topic: 'waves and optics',
    difficulty: 'hard',
    question: 'What is total internal reflection, and when does it occur?',
    options: [
      { id: 'a', text: 'Light reflects off a mirror with 100% efficiency' },
      { id: 'b', text: 'Light hitting an interface from a denser medium at or beyond the critical angle is completely reflected back' },
      { id: 'c', text: 'All wavelengths of light reflect equally' },
      { id: 'd', text: 'It occurs when two beams of light meet head-on' }
    ],
    correctOptionId: 'b',
    explanation: "TIR occurs when light in a denser medium (e.g., glass) hits the boundary at an angle ≥ the critical angle θc = arcsin(n2/n1). At this point, refracted angle would exceed 90° — impossible, so all light reflects internally. This is the principle behind optical fiber cables.",
    youtubeSearchQuery: 'total internal reflection critical angle optical fiber'
  },

  // Topic: "energy and thermodynamics"
  {
    id: 'phys_ener_1',
    subject: 'physics',
    topic: 'energy and thermodynamics',
    difficulty: 'easy',
    question: 'What is the law of conservation of energy?',
    options: [
      { id: 'a', text: 'Energy can be created by burning fuel' },
      { id: 'b', text: 'Energy cannot be created or destroyed, only converted between forms' },
      { id: 'c', text: 'Energy decreases over time in all systems' },
      { id: 'd', text: 'Kinetic energy and potential energy are always equal' }
    ],
    correctOptionId: 'b',
    explanation: "The first law of thermodynamics: total energy of a closed system is constant. Energy transforms — chemical to thermal, kinetic to potential, electrical to light — but the total always remains the same. No process can create or destroy energy.",
    youtubeSearchQuery: 'law conservation energy thermodynamics'
  },
  {
    id: 'phys_ener_2',
    subject: 'physics',
    topic: 'energy and thermodynamics',
    difficulty: 'medium',
    question: 'A pendulum at its highest point has maximum what, and at the lowest point has maximum what?',
    options: [
      { id: 'a', text: 'Kinetic energy at top, potential energy at bottom' },
      { id: 'b', text: 'Potential energy at top, kinetic energy at bottom' },
      { id: 'c', text: 'Both are equal throughout' },
      { id: 'd', text: 'Speed at top, height at bottom' }
    ],
    correctOptionId: 'b',
    explanation: "At the highest point: maximum gravitational PE (mgh), zero KE (momentarily stopped). At the lowest point: zero PE (h=0), maximum KE. Total mechanical energy (PE + KE) remains constant throughout (ignoring friction) — this is energy conservation in action.",
    youtubeSearchQuery: 'pendulum potential kinetic energy conservation'
  },
  {
    id: 'phys_ener_3',
    subject: 'physics',
    topic: 'energy and thermodynamics',
    difficulty: 'hard',
    question: 'Why is the Carnot efficiency the theoretical maximum for any heat engine?',
    options: [
      { id: 'a', text: 'The Carnot engine uses the best fuel' },
      { id: 'b', text: 'Any real engine has friction' },
      { id: 'c', text: 'The second law of thermodynamics sets a limit based on temperature difference between hot and cold reservoirs' },
      { id: 'd', text: 'Carnot engines run infinitely fast' }
    ],
    correctOptionId: 'c',
    explanation: "Carnot efficiency η = 1 - Tc/Th (temperatures in Kelvin). The second law forbids 100% conversion of heat to work — some heat must always be rejected to the cold reservoir. No real engine can exceed Carnot efficiency for given temperatures, because it assumes perfectly reversible processes.",
    youtubeSearchQuery: 'Carnot efficiency second law thermodynamics heat engine'
  },

  // Topic: "electromagnetism"
  {
    id: 'phys_elec_1',
    subject: 'physics',
    topic: 'electromagnetism',
    difficulty: 'easy',
    question: "What is Ohm's Law?",
    options: [
      { id: 'a', text: 'Power = Current × Voltage' },
      { id: 'b', text: 'Voltage = Current × Resistance (V = IR)' },
      { id: 'c', text: 'Resistance = Voltage × Current' },
      { id: 'd', text: 'Current = Resistance / Voltage' }
    ],
    correctOptionId: 'b',
    explanation: "Ohm's Law: V = IR. Voltage (V) across a conductor equals current (I) through it multiplied by its resistance (R). Double the voltage → double the current (for fixed resistance). Double the resistance → half the current (for fixed voltage).",
    youtubeSearchQuery: "Ohm's law V=IR explained"
  },
  {
    id: 'phys_elec_2',
    subject: 'physics',
    topic: 'electromagnetism',
    difficulty: 'medium',
    question: 'What happens to the total resistance when resistors are added in parallel?',
    options: [
      { id: 'a', text: 'Total resistance increases' },
      { id: 'b', text: 'Total resistance decreases' },
      { id: 'c', text: 'Total resistance stays the same' },
      { id: 'd', text: 'Depends on the individual resistances' }
    ],
    correctOptionId: 'b',
    explanation: "In parallel: 1/Rtotal = 1/R1 + 1/R2 + ... Adding a parallel path gives current more routes to flow — total resistance always decreases (even below the smallest individual resistor). This is why household circuits are wired in parallel — each device gets full voltage.",
    youtubeSearchQuery: 'resistors parallel total resistance decreases'
  },
  {
    id: 'phys_elec_3',
    subject: 'physics',
    topic: 'electromagnetism',
    difficulty: 'hard',
    question: 'A magnetic field can only exert force on a charge when...',
    options: [
      { id: 'a', text: 'The charge is stationary' },
      { id: 'b', text: 'The charge is moving relative to the field' },
      { id: 'c', text: 'The field is increasing in strength' },
      { id: 'd', text: 'The charge is negative' }
    ],
    correctOptionId: 'b',
    explanation: "The Lorentz force F = qv × B — force is zero when v = 0. A magnetic field does no work on a charge (force is always perpendicular to velocity), but it deflects moving charges. This is why charged particles travel in circles in uniform magnetic fields.",
    youtubeSearchQuery: 'magnetic force moving charge Lorentz force'
  },

  // --- MATHEMATICS ---
  // Topic: "calculus"
  {
    id: 'math_calc_1',
    subject: 'maths',
    topic: 'calculus',
    difficulty: 'easy',
    question: 'What does a derivative represent geometrically?',
    options: [
      { id: 'a', text: 'The area under a curve' },
      { id: 'b', text: 'The slope of the tangent line to the curve at a point' },
      { id: 'c', text: 'The total length of a curve' },
      { id: 'd', text: 'The maximum value of a function' }
    ],
    correctOptionId: 'b',
    explanation: "The derivative f'(x) gives the instantaneous rate of change — geometrically, the slope of the tangent line at that exact point. At a peak or trough of a curve, f'(x) = 0 (horizontal tangent). Steeper curves have larger derivative values.",
    youtubeSearchQuery: 'derivative tangent line slope geometric meaning'
  },
  {
    id: 'math_calc_2',
    subject: 'maths',
    topic: 'calculus',
    difficulty: 'medium',
    question: 'What is the derivative of sin(x)?',
    options: [
      { id: 'a', text: '-cos(x)' },
      { id: 'b', text: 'cos(x)' },
      { id: 'c', text: '-sin(x)' },
      { id: 'd', text: 'tan(x)' }
    ],
    correctOptionId: 'b',
    explanation: "d/dx[sin(x)] = cos(x). You can see this geometrically: at x=0, sin(x) is rising steeply — and cos(0) = 1, the maximum slope. At x=π/2, sin(x) is at its peak and momentarily flat — cos(π/2) = 0, zero slope. The derivative perfectly captures this.",
    youtubeSearchQuery: 'derivative sin x equals cos x proof'
  },
  {
    id: 'math_calc_3',
    subject: 'maths',
    topic: 'calculus',
    difficulty: 'hard',
    question: 'What does the Fundamental Theorem of Calculus connect?',
    options: [
      { id: 'a', text: 'Algebra and geometry' },
      { id: 'b', text: 'Differentiation and integration — they are inverse operations' },
      { id: 'c', text: 'Limits and continuity' },
      { id: 'd', text: 'Trigonometry and exponentials' }
    ],
    correctOptionId: 'b',
    explanation: "The FTC states: ∫[a to b] f(x)dx = F(b) - F(a), where F'(x) = f(x). Integration (area under curve) and differentiation (slope/rate) are inverse operations. This was one of the most profound discoveries in mathematics — Newton and Leibniz independently found it.",
    youtubeSearchQuery: 'fundamental theorem calculus differentiation integration inverse'
  },

  // Topic: "geometry"
  {
    id: 'math_geom_1',
    subject: 'maths',
    topic: 'geometry',
    difficulty: 'easy',
    question: 'What is the formula for the volume of a sphere with radius r?',
    options: [
      { id: 'a', text: 'πr²' },
      { id: 'b', text: '4πr²' },
      { id: 'c', text: '(4/3)πr³' },
      { id: 'd', text: '(2/3)πr³' }
    ],
    correctOptionId: 'c',
    explanation: "V = (4/3)πr³. Volume scales with the CUBE of radius — double the radius means 8× the volume. Surface area = 4πr² scales with radius squared. These formulas were first derived by Archimedes, who considered it his greatest achievement.",
    youtubeSearchQuery: 'sphere volume formula 4/3 pi r cubed'
  },
  {
    id: 'math_geom_2',
    subject: 'maths',
    topic: 'geometry',
    difficulty: 'medium',
    question: 'What is the sum of interior angles of any triangle?',
    options: [
      { id: 'a', text: '90°' },
      { id: 'b', text: '270°' },
      { id: 'c', text: '360°' },
      { id: 'd', text: '180°' }
    ],
    correctOptionId: 'd',
    explanation: "The sum of interior angles of any triangle = 180°. This is true on a flat (Euclidean) plane. On a curved surface (like Earth), the sum can exceed 180° — the triangle formed by the North Pole and two equatorial points has three 90° angles (summing to 270°).",
    youtubeSearchQuery: 'triangle interior angles sum 180 degrees proof'
  },
  {
    id: 'math_geom_3',
    subject: 'maths',
    topic: 'geometry',
    difficulty: 'hard',
    question: 'In a right triangle, if one angle is 30°, what is the ratio of the opposite side to the hypotenuse?',
    options: [
      { id: 'a', text: '1/2' },
      { id: 'b', text: '√3/2' },
      { id: 'c', text: '1/√3' },
      { id: 'd', text: '√3' }
    ],
    correctOptionId: 'a',
    explanation: "sin(30°) = opposite/hypotenuse = 1/2. In the special 30-60-90 triangle with hypotenuse 1: sides are 1/2, √3/2, 1. sin(30°) = 1/2, cos(30°) = √3/2, tan(30°) = 1/√3. These exact values are fundamental and should be memorized.",
    youtubeSearchQuery: '30 60 90 triangle sin cos tan exact values'
  },

  // Topic: "algebra"
  {
    id: 'math_alg_1',
    subject: 'maths',
    topic: 'algebra',
    difficulty: 'easy',
    question: 'What are the solutions to x² - 5x + 6 = 0?',
    options: [
      { id: 'a', text: 'x = 1 and x = 6' },
      { id: 'b', text: 'x = 2 and x = 3' },
      { id: 'c', text: 'x = -2 and x = -3' },
      { id: 'd', text: 'x = 5 and x = 1' }
    ],
    correctOptionId: 'b',
    explanation: "Factor: x² - 5x + 6 = (x-2)(x-3) = 0. So x = 2 or x = 3. Check: (2)²-5(2)+6 = 4-10+6 = 0 ✓ and (3)²-5(3)+6 = 9-15+6 = 0 ✓. Always verify solutions by substitution.",
    youtubeSearchQuery: 'quadratic equation factoring x squared examples'
  },
  {
    id: 'math_alg_2',
    subject: 'maths',
    topic: 'algebra',
    difficulty: 'medium',
    question: 'What does the discriminant (b² - 4ac) tell you about a quadratic equation?',
    options: [
      { id: 'a', text: 'The vertex of the parabola' },
      { id: 'b', text: 'The number and type of roots (positive=2 real, zero=1 real, negative=no real roots)' },
      { id: 'c', text: 'The axis of symmetry' },
      { id: 'd', text: 'The y-intercept' }
    ],
    correctOptionId: 'b',
    explanation: "For ax²+bx+c=0: if b²-4ac > 0: two distinct real roots (parabola crosses x-axis twice). If = 0: one repeated root (parabola touches x-axis once). If < 0: two complex conjugate roots (parabola doesn't cross x-axis — roots are imaginary).",
    youtubeSearchQuery: 'discriminant quadratic equation roots real complex'
  },
  {
    id: 'math_alg_3',
    subject: 'maths',
    topic: 'algebra',
    difficulty: 'hard',
    question: 'If f(x) = 2x + 3 and g(x) = x², what is f(g(x))?',
    options: [
      { id: 'a', text: '2x² + 3' },
      { id: 'b', text: '(2x+3)²' },
      { id: 'c', text: '4x² + 3' },
      { id: 'd', text: '2x + 3x²' }
    ],
    correctOptionId: 'a',
    explanation: "f(g(x)) means apply g first, then f. g(x) = x², so substitute into f: f(x²) = 2(x²) + 3 = 2x² + 3. Note: f(g(x)) ≠ g(f(x)). g(f(x)) = (2x+3)² = 4x²+12x+9. Function composition is not commutative.",
    youtubeSearchQuery: 'function composition f of g x examples'
  },

  // --- PROGRAMMING ---
  // Topic: "computational thinking"
  {
    id: 'prog_comp_1',
    subject: 'programming',
    topic: 'computational thinking',
    difficulty: 'easy',
    question: 'What is an algorithm?',
    options: [
      { id: 'a', text: 'A type of computer hardware' },
      { id: 'b', text: 'A step-by-step set of instructions to solve a problem' },
      { id: 'c', text: 'A programming language' },
      { id: 'd', text: 'A mathematical equation' }
    ],
    correctOptionId: 'b',
    explanation: "An algorithm is a finite, ordered set of instructions that transforms an input into an output. Algorithms must be unambiguous (each step is clear), finite (they terminate), and effective (each step is doable). A recipe is an algorithm. So is long division.",
    youtubeSearchQuery: 'algorithm definition computational thinking steps'
  },
  {
    id: 'prog_comp_2',
    subject: 'programming',
    topic: 'computational thinking',
    difficulty: 'medium',
    question: 'What is the purpose of a loop in programming?',
    options: [
      { id: 'a', text: 'To stop the program' },
      { id: 'b', text: 'To repeat a block of code without writing it multiple times' },
      { id: 'c', text: 'To make the program run faster' },
      { id: 'd', text: 'To create new variables' }
    ],
    correctOptionId: 'b',
    explanation: "Loops (for, while, repeat) execute a block of code multiple times based on a condition. Without loops, a program to print numbers 1-1000 would need 1000 print statements. With a loop: for i in range(1, 1001): print(i) — 2 lines. DRY principle: Don't Repeat Yourself.",
    youtubeSearchQuery: 'loops programming for while repeat purpose'
  },
  {
    id: 'prog_comp_3',
    subject: 'programming',
    topic: 'computational thinking',
    difficulty: 'hard',
    question: 'What is the time complexity of a binary search algorithm?',
    options: [
      { id: 'a', text: 'O(n) — linear time' },
      { id: 'b', text: 'O(n²) — quadratic time' },
      { id: 'c', text: 'O(log n) — logarithmic time' },
      { id: 'd', text: 'O(1) — constant time' }
    ],
    correctOptionId: 'c',
    explanation: "Binary search halves the search space each step. For n=1000: step 1 checks 500, step 2 checks 250...after log₂(1000) ≈ 10 steps, found. Compare to linear search needing up to 1000 steps. O(log n) grows incredibly slowly — O(log 1,000,000) = only 20 steps.",
    youtubeSearchQuery: 'binary search O log n time complexity explained'
  },

  // Topic: "logic and conditionals"
  {
    id: 'prog_log_1',
    subject: 'programming',
    topic: 'logic and conditionals',
    difficulty: 'easy',
    question: 'What does an if-else statement do?',
    options: [
      { id: 'a', text: 'Runs all code twice' },
      { id: 'b', text: 'Executes one block of code if condition is true, another if false' },
      { id: 'c', text: 'Creates a loop' },
      { id: 'd', text: 'Defines a new function' }
    ],
    correctOptionId: 'b',
    explanation: "if-else is the fundamental decision structure. If condition = true: run block A. Else: run block B. You can chain multiple conditions with elif/else if. Every complex program is built from these simple true/false decisions.",
    youtubeSearchQuery: 'if else statement programming conditionals'
  },
  {
    id: 'prog_log_2',
    subject: 'programming',
    topic: 'logic and conditionals',
    difficulty: 'medium',
    question: 'What is the difference between = and == in most programming languages?',
    options: [
      { id: 'a', text: 'No difference, both assign values' },
      { id: 'b', text: '= assigns a value, == compares two values for equality' },
      { id: 'c', text: '== is used in math, = is used in code' },
      { id: 'd', text: '= is for numbers, == is for strings' }
    ],
    correctOptionId: 'b',
    explanation: "= is the assignment operator (x = 5 puts 5 into x). == is the comparison operator (x == 5 checks if x equals 5, returns True/False). Confusing them is one of the most common beginner bugs: if x = 5 (assigns 5, always true!) vs if x == 5 (checks if x is 5).",
    youtubeSearchQuery: 'assignment vs comparison operator = vs == programming bug'
  },
  {
    id: 'prog_log_3',
    subject: 'programming',
    topic: 'logic and conditionals',
    difficulty: 'hard',
    question: 'What is short-circuit evaluation in boolean logic?',
    options: [
      { id: 'a', text: 'The program crashes early when it finds an error' },
      { id: 'b', text: 'In AND, if the first condition is False the second is never evaluated; in OR, if first is True second is skipped' },
      { id: 'c', text: 'Boolean operations always evaluate faster than arithmetic' },
      { id: 'd', text: 'Using less code to write boolean expressions' }
    ],
    correctOptionId: 'b',
    explanation: "AND short-circuits: False AND (anything) = False — no need to check second. OR short-circuits: True OR (anything) = True — no need to check second. This is used intentionally: 'if ptr != null AND ptr.value > 5' — if ptr is null, the second check is skipped, preventing a crash.",
    youtubeSearchQuery: 'short circuit evaluation boolean AND OR programming'
  },

  // Topic: "data structures"
  {
    id: 'prog_data_1',
    subject: 'programming',
    topic: 'data structures',
    difficulty: 'easy',
    question: 'What is an array (or list)?',
    options: [
      { id: 'a', text: 'A single variable storing one value' },
      { id: 'b', text: 'An ordered collection of items stored at contiguous memory locations' },
      { id: 'c', text: 'A type of loop' },
      { id: 'd', text: 'A way to connect two programs' }
    ],
    correctOptionId: 'b',
    explanation: "An array stores multiple items of the same type in order, each at an index (usually starting at 0). arr[0] is the first element, arr[n-1] is the last. Arrays allow O(1) access by index but O(n) search if unsorted. They are the foundation of almost every data structure.",
    youtubeSearchQuery: 'array data structure index elements explained'
  },
  {
    id: 'prog_data_2',
    subject: 'programming',
    topic: 'data structures',
    difficulty: 'medium',
    question: 'What is the key difference between a stack and a queue?',
    options: [
      { id: 'a', text: 'Stacks are faster than queues' },
      { id: 'b', text: 'Stack is LIFO (last in, first out), queue is FIFO (first in, first out)' },
      { id: 'c', text: 'Queues can hold more items than stacks' },
      { id: 'd', text: 'Stacks are for numbers, queues for strings' }
    ],
    correctOptionId: 'b',
    explanation: "Stack (LIFO): like a stack of plates — last one placed is first removed. Used for: function call stacks, undo operations, parsing. Queue (FIFO): like a ticket line — first in, first out. Used for: task scheduling, BFS traversal, print spoolers.",
    youtubeSearchQuery: 'stack LIFO queue FIFO data structures difference'
  },
  {
    id: 'prog_data_3',
    subject: 'programming',
    topic: 'data structures',
    difficulty: 'hard',
    question: 'Why does inserting at the beginning of a linked list take O(1) time, but inserting at the beginning of an array takes O(n) time?',
    options: [
      { id: 'a', text: 'Linked lists are always faster' },
      { id: 'b', text: 'Arrays require shifting all elements right by one position; linked lists only update two pointers' },
      { id: 'c', text: 'Arrays use more memory than linked lists' },
      { id: 'd', text: 'Linked lists are sorted automatically' }
    ],
    correctOptionId: 'b',
    explanation: "Array insert at index 0: shift every element right by 1 (n operations for n elements) → O(n). Linked list insert at head: create new node, point it to current head, update head pointer → 3 operations regardless of list size → O(1). This is why linked lists are preferred for frequent insertions.",
    youtubeSearchQuery: 'linked list vs array insert O(1) vs O(n) pointer'
  }
]

export default QUIZ_QUESTIONS
