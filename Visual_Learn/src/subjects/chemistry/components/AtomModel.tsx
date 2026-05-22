import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AtomModelProps {
  atomicNumber: number;
}

export default function AtomModel({ atomicNumber }: AtomModelProps) {
  const electronGroupRef = useRef<THREE.Group>(null);
  
  // Simple Bohr model distribution (2, 8, 18, 32...)
  const shells = useMemo(() => {
    let remaining = atomicNumber;
    const distribution = [];
    const maxPerShell = [2, 8, 18, 32, 32, 18, 8];
    
    for (let i = 0; i < maxPerShell.length; i++) {
      if (remaining <= 0) break;
      const count = Math.min(remaining, maxPerShell[i]);
      distribution.push(count);
      remaining -= count;
    }
    return distribution;
  }, [atomicNumber]);

  useFrame((state, delta) => {
    if (electronGroupRef.current) {
      // Rotate the entire electron cloud slowly
      electronGroupRef.current.rotation.y += delta * 0.5;
      electronGroupRef.current.rotation.x += delta * 0.2;
      
      // Rotate individual shells at different speeds
      electronGroupRef.current.children.forEach((shell, i) => {
        const speed = 1 + (1 / (i + 1));
        shell.rotation.z += delta * speed * (i % 2 === 0 ? 1 : -1);
      });
    }
  });

  return (
    <group>
      {/* Nucleus */}
      <mesh>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color="#ef4444" emissive="#991b1b" roughness={0.2} metalness={0.8} />
      </mesh>
      
      {/* Nucleus Glow */}
      <mesh>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Electron Shells */}
      <group ref={electronGroupRef}>
        {shells.map((electronCount, shellIdx) => {
          const radius = 1.0 + shellIdx * 0.7; // Outer shells get progressively further
          
          // Randomize initial tilt for each shell to make it look spherical
          const tiltX = Math.random() * Math.PI;
          const tiltY = Math.random() * Math.PI;

          return (
            <group key={shellIdx} rotation={[tiltX, tiltY, 0]}>
              {/* Orbital Ring */}
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[radius, 0.015, 16, 100]} />
                <meshBasicMaterial color="#60a5fa" transparent opacity={0.4} />
              </mesh>

              {/* Electrons */}
              {Array.from({ length: electronCount }).map((_, eIdx) => {
                const angle = (eIdx / electronCount) * Math.PI * 2;
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;
                return (
                  <mesh key={eIdx} position={[x, 0, z]}>
                    <sphereGeometry args={[0.08, 16, 16]} />
                    <meshStandardMaterial color="#93c5fd" emissive="#3b82f6" emissiveIntensity={2} roughness={0.1} metalness={1} />
                  </mesh>
                );
              })}
            </group>
          );
        })}
      </group>
    </group>
  );
}
