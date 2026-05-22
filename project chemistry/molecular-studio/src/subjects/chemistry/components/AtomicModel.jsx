import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Line, Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';

export default function AtomicModel({ protons, neutrons, electrons }) {
  const nucleusRef = useRef();
  
  // Calculate shells (K, L, M, N...) using 2n^2 rule
  const shells = useMemo(() => {
    let remainingE = electrons;
    const config = [];
    let n = 1;
    while (remainingE > 0) {
      const maxInShell = 2 * n * n;
      const inThisShell = Math.min(remainingE, maxInShell);
      config.push({ n, count: inThisShell, radius: n * 2 });
      remainingE -= inThisShell;
      n++;
    }
    return config;
  }, [electrons]);

  useFrame((state, delta) => {
    if (nucleusRef.current) {
      nucleusRef.current.rotation.y += delta * 0.5;
      nucleusRef.current.rotation.x += delta * 0.2;
    }
  });

  return (
    <group>
      {/* Nucleus */}
      <group ref={nucleusRef}>
        <Sphere args={[0.8, 32, 32]}>
          <meshPhysicalMaterial color="#ef4444" clearcoat={1} roughness={0.2} />
        </Sphere>
      </group>
      
      <Billboard position={[0, 1.2, 0]}>
        <Text fontSize={0.6} color="white" outlineWidth={0.05} outlineColor="black">
          {protons}p⁺ {neutrons}n⁰
        </Text>
      </Billboard>

      {/* Electron Shells */}
      {shells.map((shell) => {
        // Create circle points for orbit line
        const points = [];
        for (let j = 0; j <= 64; j++) {
          const angle = (j / 64) * Math.PI * 2;
          points.push(new THREE.Vector3(Math.cos(angle) * shell.radius, 0, Math.sin(angle) * shell.radius));
        }

        return (
          <group key={`shell-${shell.n}`}>
            <Line points={points} color="#4b5563" lineWidth={1.5} opacity={0.3} transparent />
            {/* Electrons in this shell */}
            {Array.from({ length: shell.count }).map((_, eIdx) => {
              const angle = (eIdx / shell.count) * Math.PI * 2;
              return (
                <Electron 
                  key={`e-${shell.n}-${eIdx}`} 
                  radius={shell.radius} 
                  initialAngle={angle} 
                  speed={0.5 / shell.n} 
                />
              );
            })}
          </group>
        );
      })}
    </group>
  );
}

function Electron({ radius, initialAngle, speed }) {
  const ref = useRef();
  
  useFrame((state) => {
    // Dynamic orbiting
    const angle = initialAngle + state.clock.elapsedTime * speed * 3;
    ref.current.position.x = Math.cos(angle) * radius;
    ref.current.position.z = Math.sin(angle) * radius;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshBasicMaterial color="#3b82f6" />
      <pointLight distance={2} intensity={1} color="#3b82f6" />
    </mesh>
  );
}
