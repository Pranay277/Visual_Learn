# VisualLearn: 3D Interactive Learning Platform

VisualLearn is a next-generation educational platform that transforms abstract concepts into highly interactive, real-time 3D visualizations. Powered by React, Vite, and React Three Fiber, the platform covers 5 core STEM subjects and integrates deeply with **Lumina**, an intelligent AI Copilot powered by the Gemini API. Lumina watches everything the student does in 3D space and provides context-aware tutoring and Socratic guidance.

## 🚀 Features by Module

### 🧬 Biology: Anatomy Studio
Explore the human body using dynamically loaded, high-fidelity PBR 3D models.
- **Dynamic Asset Loading:** A Node.js indexing script automatically scans the `public/models/biology` directory and generates a dynamic JSON curriculum without hardcoded paths.
- **PBR Textures:** Uses `@react-three/drei` to load complex FBX models alongside their Base Color, Normal, Roughness, Metallic, and Emissive texture maps dynamically at runtime.
- **AI Context Pipe:** Clicking on any organ (e.g., Liver, Heart) updates Lumina's context state, allowing the AI to seamlessly answer targeted physiological questions.

### 🧪 Chemistry: Molecular Viewer
Visualize and inspect molecular structures, geometries, and properties.
- **VSEPR Rendering:** Plots atoms and creates dynamically calculated bond cylinders (single and double bonds) using exact atomic coordinates.
- **CPK Coloring:** Automatically colors atoms based on the standard CPK chemistry color scheme (e.g., Oxygen=Red, Carbon=Grey).
- **Interactive Inspection:** Hover over individual atoms or bonds to reveal specific elements, masses, and electronegativity data.

### 🔭 Physics: Simulation Lab
Tweak parameters and immediately see the physical laws play out in 6 distinct environments:
- **Projectile Motion:** Real-time parabolic trajectory plotting using kinematics.
- **Spring Oscillator:** A procedurally generated zig-zag mesh demonstrating Hooke’s Law.
- **Simple Pendulum:** Trigonometric harmonic oscillation computation.
- **Electric Fields:** Visualizing Coulomb's Law via procedural Bezier curves indicating attraction/repulsion.
- **Wave Interference:** Demonstrating constructive/destructive interference using overlapping animated rings.
- **Optics (Snell's Law):** Interactive light ray tracing through different refractive mediums.

### 📐 Mathematics: Visualization Grid
Turn dry equations into interactive 2D and 3D geometric realities.
- **Calculus:** Drag a slider to see an instantaneous derivative (tangent line) walk along a sine curve.
- **Linear Algebra:** Visualize Matrix transformations (Scale, Shear) manipulating a responsive 2D grid.
- **Geometry:** Watch parametric volumes and areas recalculate in real-time as you tweak dimensions.

### 💻 Programming: Logic Engine
A complete, custom-built 2D game engine to teach computational thinking.
- **Block-Based Drag & Drop:** Users can drag visual code blocks (Loops, Conditionals, Moves) into a workspace.
- **Custom Interpreter Engine:** An asynchronous AST (Abstract Syntax Tree) interpreter parses the blocks, handles nested loops, evaluates conditions, and animates a character sprite across an HTML5 Canvas grid.
- **Live Terminal Console:** Standard stdout emulation to visualize execution flow and debug logic.

---

## 🧠 Lumina AI Copilot Architecture
The entire platform is wrapped in the `LuminaContext`. Every component — from a clicked atom in Chemistry to a tweaked gravity slider in Physics — dispatches its state up to the centralized AI Context pipeline.

When a student opens the sleek, right-side sliding drawer and asks a question, Lumina (Gemini 2.5 Pro) receives a hidden system payload containing the **exact state of the 3D canvas**. This allows the AI to provide shockingly relevant answers, such as: *"I see you've increased the mass of the pendulum to 15kg. Notice how the period didn't change? Let's discuss why mass doesn't affect harmonic oscillation!"*

---

## 📂 Project Structure Overview

- `/src/App.tsx`: Central router and LuminaContext state provider handling API communication.
- `/src/components/layout/MainLayout.tsx`: Premium dark-mode navbar and global wrapper.
- `/src/components/ai/CopilotDrawer.tsx`: The animated sliding UI for the Gemini-powered tutor.
- `/src/components/3d/CanvasSetup.tsx`: The standardized WebGL canvas wrapper used across all modules.
- `/src/subjects/biology/`: FBX/Texture loaders, dynamic indexing JSON, and the R3F Anatomy Scene.
- `/src/subjects/chemistry/`: Molecule database, bond calculations, and VSEPR viewers.
- `/src/subjects/maths/`: Equation renderers, 2D planes, and transformation scenes.
- `/src/subjects/physics/`: Reactive parameter controls and 6 separate physics animation loops.
- `/src/subjects/programming/`: HTML5 Canvas game renderer, drag/drop UI, and the async block interpreter.
- `generate_biology_index.cjs`: The build script used to ensure 3D model assets are read dynamically.

---

## 🛠️ Setup Instructions
1. Clone the repository.
2. Run `npm install`.
3. Add a `.env` file with your Gemini key: `VITE_GEMINI_API_KEY=your_key_here`.
4. Run `npm run dev` to start the Vite development server.
