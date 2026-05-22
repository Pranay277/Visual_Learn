# VisualLearn: 3D Interactive Learning Platform

VisualLearn is a next-generation educational platform that transforms abstract concepts into highly interactive, real-time 3D visualizations. Powered by React, Vite, and React Three Fiber, the platform covers 5 core STEM subjects and integrates deeply with a **Dual-Agent AI Copilot** powered by the Gemini API. 

The AI system features **Lumina**, a serious context-aware tutor that watches everything the student does in 3D space, and **Brahmi**, a witty commentator who jumps into the conversation with sarcastic, culturally relevant, and humorous analogies!

## 🚀 Features by Module

### 🧬 Biology: Anatomy Studio
Explore the human body using dynamically loaded, high-fidelity PBR 3D models.
- **Dynamic Asset Loading:** A Node.js indexing script automatically scans the `public/models/biology` directory and generates a dynamic JSON curriculum without hardcoded paths.
- **PBR Textures:** Uses `@react-three/drei` to load complex FBX models alongside their Base Color, Normal, Roughness, Metallic, and Emissive texture maps dynamically at runtime.
- **AI Context Pipe:** Clicking on any organ (e.g., Liver, Heart) updates the AI's context state seamlessly.

### 🧪 Chemistry: Molecular Viewer
Visualize and inspect molecular structures, geometries, and properties.
- **VSEPR Rendering:** Plots atoms and creates dynamically calculated bond cylinders (single and double bonds) using exact atomic coordinates.
- **CPK Coloring:** Automatically colors atoms based on the standard CPK chemistry color scheme.
- **Interactive Inspection:** Hover over individual atoms or bonds to reveal specific elements, masses, and electronegativity data.

### 🔭 Physics: Simulation Lab
Tweak parameters and immediately see the physical laws play out in 6 distinct environments:
- **Projectile Motion, Spring Oscillator, Pendulum, Electric Fields, Wave Interference, Optics (Snell's Law).**

### 📐 Mathematics: Visualization Grid
Turn dry equations into interactive 2D and 3D geometric realities.
- **Calculus:** Drag a slider to see an instantaneous derivative (tangent line) walk along a sine curve.
- **Linear Algebra:** Visualize Matrix transformations (Scale, Shear) manipulating a responsive 2D grid.
- **Geometry:** Watch parametric volumes and areas recalculate in real-time.

### 💻 Programming: Logic Engine
A complete, custom-built 2D game engine to teach computational thinking.
- **Block-Based Drag & Drop:** Users can drag visual code blocks (Loops, Conditionals, Moves) into a workspace.
- **Custom Interpreter Engine:** An asynchronous AST interpreter parses the blocks and animates a character sprite across an HTML5 Canvas grid.
- **Live Terminal Console:** Standard stdout emulation to visualize execution flow and debug logic.

---

## 🧠 Dual-Agent AI Architecture
The entire platform is wrapped in the `LuminaContext`. Every component dispatches its state up to the centralized AI Context pipeline.

1. **Lumina (The Tutor):** Receives a hidden system payload containing the **exact state of the 3D canvas**. This allows the AI to provide shockingly relevant answers, such as: *"I see you've increased the mass of the pendulum to 15kg..."*
2. **Brahmi (The Commentator):** A secondary agent that dynamically intercepts Lumina's answers and appends witty, meme-filled, or sarcastic commentary to keep the student entertained and engaged!

## 📊 Evaluation & Quizzes
- **Interactive Quizzes:** Each subject features dynamic, real-time quizzes.
- **Performance Tracking:** A performance modal tracks your scores and historical data.
- **Smart Recommendations:** If a student struggles with a topic, the platform automatically recommends highly-relevant, targeted YouTube tutorial videos using the YouTube Data API!

---

## 📂 Project Structure Overview

- `/src/App.tsx`: Central router and LuminaContext state provider handling API communication & Agent streaming.
- `/src/components/layout/MainLayout.tsx`: Premium dark-mode navbar and global wrapper.
- `/src/components/ai/CopilotDrawer.tsx`: The animated sliding UI for the Dual-Agent Copilot.
- `/src/quiz/`: Core quiz engine, performance tracking, and YouTube recommendation logic.
- `/src/components/3d/`: Standardized WebGL canvas wrappers.
- `/src/subjects/`: Distinct folders for Biology, Chemistry, Maths, Physics, and Programming.

---

## 🛠️ Setup Instructions
1. Clone the repository.
2. Run `npm install`.
3. Add a `.env` file with your keys: 
   \`\`\`env
   VITE_GEMINI_API_KEY=your_gemini_key_here
   VITE_YOUTUBE_API_KEY=your_youtube_key_here
   \`\`\`
4. Run `npm run dev` to start the Vite development server.
