import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float } from '@react-three/drei';
import MoleculeModel from './MoleculeModel';
import { moleculesData } from '../data/chemistryData';

export default function CanvasView({ activeMolecule, isSpaceFilling }) {
  const moleculeData = moleculesData[activeMolecule];

  return (
    <div className="canvas-container">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <color attach="background" args={['transparent']} />
        
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 10]} intensity={1.5} castShadow />
        <spotLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
        
        <Suspense fallback={null}>
          <Environment preset="city" />
          
          <Float 
            speed={1.5} // Animation speed
            rotationIntensity={0.2} // XYZ rotation intensity
            floatIntensity={0.5} // Up/down float intensity
          >
            <MoleculeModel 
              moleculeData={moleculeData} 
              isSpaceFilling={isSpaceFilling} 
            />
          </Float>

          {/* Add a beautiful soft shadow below the molecule */}
          <ContactShadows 
            position={[0, -2.5, 0]} 
            opacity={0.4} 
            scale={10} 
            blur={2} 
            far={4} 
            color="#000000"
          />
        </Suspense>

        {/* Interaction */}
        <OrbitControls 
          enablePan={false} 
          minDistance={3} 
          maxDistance={12} 
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}
