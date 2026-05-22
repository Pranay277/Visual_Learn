import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Html } from '@react-three/drei';

interface CanvasSetupProps {
  children: React.ReactNode;
  className?: string;
}

const CanvasLoader = () => {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-2"></div>
        <div className="text-white font-medium whitespace-nowrap">Loading 3D Assets...</div>
      </div>
    </Html>
  );
};

const CanvasSetup = ({ children, className = '' }: CanvasSetupProps) => {
  return (
    <div className={`w-full h-full ${className}`} style={{ width: '100%', height: '100%' }}>
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 60 }} gl={{ localClippingEnabled: true }}>
        <Suspense fallback={<CanvasLoader />}>
          {/* Lighting */}
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
          <pointLight position={[-10, -10, -5]} intensity={0.4} />
          
          {/* Environment for PBR reflections */}
          <Environment preset="studio" />
          
          {/* Controls */}
          <OrbitControls 
            enablePan={true} 
            enableZoom={true} 
            enableRotate={true} 
          />
          
          {/* Dynamic Subject Content */}
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default CanvasSetup;
